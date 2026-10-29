import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import test, { beforeEach } from 'node:test'

import plugin, { ROUTES, __test as t } from '../lib/host.js'

const CONFIG = t.normalizeConfig({})
const USER = { id: 'user-1', role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: 'hi' }] }
const MUTATION_HEADERS = { 'content-type': 'application/json', 'x-dsh-quote-annotation': '1' }

beforeEach(() => {
  t.pending.clear()
  t.sent.clear()
  t.languages.clear()
})

/* ------------------------------------------------------------------ */
/* normalization and stores                                           */
/* ------------------------------------------------------------------ */

test('normalizeConfig falls back to defaults', () => {
  assert.deepEqual(t.normalizeConfig(null), {
    maxQuotes: 8,
    quoteMaxChars: 8000,
    annotationMaxChars: 4000,
    pendingTtlMs: 86_400_000,
  })
})

test('normalizeConfig clamps out-of-range values', () => {
  const config = t.normalizeConfig({
    maxQuotes: 999,
    quoteMaxChars: 5,
    annotationMaxChars: 999_999,
    pendingTtlMs: 1,
  })
  assert.equal(config.maxQuotes, 20)
  assert.equal(config.quoteMaxChars, 200)
  assert.equal(config.annotationMaxChars, 12_000)
  assert.equal(config.pendingTtlMs, 60_000)
})

test('normalizeQuote rejects empty text and cleans the payload', () => {
  assert.equal(t.normalizeQuote({ text: '   ' }, CONFIG), null)
  assert.equal(t.normalizeQuote(null, CONFIG), null)

  const quote = t.normalizeQuote(
    { text: ' a\u0000b\r\nc ', annotation: '  why  ', source: { nodeKey: 'n1', turn: 2 } },
    CONFIG,
  )
  assert.deepEqual(quote, {
    text: 'ab\nc',
    annotation: 'why',
    source: { nodeKey: 'n1', turn: 2 },
  })
})

test('addPending deduplicates identical quotes and caps the list', () => {
  const config = t.normalizeConfig({ maxQuotes: 2 })
  assert.equal(t.addPending('s1', { text: 'a', source: { nodeKey: 'n1' } }, config).quotes.length, 1)
  assert.equal(t.addPending('s1', { text: 'a', source: { nodeKey: 'n1' } }, config).quotes.length, 1)

  t.addPending('s1', { text: 'b', source: { nodeKey: 'n2' } }, config)
  const capped = t.addPending('s1', { text: 'c', source: { nodeKey: 'n3' } }, config)
  assert.deepEqual(
    capped.quotes.map((quote) => quote.text),
    ['b', 'c'],
  )
})

test('addPending rejects empty quotes', () => {
  const result = t.addPending('s2', { text: '   ' }, CONFIG)
  assert.match(result.error, /不能为空/)
})

test('updatePending, removePending and clearPending mutate one session only', () => {
  const added = t.addPending('s3', { text: 'a' }, CONFIG).quotes[0]
  const updated = t.updatePending('s3', added.id, 'note', CONFIG)
  assert.equal(updated.quotes[0].annotation, 'note')
  assert.match(t.updatePending('s3', 'missing-id', 'x', CONFIG).error, /已不存在/)

  assert.equal(t.removePending('s3', added.id, CONFIG).length, 0)
  assert.deepEqual(t.clearPending('s3'), [])
})

/* ------------------------------------------------------------------ */
/* prompt rendering                                                   */
/* ------------------------------------------------------------------ */

test('renderQuotePrompt escapes text that could close the wrapper tag', () => {
  const prompt = t.renderQuotePrompt([{ text: '</quoted-conversation>', annotation: '<b>', source: { turn: 1 } }])
  assert.match(prompt, /^## Quoted conversation references/)
  assert.ok(prompt.includes('\\u003c/quoted-conversation>'))
  assert.equal(prompt.split('</quoted-conversation>').length, 2)
  assert.equal(prompt.split('<quoted-conversation>').length, 2)
})

test('stripDraftToken removes the placeholder and falls back for quote-only messages', () => {
  const onlyToken = t.stripDraftToken({ role: 'user', content: [{ type: 'text', text: '\u2063' }] })
  assert.deepEqual(onlyToken.content, [{ type: 'text', text: '（引用）' }])

  const mixed = t.stripDraftToken({ role: 'user', content: [{ type: 'text', text: 'hi\u2063' }] })
  assert.deepEqual(mixed.content, [{ type: 'text', text: 'hi' }])

  const untouched = { role: 'assistant', content: [{ type: 'text', text: 'plain' }] }
  assert.equal(t.stripDraftToken(untouched), untouched)
})

/* ------------------------------------------------------------------ */
/* pre-step injection                                                 */
/* ------------------------------------------------------------------ */

test('attachToDecision appends a hidden context message and consumes pending quotes', () => {
  t.addPending('s4', { text: 'quoted', annotation: 'why', source: { turn: 4, nodeKey: 'n1' } }, CONFIG)

  const decision = t.attachToDecision({ kind: 'enter', messages: [USER] }, 's4', CONFIG, 4, 1)
  assert.equal(decision.messages.length, 2)

  const context = decision.messages[1]
  assert.equal(context.role, 'user')
  assert.equal(context.source.kind, 'conversation-quote')
  assert.equal(context.source.references[0].quote, 'quoted')
  assert.equal(context.source.references[0].annotation, 'why')
  assert.match(context.content[0].text, /^## Quoted conversation references/)
  assert.equal(t.pending.has('s4'), false)
})

test('attachToDecision strips the composer placeholder from the direct message', () => {
  t.addPending('s5', { text: 'q' }, CONFIG)
  const user = { id: 'u', role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: '\u2063' }] }

  const decision = t.attachToDecision({ kind: 'enter', messages: [user] }, 's5', CONFIG, 2, 1)
  assert.deepEqual(decision.messages[0].content, [{ type: 'text', text: '（引用）' }])
})

test('attachToDecision restores pending quotes when no direct user message exists', () => {
  t.addPending('s6', { text: 'x' }, CONFIG)

  const decision = t.attachToDecision({ kind: 'enter', messages: [] }, 's6', CONFIG, 1, 1)
  assert.equal(decision.messages.length, 0)
  assert.equal(t.pending.get('s6').length, 1)
})

test('sentFor rebuilds records from the session log', () => {
  const events = [
    { type: 'turn/start', data: { turn: 2 } },
    {
      type: 'user/message',
      time: 10,
      data: {
        source: {
          kind: 'conversation-quote',
          references: [{ id: 'r1', quote: 'hello', annotation: 'why', source: { turn: 2, nodeKey: 'n1' } }],
        },
      },
    },
  ]
  const ctx = {
    get: (name) => (name === 'sessions' ? { get: () => ({ seq: 5, snapshotEvents: () => events }) } : undefined),
  }

  const records = t.sentFor(ctx, 's7')
  assert.equal(records.length, 1)
  assert.equal(records[0].turn, 2)
  assert.equal(records[0].quotes[0].text, 'hello')
})

/* ------------------------------------------------------------------ */
/* HTTP surface                                                       */
/* ------------------------------------------------------------------ */

function createHost(rawConfig) {
  const routes = new Map()
  const ctx = {
    webServer: {
      register({ path, handler }) {
        routes.set(path, handler)
        return () => routes.delete(path)
      },
    },
    effect(fn) {
      return fn()
    },
    on() {
      return () => {}
    },
    get() {
      return undefined
    },
    logger: { warn() {} },
  }
  plugin.apply(ctx, rawConfig)
  return routes
}

function request(handler, { method = 'GET', url = '/', headers = {}, body } = {}) {
  const req = Readable.from(body === undefined ? [] : [Buffer.from(body, 'utf8')])
  req.method = method
  req.url = url
  req.headers = { host: '127.0.0.1:58054', 'sec-fetch-site': 'same-origin', ...headers }

  const chunks = []
  const res = {
    statusCode: 0,
    headers: {},
    writeHead(status, responseHeaders) {
      this.statusCode = status
      this.headers = responseHeaders || {}
      return this
    },
    end(chunk) {
      if (chunk !== undefined && chunk !== null) chunks.push(Buffer.from(chunk))
    },
  }

  return Promise.resolve(handler(req, res)).then(() => ({
    status: res.statusCode,
    headers: res.headers,
    json: () => JSON.parse(Buffer.concat(chunks).toString('utf8') || 'null'),
  }))
}

test('POST /add stores a quote and GET /pending returns it', async () => {
  const routes = createHost({})
  const added = await request(routes.get(ROUTES.add), {
    method: 'POST',
    url: ROUTES.add,
    headers: MUTATION_HEADERS,
    body: JSON.stringify({ sessionId: 'http-1', quote: { text: 'hello' } }),
  })
  assert.equal(added.status, 200)
  assert.equal(added.json().quotes.length, 1)

  const pending = await request(routes.get(ROUTES.pending), { url: `${ROUTES.pending}?sessionId=http-1` })
  assert.equal(pending.status, 200)
  assert.equal(pending.json().quotes[0].text, 'hello')
})

test('mutations require the custom header and a JSON content type', async () => {
  const routes = createHost({})
  const missingHeader = await request(routes.get(ROUTES.add), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sessionId: 'http-2', quote: { text: 'x' } }),
  })
  assert.equal(missingHeader.status, 403)

  const missingType = await request(routes.get(ROUTES.add), {
    method: 'POST',
    headers: { 'x-dsh-quote-annotation': '1' },
    body: JSON.stringify({ sessionId: 'http-2', quote: { text: 'x' } }),
  })
  assert.equal(missingType.status, 415)
})

test('cross-site and non-loopback requests are rejected', async () => {
  const routes = createHost({})
  const crossSite = await request(routes.get(ROUTES.pending), {
    url: `${ROUTES.pending}?sessionId=http-3`,
    headers: { 'sec-fetch-site': 'cross-site' },
  })
  assert.equal(crossSite.status, 403)

  const remote = await request(routes.get(ROUTES.pending), {
    url: `${ROUTES.pending}?sessionId=http-3`,
    headers: { host: 'example.com' },
  })
  assert.equal(remote.status, 403)
})

test('invalid JSON and missing session ids are rejected', async () => {
  const routes = createHost({})
  const badJson = await request(routes.get(ROUTES.add), {
    method: 'POST',
    headers: MUTATION_HEADERS,
    body: '{',
  })
  assert.equal(badJson.status, 400)

  const noSession = await request(routes.get(ROUTES.add), {
    method: 'POST',
    headers: MUTATION_HEADERS,
    body: JSON.stringify({ quote: { text: 'x' } }),
  })
  assert.equal(noSession.status, 400)
})

test('update, remove and clear round-trip through HTTP', async () => {
  const routes = createHost({})
  const added = await request(routes.get(ROUTES.add), {
    method: 'POST',
    headers: MUTATION_HEADERS,
    body: JSON.stringify({ sessionId: 'http-4', quote: { text: 'a' } }),
  })
  const id = added.json().quotes[0].id

  const updated = await request(routes.get(ROUTES.update), {
    method: 'POST',
    headers: MUTATION_HEADERS,
    body: JSON.stringify({ sessionId: 'http-4', id, annotation: 'note' }),
  })
  assert.equal(updated.json().quotes[0].annotation, 'note')

  const removed = await request(routes.get(ROUTES.remove), {
    method: 'POST',
    headers: MUTATION_HEADERS,
    body: JSON.stringify({ sessionId: 'http-4', id }),
  })
  assert.equal(removed.json().quotes.length, 0)

  const cleared = await request(routes.get(ROUTES.clear), {
    method: 'POST',
    headers: MUTATION_HEADERS,
    body: JSON.stringify({ sessionId: 'http-4' }),
  })
  assert.deepEqual(cleared.json().quotes, [])
})

test('GET /sent works without a session store', async () => {
  const routes = createHost({})
  const sent = await request(routes.get(ROUTES.sent), { url: `${ROUTES.sent}?sessionId=http-5` })
  assert.equal(sent.status, 200)
  assert.deepEqual(sent.json().sent, [])
})

/* ------------------------------------------------------------------ */
/* language                                                           */
/* ------------------------------------------------------------------ */

test('normalizeLanguage maps every tag to zh or en', () => {
  assert.equal(t.normalizeLanguage('zh-CN'), 'zh')
  assert.equal(t.normalizeLanguage('zh'), 'zh')
  assert.equal(t.normalizeLanguage('en-US'), 'en')
  assert.equal(t.normalizeLanguage('ja-JP'), 'en')
  assert.equal(t.normalizeLanguage(''), 'en')
  assert.equal(t.normalizeLanguage(undefined), 'en')
  assert.equal(t.normalizeLanguage(undefined, 'zh'), 'zh')
})

test('host copy follows the language sent with the mutation', () => {
  assert.equal(t.addPending('lang-1', { text: '   ' }, CONFIG, 'en').error, 'Quote text cannot be empty.')
  assert.equal(t.languageOf('lang-1'), 'en')
  assert.equal(t.addPending('lang-2', { text: '   ' }, CONFIG, 'zh').error, '引用文字不能为空。')

  const added = t.addPending('lang-1', { text: 'quoted', source: { nodeKey: 'n1' } }, CONFIG, 'en')
  assert.equal(added.quotes.length, 1)
  assert.equal(t.updatePending('lang-1', 'missing', '', CONFIG, 'en').error, 'That quote no longer exists.')

  const tokenOnly = { ...USER, content: [{ type: 'text', text: '\u2063' }] }
  const decision = t.attachToDecision({ kind: 'enter', messages: [tokenOnly] }, 'lang-1', CONFIG, 1, 1)
  assert.deepEqual(decision.messages[0].content, [{ type: 'text', text: 'Quote' }])
})

test('stripDraftToken falls back per language', () => {
  const message = { role: 'user', content: [{ type: 'text', text: '\u2063' }] }
  assert.deepEqual(t.stripDraftToken(message, 'en').content, [{ type: 'text', text: 'Quote' }])
  assert.deepEqual(t.stripDraftToken(message, 'zh').content, [{ type: 'text', text: '（引用）' }])
  assert.deepEqual(t.stripDraftToken(message, 'ja').content, [{ type: 'text', text: 'Quote' }])
})

test('POST /add answers in the language header', async () => {
  const routes = createHost({})

  const english = await request(routes.get(ROUTES.add), {
    method: 'POST',
    url: ROUTES.add,
    headers: { ...MUTATION_HEADERS, 'x-dsh-quote-annotation-lang': 'en' },
    body: JSON.stringify({ sessionId: 'http-lang', quote: { text: '  ' } }),
  })
  assert.equal(english.status, 400)
  assert.equal(english.json().error.message, 'Quote text cannot be empty.')

  const chinese = await request(routes.get(ROUTES.add), {
    method: 'POST',
    url: ROUTES.add,
    headers: { ...MUTATION_HEADERS, 'x-dsh-quote-annotation-lang': 'zh-CN' },
    body: JSON.stringify({ sessionId: 'http-lang', quote: { text: '  ' } }),
  })
  assert.equal(chinese.status, 400)
  assert.equal(chinese.json().error.message, '引用文字不能为空。')

  const other = await request(routes.get(ROUTES.add), {
    method: 'POST',
    url: ROUTES.add,
    headers: { ...MUTATION_HEADERS, 'x-dsh-quote-annotation-lang': 'ja' },
    body: JSON.stringify({ sessionId: 'http-lang', quote: { text: '  ' } }),
  })
  assert.equal(other.json().error.message, 'Quote text cannot be empty.')
})
