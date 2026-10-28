window.__ModuleLoader__.load({
  id: 'dsh-quote-annotation',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    const React = require('react')
    const h = React.createElement
    const Fragment = React.Fragment

    const API_BASE = '/dsh-quote-annotation'
    const MUTATION_HEADER = 'x-dsh-quote-annotation'
    const STYLE_ID = 'dsh-quote-annotation/client.css'
    const MAX_CLIENT_TEXT = 20000
    const POLL_MS = 1500
    const DRAFT_TOKEN = '\u2063'

    /* ------------------------------------------------------------------ */
    /* styles                                                             */
    /* ------------------------------------------------------------------ */

    const css = `
      .dsq-root { box-sizing: border-box; font: 12px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif; }
      .dsq-root button { font: inherit; }
      .dsq-root button:focus { outline: none; }
      .dsq-root button:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary, #4d6bfe); outline-offset: 2px; }
      .dsq-action {
        appearance: none; -webkit-appearance: none;
        position: fixed; z-index: 2147483000; display: inline-flex; align-items: center; gap: 5px;
        height: 28px; padding: 0 10px; border-radius: 14px; cursor: pointer;
        border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
        background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-1, #fff));
        color: var(--dsw-alias-label-primary, #17191c);
        box-shadow: 0 6px 18px rgba(15,23,42,.14), 0 1px 2px rgba(15,23,42,.08);
        transform: translateX(-50%); backdrop-filter: blur(8px);
        font: 500 12px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
      }
      .dsq-action:hover { border-color: var(--dsw-alias-brand-primary, #4d6bfe); }
      .dsq-action svg { color: var(--dsw-alias-brand-primary, #4d6bfe); }

      .dsq-comment {
        position: fixed; z-index: 2147483002; display: flex; align-items: flex-end; gap: 4px;
        width: 320px; max-width: calc(100vw - 24px); min-height: 40px; padding: 7px 5px 7px 13px;
        border-radius: 18px; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
        background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-1, #fff));
        box-shadow: 0 10px 28px rgba(15,23,42,.18), 0 1px 3px rgba(15,23,42,.08);
        backdrop-filter: blur(10px);
      }
      .dsq-comment-input {
        min-width: 0; flex: 1; min-height: 24px; max-height: 96px; padding: 1px 0 0; border: 0; outline: 0;
        resize: none; overflow-y: auto; background: transparent; color: var(--dsw-alias-label-primary, #17191c);
        font: 13px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
        white-space: pre-wrap; word-break: break-word;
      }
      .dsq-comment-input::placeholder { color: var(--dsw-alias-label-tertiary, #8b9199); }
      .dsq-comment-send {
        appearance: none; -webkit-appearance: none; flex: none; width: 30px; height: 30px; padding: 0; border: 0; border-radius: 50%;
        display: grid; place-items: center; cursor: pointer; align-self: flex-end;
        background: var(--dsw-alias-brand-primary, #4d6bfe); color: #fff;
      }
      .dsq-comment-send:disabled { opacity: .5; cursor: default; }
      .dsq-comment-error {
        position: absolute; left: 12px; right: 12px; top: calc(100% + 4px);
        padding: 6px 9px; border-radius: 8px; color: var(--dsw-alias-state-error-primary, #d33);
        background: var(--dsw-alias-bg-overlay, #fff); border: 1px solid var(--dsw-alias-state-error-primary, #d33);
        font-size: 11px; box-shadow: 0 4px 14px rgba(0,0,0,.12);
      }

      .dsq-pill {
        display: inline-flex; align-items: center; height: 28px; padding: 0 2px 0 8px;
        border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
        border-radius: 14px; background: var(--dsw-alias-bg-layer-1, rgba(128,128,128,.06));
        color: var(--dsw-alias-label-primary, #17191c); white-space: nowrap;
      }
      .dsq-pill-main {
        appearance: none; -webkit-appearance: none; display: inline-flex; align-items: center; gap: 5px; height: 100%; padding: 0;
        border: 0; background: transparent; color: inherit; cursor: pointer;
        font: 500 11.5px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
      }
      .dsq-pill-main svg { color: var(--dsw-alias-label-secondary, #555); }
      .dsq-pill:hover { border-color: var(--dsw-alias-border-l1, rgba(128,128,128,.4)); }
      .dsq-pill-clear {
        appearance: none; -webkit-appearance: none; width: 17px; height: 17px; margin-left: 4px; padding: 0; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.3));
        border-radius: 50%; display: grid; place-items: center; cursor: pointer;
        background: transparent; color: var(--dsw-alias-label-tertiary, #8b9199);
      }
      .dsq-pill-clear:hover { color: var(--dsw-alias-state-error-primary, #d33); border-color: currentColor; }

      .dsq-card {
        position: fixed; z-index: 2147483001; max-height: min(320px, calc(100vh - 96px));
        overflow: auto; padding: 4px; border-radius: 14px;
        border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
        background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-1, #fff));
        box-shadow: 0 14px 38px rgba(15,23,42,.2), 0 1px 3px rgba(15,23,42,.08);
      }
      .dsq-card-row {
        display: grid; grid-template-columns: 16px minmax(0, 1fr) auto; gap: 7px;
        padding: 8px 7px 9px; border-radius: 9px;
      }
      .dsq-card-row + .dsq-card-row { border-top: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.14)); }
      .dsq-card-row:hover { background: var(--dsw-alias-bg-layer-1, rgba(128,128,128,.06)); }
      .dsq-card-num { color: var(--dsw-alias-label-tertiary, #8b9199); font-size: 11px; line-height: 1.6; }
      .dsq-card-main { min-width: 0; }
      .dsq-card-label { color: var(--dsw-alias-label-tertiary, #8b9199); font-size: 10.5px; margin-bottom: 1px; }
      .dsq-card-text {
        appearance: none; -webkit-appearance: none; display: block; width: 100%; max-height: 76px; overflow: auto; padding: 0;
        border: 0; background: transparent; text-align: left; cursor: pointer;
        color: var(--dsw-alias-label-primary, #17191c); font: 12.5px/1.5 inherit;
        white-space: pre-wrap; word-break: break-word;
      }
      .dsq-card-text:hover { color: var(--dsw-alias-brand-primary, #4d6bfe); }
      .dsq-card-note {
        margin-top: 3px; color: var(--dsw-alias-label-secondary, #555); font-size: 11.5px; line-height: 1.45;
        white-space: pre-wrap; word-break: break-word; max-height: 36px; overflow: hidden;
      }
      .dsq-card-note::before { content: "批注："; color: var(--dsw-alias-label-tertiary, #8b9199); }
      .dsq-card-actions { display: flex; gap: 1px; align-self: start; }
      .dsq-icon-btn {
        appearance: none; -webkit-appearance: none; width: 23px; height: 23px; padding: 0; border: 0; border-radius: 6px;
        display: grid; place-items: center; cursor: pointer; background: transparent;
        color: var(--dsw-alias-label-tertiary, #8b9199);
      }
      .dsq-icon-btn:hover { background: var(--dsw-alias-bg-layer-2, rgba(128,128,128,.14)); color: var(--dsw-alias-label-primary, #17191c); }
      .dsq-icon-btn.dsq-danger:hover { color: var(--dsw-alias-state-error-primary, #d33); }
      .dsq-highlight {
        position: fixed; z-index: 2147482998; pointer-events: none;
        background: rgba(22,131,243,.2); border-radius: 3px;
      }
      .dsq-highlight-row {
        background: rgba(22,131,243,.06);
        outline: 1.5px solid rgba(22,131,243,.35); outline-offset: 2px; border-radius: 8px;
      }
      .dsq-marker {
        appearance: none; -webkit-appearance: none; position: fixed; z-index: 2147482999; width: 19px; height: 19px; padding: 0;
        border: 2px solid var(--dsw-alias-bg-layer-1, #fff); border-radius: 50%;
        display: grid; place-items: center; cursor: pointer;
        background: var(--dsw-alias-brand-primary, #4d6bfe); color: #fff;
        box-shadow: 0 2px 7px rgba(15,23,42,.24);
        font: 700 10px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .dsq-marker:hover { transform: scale(1.08); }
      .dsq-flash {
        outline: 2px solid var(--dsw-alias-brand-primary, #4d6bfe) !important;
        outline-offset: 4px; border-radius: 8px;
        background: color-mix(in srgb, var(--dsw-alias-brand-primary, #4d6bfe) 8%, transparent);
        transition: background .2s ease, outline-color .2s ease;
      }
      .dsq-inline-note {
        appearance: none; -webkit-appearance: none;
        display: inline; margin-left: 4px; padding: 0 3px; border: 0; border-radius: 4px;
        background: transparent; color: var(--dsw-alias-brand-primary, #4d6bfe);
        cursor: pointer; font: 500 12px/1.4 inherit; vertical-align: baseline;
        user-select: none; -webkit-user-select: none;
      }
      .dsq-inline-note:hover, .dsq-inline-note:focus-visible {
        background: var(--dsw-alias-bg-layer-2, rgba(128,128,128,.14)); text-decoration: underline; outline: none;
      }
      .dsq-inline-card {
        position: fixed; z-index: 2147483005; width: min(380px, calc(100vw - 24px));
        max-height: min(360px, calc(100vh - 24px)); overflow: auto; box-sizing: border-box;
        padding: 12px 14px; border-radius: 14px;
        border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
        background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-1, #fff));
        box-shadow: 0 14px 38px rgba(15,23,42,.2), 0 1px 3px rgba(15,23,42,.08);
        font: 12px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
      }
      .dsq-inline-label { color: var(--dsw-alias-label-tertiary, #8b9199); font-size: 11px; margin-top: 8px; }
      .dsq-inline-label:first-child { margin-top: 0; }
      .dsq-inline-text {
        color: var(--dsw-alias-label-primary, #17191c); font-size: 12.5px;
        white-space: pre-wrap; word-break: break-word; max-height: 120px; overflow: auto;
      }
      .dsq-turn-tail { display: flex; justify-content: flex-end; padding-top: 4px; }
      .dsq-turn-pill { height: 26px; font-size: 11px; }
      .dsq-sent-above {
        display: flex; justify-content: flex-end; width: 100%; padding: 0 0 6px;
      }
      .dsq-sent-above .dsq-sent-pill { margin-top: 0; }
      .dsq-sent-pill {
        appearance: none; -webkit-appearance: none;
        display: inline-flex; align-items: center; gap: 5px; align-self: flex-start;
        height: 26px; margin-top: 6px; padding: 0 9px; border-radius: 13px;
        border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
        background: var(--dsw-alias-bg-layer-1, rgba(128,128,128,.06));
        color: var(--dsw-alias-label-secondary, #555); cursor: pointer;
        font: 500 11.5px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
      }
      .dsq-sent-pill:hover { border-color: var(--dsw-alias-brand-primary, #4d6bfe); color: var(--dsw-alias-label-primary, #17191c); }
      .dsq-sent-glyph { color: var(--dsw-alias-brand-primary, #4d6bfe); font-size: 14px; line-height: 1; }
      .dsq-sent-card {
        position: fixed; z-index: 2147483003; max-height: min(320px, calc(100vh - 24px));
        overflow: auto; padding: 4px; box-sizing: border-box; border-radius: 14px;
        border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
        background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-1, #fff));
        box-shadow: 0 14px 38px rgba(15,23,42,.2), 0 1px 3px rgba(15,23,42,.08);
        font: 12px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
      }
      .dsq-sent-row { display: flex; gap: 8px; padding: 8px; border-radius: 9px; }
      .dsq-sent-row + .dsq-sent-row { border-top: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.14)); }
      .dsq-sent-main { min-width: 0; flex: 1; }
      .dsq-sent-label { color: var(--dsw-alias-label-tertiary, #8b9199); font-size: 10.5px; margin-bottom: 1px; }
      .dsq-sent-quote {
        color: var(--dsw-alias-label-primary, #17191c); font-size: 12px; line-height: 1.5;
        white-space: pre-wrap; word-break: break-word; max-height: 72px; overflow: auto;
      }
      .dsq-sent-note { margin-top: 3px; color: var(--dsw-alias-label-secondary, #555); font-size: 11px; white-space: pre-wrap; word-break: break-word; }
      .dsq-sent-note::before { content: "批注："; color: var(--dsw-alias-label-tertiary, #8b9199); }
      .dsq-sent-jump {
        appearance: none; -webkit-appearance: none; flex: none; align-self: flex-start;
        height: 23px; padding: 0 7px; border-radius: 6px; cursor: pointer;
        border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
        background: transparent; color: var(--dsw-alias-label-secondary, #555); font-size: 10.5px;
      }
      .dsq-sent-jump:hover { color: var(--dsw-alias-brand-primary, #4d6bfe); border-color: currentColor; }
      .dsq-toast {
        position: fixed; left: 50%; bottom: 92px; z-index: 2147483003; transform: translateX(-50%);
        padding: 6px 11px; border-radius: 9px; pointer-events: none;
        background: var(--dsw-alias-bg-overlay, rgba(23,25,28,.92)); color: var(--dsw-alias-label-primary, #fff);
        border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.3));
        font-size: 11.5px; box-shadow: 0 6px 20px rgba(15,23,42,.24); white-space: nowrap;
      }
    `

    function ensureStyles() {
      if (typeof document === 'undefined') return
      if (document.querySelector('style[data-plugin-css="' + STYLE_ID + '"]')) return
      const tag = document.createElement('style')
      tag.dataset.plugin = 'dsh-quote-annotation'
      tag.dataset.pluginCss = STYLE_ID
      tag.textContent = css
      document.head.appendChild(tag)
    }

    function removeStyles() {
      if (typeof document === 'undefined') return
      const tag = document.querySelector('style[data-plugin-css="' + STYLE_ID + '"]')
      if (tag && tag.parentNode) tag.parentNode.removeChild(tag)
    }

    /* ------------------------------------------------------------------ */
    /* api                                                                */
    /* ------------------------------------------------------------------ */

    async function request(path, options) {
      const init = options || {}
      const headers = Object.assign({ [MUTATION_HEADER]: '1' }, init.headers || {})
      if (init.body !== undefined) headers['content-type'] = 'application/json'
      const response = await fetch(API_BASE + path, {
        method: init.method || 'GET',
        credentials: 'same-origin',
        headers,
        body: init.body,
      })
      let payload = null
      try {
        payload = await response.json()
      } catch {
        payload = null
      }
      if (!response.ok || !payload || payload.ok !== true) {
        const message =
          payload && payload.error && typeof payload.error.message === 'string'
            ? payload.error.message
            : '引用服务请求失败（HTTP ' + response.status + '）'
        const error = new Error(message)
        error.status = response.status
        throw error
      }
      return payload
    }

    function loadPending(sessionId) {
      return request('/pending?sessionId=' + encodeURIComponent(sessionId))
    }

    function addQuote(sessionId, quote) {
      return request('/add', { method: 'POST', body: JSON.stringify({ sessionId, quote }) })
    }

    function updateQuote(sessionId, id, annotation) {
      return request('/update', { method: 'POST', body: JSON.stringify({ sessionId, id, annotation }) })
    }

    function removeQuote(sessionId, id) {
      return request('/remove', { method: 'POST', body: JSON.stringify({ sessionId, id }) })
    }

    function clearQuotes(sessionId) {
      return request('/clear', { method: 'POST', body: JSON.stringify({ sessionId }) })
    }

    function isMissingUpdate(error) {
      if (!error) return false
      if (error.status === 405) return true
      return typeof error.message === 'string' && error.message.indexOf('HTTP 405') !== -1
    }

    async function replaceQuote(sessionId, quote, annotation) {
      const removed = await removeQuote(sessionId, quote.id)
      const before = new Set((removed.quotes || []).map((item) => item.id))
      const added = await addQuote(sessionId, {
        text: quote.text,
        annotation,
        source: quote.source,
      })
      const fresh = (added.quotes || []).find((item) => !before.has(item.id))
      return {
        quotes: added.quotes || [],
        oldId: quote.id,
        newId: fresh === undefined ? undefined : fresh.id,
      }
    }

    const sentRecords = new Map()
    const sentListeners = new Map()

    function publishSent(sessionId, records) {
      sentRecords.set(sessionId, Array.isArray(records) ? records : [])
      renderSentPills(sessionId)
      renderInlineNotes(sessionId)
      const listeners = sentListeners.get(sessionId)
      if (!listeners) return
      for (const listener of [...listeners]) {
        try {
          listener()
        } catch {
          /* ignore */
        }
      }
    }

    function subscribeSent(sessionId, listener) {
      let listeners = sentListeners.get(sessionId)
      if (!listeners) {
        listeners = new Set()
        sentListeners.set(sessionId, listeners)
      }
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }

    function mergeSentLists(hostRecords, localRecords) {
      const byTurn = new Map()
      for (const record of localRecords) byTurn.set(record.turn, record)
      for (const record of hostRecords) byTurn.set(record.turn, record)
      return [...byTurn.values()].sort((left, right) => left.turn - right.turn)
    }

    function mergeSentRecord(sessionId, record) {
      const current = sentRecords.get(sessionId) || []
      publishSent(sessionId, mergeSentLists([record], current))
    }

    function publishClientSent(sessionId, turn, quotes) {
      if (!sessionId || typeof turn !== 'number' || !Array.isArray(quotes) || quotes.length === 0) return
      mergeSentRecord(sessionId, {
        turn,
        quotes: quotes.map((quote) => ({
          text: quote.text,
          annotation: quote.annotation || '',
          source: quote.source,
        })),
        createdAt: Date.now(),
      })
    }

    async function loadSent(sessionId) {
      if (!sessionId) return
      const current = sentRecords.get(sessionId) || []
      try {
        const payload = await request('/sent?sessionId=' + encodeURIComponent(sessionId))
        publishSent(sessionId, mergeSentLists(payload.sent || [], current))
      } catch {
        if (!sentRecords.has(sessionId)) publishSent(sessionId, [])
      }
    }

    function latestUserTurn() {
      const flows = document.querySelectorAll('[data-chat-flow-kind="user"]')
      for (let index = flows.length - 1; index >= 0; index -= 1) {
        const raw = flows[index].getAttribute('data-chat-turn')
        const turn = raw === null ? NaN : Number(raw)
        if (Number.isSafeInteger(turn) && turn >= 0) return turn
      }
      return null
    }

    let activeSessionId = null
    const sessionRoots = new Map()

    function conversationRootFor(anchor) {
      let node = anchor
      while (node !== null && node !== undefined && node !== document.body) {
        if (typeof node.querySelector === 'function' && node.querySelector('[data-conversation-scroll]') !== null)
          return node
        node = node.parentElement
      }
      return document
    }

    function userFlowsForTurn(turn, root) {
      const scope = root || document
      const flows = scope.querySelectorAll('[data-chat-flow-kind="user"]')
      for (const flow of flows) {
        const raw = flow.getAttribute('data-chat-turn')
        if (raw !== null && Number(raw) === turn) return flow
      }
      return null
    }

    function placeSentPill(flow, items) {
      if (flow === null || !Array.isArray(items) || items.length === 0) return null
      let wrapper = flow.querySelector('[data-dsq-sent-above]')
      if (wrapper === null) {
        wrapper = document.createElement('div')
        wrapper.className = 'dsq-sent-above'
        wrapper.setAttribute('data-dsq-sent-above', '')
        const pill = document.createElement('button')
        pill.type = 'button'
        pill.className = 'dsq-sent-pill'
        pill.innerHTML =
          '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.2 3.2h9.6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H7l-2.4 2v-2h-1.4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z"></path><path d="M5.4 6.3h5.2M5.4 8.4h3.2"></path></svg><span class="dsq-sent-label"></span>'
        pill.addEventListener('click', (event) => {
          event.stopPropagation()
          openSentCard(pill, sentItems.get(pill) || [])
        })
        wrapper.append(pill)
        flow.prepend(wrapper)
      }
      const pill = wrapper.querySelector('.dsq-sent-pill')
      if (pill === null) return null
      sentItems.set(pill, items)
      const label = pill.querySelector('.dsq-sent-label')
      const text = items.length + ' 条注释'
      if (label !== null && label.textContent !== text) label.textContent = text
      return pill
    }

    function renderSentPills(sessionId) {
      if (!sessionId) return
      const root = sessionRoots.get(sessionId)
      if (!root) return
      const records = sentRecords.get(sessionId) || []
      for (const record of records) {
        const flow = userFlowsForTurn(record.turn, root)
        if (flow === null) continue
        const items = (record.quotes || []).map((quote) => ({
          quote: quote.text,
          annotation: quote.annotation || '',
          source: quote.source,
        }))
        placeSentPill(flow, items)
      }
    }

    function sentAnnotations(sessionId) {
      const records = (sentRecords.get(sessionId) || []).slice().sort((left, right) => left.turn - right.turn)
      const list = []
      for (const record of records) {
        const quotes = Array.isArray(record.quotes) ? record.quotes : []
        for (let index = 0; index < quotes.length; index += 1) {
          const quote = quotes[index]
          const text = typeof quote.text === 'string' ? quote.text.trim() : ''
          if (!text) continue
          list.push({
            key: record.turn + ':' + index,
            number: list.length + 1,
            turn: record.turn,
            quote: text,
            annotation: typeof quote.annotation === 'string' ? quote.annotation : '',
            source: quote.source && typeof quote.source === 'object' ? quote.source : null,
          })
        }
      }
      return list
    }

    function quoteVariants(quote) {
      const strip = (value) =>
        value
          .replace(/[`*_~]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      const full = strip(quote)
      if (!full) return []
      const variants = [full]
      if (full.length > 16) variants.push(full.slice(0, 16))
      if (full.length > 8) variants.push(full.slice(0, 8))
      return [...new Set(variants)].filter((value) => value.length >= 4)
    }

    function findAssistantFlow(root, turn, quote) {
      const flows = [...root.querySelectorAll('[data-chat-flow-kind="assistant-step"]')]
        .filter((flow) => Number(flow.getAttribute('data-chat-turn')) === turn)
        .filter((flow) => !flow.hasAttribute('data-streaming'))
        .filter((flow) => flow.querySelector('[data-streaming]') === null)
        .filter((flow) => (flow.textContent || '').trim() !== '')
      if (flows.length === 0) return null
      const variants = quoteVariants(quote)
      for (let index = flows.length - 1; index >= 0; index -= 1) {
        const text = (flows[index].textContent || '').replace(/\s+/g, ' ')
        if (variants.some((variant) => text.includes(variant))) return flows[index]
      }
      return flows[flows.length - 1]
    }

    function inlineTextNodes(flow) {
      const walker = document.createTreeWalker(flow, NodeFilter.SHOW_TEXT, null)
      const nodes = []
      while (walker.nextNode()) {
        const node = walker.currentNode
        const parent = node.parentElement
        if (parent === null) continue
        if (parent.closest('.dsq-inline-note, pre, code, a, .dsq-inline-card')) continue
        if ((node.nodeValue || '').trim() === '') continue
        nodes.push(node)
      }
      return nodes
    }

    function noteBlockFor(node, flow) {
      const block =
        node && node.parentElement ? node.parentElement.closest('p, li, h1, h2, h3, h4, h5, h6, blockquote, td') : null
      if (block !== null) return block
      const blocks = [...flow.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote, td')].filter(
        (candidate) => (candidate.textContent || '').trim() !== '',
      )
      return blocks.length > 0 ? blocks[blocks.length - 1] : flow
    }

    let inlineCard = null
    let inlineCardTimer = null
    let inlineOutside = null

    function closeInlineCard() {
      if (inlineCardTimer !== null) {
        window.clearTimeout(inlineCardTimer)
        inlineCardTimer = null
      }
      if (inlineCard !== null) {
        inlineCard.remove()
        inlineCard = null
      }
      if (inlineOutside !== null) {
        document.removeEventListener('mousedown', inlineOutside, true)
        inlineOutside = null
      }
    }

    function scheduleCloseInlineCard() {
      if (inlineCardTimer !== null) window.clearTimeout(inlineCardTimer)
      inlineCardTimer = window.setTimeout(() => {
        inlineCardTimer = null
        closeInlineCard()
      }, 140)
    }

    function cancelCloseInlineCard() {
      if (inlineCardTimer !== null) {
        window.clearTimeout(inlineCardTimer)
        inlineCardTimer = null
      }
    }

    function openInlineCard(marker, data) {
      closeInlineCard()
      const card = document.createElement('div')
      card.className = 'dsq-inline-card'
      const add = (label, text) => {
        if (!text) return
        const head = document.createElement('div')
        head.className = 'dsq-inline-label'
        head.textContent = label
        const body = document.createElement('div')
        body.className = 'dsq-inline-text'
        body.textContent = text
        card.append(head, body)
      }
      add('所选文本:', data.quote)
      add('用户评论:', data.annotation)
      card.addEventListener('mouseenter', cancelCloseInlineCard)
      card.addEventListener('mouseleave', scheduleCloseInlineCard)
      document.body.append(card)
      const width = Math.min(380, window.innerWidth - 24)
      card.style.width = width + 'px'
      const rect = marker.getBoundingClientRect()
      const height = card.getBoundingClientRect().height
      let left = rect.right + 8
      let top = rect.top - 8
      if (left + width > window.innerWidth - 12) {
        left = rect.left - width - 8
        if (left < 12) {
          left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12))
          top = rect.bottom + 8
        }
      }
      if (top + height > window.innerHeight - 12) top = Math.max(12, window.innerHeight - height - 12)
      card.style.left = Math.max(12, left) + 'px'
      card.style.top = Math.max(12, top) + 'px'
      inlineCard = card
      inlineOutside = (event) => {
        if (card.contains(event.target) || event.target === marker) return
        closeInlineCard()
      }
      document.addEventListener('mousedown', inlineOutside, true)
    }

    function showInlineToast(text) {
      for (const old of document.querySelectorAll('[data-dsq-inline-toast]')) old.remove()
      const toast = document.createElement('div')
      toast.className = 'dsq-toast'
      toast.dataset.dsqInlineToast = ''
      toast.textContent = text
      document.body.append(toast)
      window.setTimeout(() => toast.remove(), 1800)
    }

    function jumpToAnnotation(source) {
      const row = findAnchorRow(source)
      if (row === null) {
        showInlineToast('原文不在当前视图里')
        return
      }
      const rect = row.getBoundingClientRect()
      const scroller = row.closest('[data-conversation-scroll]')
      if (scroller !== null) {
        const before = scroller.scrollTop
        const scrollerRect = scroller.getBoundingClientRect()
        const target = before + (rect.top - scrollerRect.top) - Math.max(80, scrollerRect.height * 0.25)
        scroller.scrollTo({ top: Math.max(0, target), behavior: 'smooth' })
        window.requestAnimationFrame(() => {
          if (Math.abs(scroller.scrollTop - before) < 1) {
            row.scrollIntoView({ block: 'center', behavior: 'smooth' })
          }
        })
      } else {
        row.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
      flashRow(row)
      showInlineToast('已定位到原文')
    }

    function insertInlineNote(flow, annotation) {
      const existing = flow.querySelector('[data-dsq-inline-key="' + annotation.key + '"]')
      const nodes = inlineTextNodes(flow)
      const variants = quoteVariants(annotation.quote)
      let target = null
      for (const node of nodes) {
        const text = node.nodeValue || ''
        if (variants.some((variant) => text.includes(variant))) {
          target = node
          break
        }
      }
      const block = noteBlockFor(target, flow)
      if (existing !== null) {
        const label = '注释 ' + annotation.number
        if (existing.textContent !== label) existing.textContent = label
        return
      }
      const marker = document.createElement('button')
      marker.type = 'button'
      marker.className = 'dsq-inline-note'
      marker.dataset.dsqInlineKey = annotation.key
      marker.textContent = '注释 ' + annotation.number
      marker.setAttribute('aria-label', '注释 ' + annotation.number + '：' + annotation.quote)
      const data = {
        quote: annotation.quote,
        annotation: annotation.annotation,
        source: annotation.source,
      }
      marker.addEventListener('mousedown', (event) => {
        event.preventDefault()
        event.stopPropagation()
      })
      marker.addEventListener('mouseenter', () => openInlineCard(marker, data))
      marker.addEventListener('focus', () => openInlineCard(marker, data))
      marker.addEventListener('mouseleave', scheduleCloseInlineCard)
      marker.addEventListener('blur', scheduleCloseInlineCard)
      marker.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        jumpToAnnotation(annotation.source)
        closeInlineCard()
      })
      block.append(document.createTextNode(' '), marker)
    }

    function renderInlineNotes(sessionId) {
      if (!sessionId) return
      const root = sessionRoots.get(sessionId)
      if (!root) return
      const annotations = sentAnnotations(sessionId)
      const expected = new Set(annotations.map((annotation) => annotation.key))
      for (const marker of root.querySelectorAll('[data-dsq-inline-key]')) {
        if (!expected.has(marker.getAttribute('data-dsq-inline-key'))) marker.remove()
      }
      for (const annotation of annotations) {
        const tail =
          root.querySelector('[data-chat-flow-kind="turn-tail"][data-chat-turn="' + annotation.turn + '"]') ||
          root.querySelector('[data-turn-tail="' + annotation.turn + '"]')
        if (tail === null) continue
        const flow = findAssistantFlow(root, annotation.turn, annotation.quote)
        if (flow === null) continue
        insertInlineNote(flow, annotation)
      }
    }

    /* ------------------------------------------------------------------ */
    /* dom helpers                                                        */
    /* ------------------------------------------------------------------ */

    function elementOf(node) {
      if (!node) return null
      if (node.nodeType === 1) return node
      return node.parentElement || null
    }

    function isChrome(element) {
      if (!element || typeof element.closest !== 'function') return false
      return (
        element.closest('input, textarea, select, [contenteditable="true"], [data-composer-card], .dsq-root') !== null
      )
    }

    function isOwnNode(node) {
      const element = elementOf(node)
      return !!(element && typeof element.closest === 'function' && element.closest('.dsq-root'))
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value))
    }

    function selectionRect(range) {
      let rect = range.getBoundingClientRect()
      if ((!rect || (rect.width === 0 && rect.height === 0)) && range.getClientRects().length > 0) {
        const rects = range.getClientRects()
        rect = rects[rects.length - 1]
      }
      if (!rect || (rect.width === 0 && rect.height === 0)) return null
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      }
    }

    function rangeClientRects(range) {
      if (!range) return []
      try {
        return Array.from(range.getClientRects())
          .filter((rect) => rect.width > 1 && rect.height > 1)
          .slice(0, 40)
          .map((rect) => ({ left: rect.left, top: rect.top, width: rect.width, height: rect.height }))
      } catch {
        return []
      }
    }

    function collectSource(range, scroll) {
      const keys = []
      const elements = []
      if (scroll && typeof scroll.querySelectorAll === 'function') {
        for (const element of scroll.querySelectorAll('[data-chat-node-key]')) {
          let intersects = false
          try {
            intersects = range.intersectsNode(element)
          } catch {
            intersects = false
          }
          if (intersects) elements.push(element)
        }
      }
      const startElement = elementOf(range.startContainer)
      const primary =
        startElement && typeof startElement.closest === 'function' ? startElement.closest('[data-chat-node-key]') : null
      if (primary && !elements.includes(primary)) elements.unshift(primary)
      for (const element of elements) {
        const key = element.getAttribute('data-chat-node-key')
        if (key && !keys.includes(key)) keys.push(key)
      }
      const anchor = primary || elements[0] || null
      const turnText = anchor ? anchor.getAttribute('data-chat-turn') : null
      const turn = turnText !== null && Number.isSafeInteger(Number(turnText)) ? Number(turnText) : undefined
      const kind = anchor ? anchor.getAttribute('data-chat-flow-kind') || '' : ''
      const nodeKey = anchor ? anchor.getAttribute('data-chat-node-key') || '' : ''
      const anchorRow =
        startElement && typeof startElement.closest === 'function'
          ? startElement.closest('[data-chat-anchor-key]')
          : null
      const anchorKey = anchorRow ? anchorRow.getAttribute('data-chat-anchor-key') || '' : ''
      return {
        ...(nodeKey ? { nodeKey } : {}),
        ...(anchorKey ? { anchorKey } : {}),
        ...(turn !== undefined ? { turn } : {}),
        ...(kind ? { kind } : {}),
        ...(keys.length > 0 ? { nodeKeys: keys.slice(0, 20) } : {}),
      }
    }

    function readSelection() {
      if (typeof window === 'undefined') return null
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null
      const text = selection.toString().replace(/\r\n?/g, '\n').trim()
      if (!text) return null
      const range = selection.getRangeAt(0)
      const startElement = elementOf(range.startContainer)
      const endElement = elementOf(range.endContainer)
      if (!startElement || !endElement) return null
      if (isChrome(startElement) || isChrome(endElement)) return null
      const scroll =
        typeof startElement.closest === 'function' ? startElement.closest('[data-conversation-scroll]') : null
      if (!scroll || !scroll.contains(endElement)) return null
      const rect = selectionRect(range)
      if (!rect) return null
      return {
        text: text.slice(0, MAX_CLIENT_TEXT),
        rect,
        range: range.cloneRange(),
        source: collectSource(range, scroll),
      }
    }

    function sourceLabel(source) {
      const kind = source && typeof source.kind === 'string' ? source.kind : ''
      const labels = {
        user: '用户消息',
        'assistant-step': '助手回复',
        assistant: '助手回复',
        steering: '中途引导',
        'tool-call': '工具调用',
        command: '命令',
        'turn-error': '失败轮次',
        'question-reply': '问答回复',
        'manual-compaction': '手动压缩',
        compaction: '压缩摘要',
      }
      const base = labels[kind] || '对话内容'
      const turn = source && Number.isSafeInteger(source.turn) ? source.turn : null
      return turn === null ? base : base + ' · 第 ' + turn + ' 轮'
    }

    function findAnchorRow(source) {
      if (!source || typeof source !== 'object') return null
      const keys = [source.anchorKey, source.nodeKey].filter((key) => typeof key === 'string' && key)
      if (keys.length === 0) return null
      const rows = document.querySelectorAll('[data-chat-anchor-key], [data-chat-node-key], [data-chat-flow-key]')
      const attributes = ['data-chat-anchor-key', 'data-chat-node-key', 'data-chat-flow-key']
      for (const wanted of keys) {
        for (const row of rows) {
          for (const attribute of attributes) {
            if (row.getAttribute(attribute) === wanted) return row
          }
        }
      }
      return null
    }

    function flashRow(row) {
      if (!row) return
      row.classList.remove('dsq-flash')
      void row.offsetWidth
      row.classList.add('dsq-flash')
      window.setTimeout(() => row.classList.remove('dsq-flash'), 1800)
    }

    /* ------------------------------------------------------------------ */
    /* sent quote folding (works with older Host revisions)               */
    /* ------------------------------------------------------------------ */

    const SENT_START = '## Quoted conversation references'
    const SENT_OPEN = '<quoted-conversation>'
    const SENT_CLOSE = '</quoted-conversation>'
    const sentItems = new WeakMap()
    let sentCard = null
    let sentOutside = null

    function sentTextNodes(root) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
      const nodes = []
      while (walker.nextNode()) nodes.push(walker.currentNode)
      return nodes
    }

    function sentRemoveRange(nodes, start, end) {
      let offset = 0
      for (const node of nodes) {
        const value = node.nodeValue || ''
        const nodeStart = offset
        const nodeEnd = offset + value.length
        offset = nodeEnd
        if (nodeEnd <= start || nodeStart >= end) continue
        const localStart = Math.max(0, start - nodeStart)
        const localEnd = Math.min(value.length, end - nodeStart)
        node.nodeValue = value.slice(0, localStart) + value.slice(localEnd)
      }
      let trimming = true
      for (const node of nodes) {
        if (!trimming) break
        const value = node.nodeValue || ''
        const trimmed = value.replace(/^\s+/, '')
        if (trimmed.length !== value.length) node.nodeValue = trimmed
        if (trimmed.length > 0) trimming = false
      }
    }

    function sentNormalize(payload) {
      const list = Array.isArray(payload) ? payload : []
      const items = []
      for (const entry of list) {
        if (!entry || typeof entry !== 'object') continue
        const quote = typeof entry.quote === 'string' ? entry.quote : ''
        const annotation = typeof entry.annotation === 'string' ? entry.annotation : ''
        const source =
          entry.source && typeof entry.source === 'object'
            ? entry.source
            : entry.reference && typeof entry.reference.source === 'object'
              ? entry.reference.source
              : null
        if (!quote && !annotation) continue
        items.push({ quote, annotation, source })
      }
      return items
    }

    function closeSentCard() {
      if (sentCard !== null) {
        sentCard.remove()
        sentCard = null
      }
      if (sentOutside !== null) {
        document.removeEventListener('mousedown', sentOutside, true)
        sentOutside = null
      }
    }

    function openSentCard(pill, items) {
      closeSentCard()
      const width = Math.min(360, window.innerWidth - 24)
      const card = document.createElement('div')
      card.className = 'dsq-sent-card'
      card.style.width = width + 'px'
      card.style.left = '0px'
      card.style.top = '0px'
      for (const item of items) {
        const row = document.createElement('div')
        row.className = 'dsq-sent-row'
        const main = document.createElement('div')
        main.className = 'dsq-sent-main'
        const label = document.createElement('div')
        label.className = 'dsq-sent-label'
        label.textContent = '所选文本'
        const quote = document.createElement('div')
        quote.className = 'dsq-sent-quote'
        quote.textContent = item.quote || ''
        main.append(label, quote)
        if (item.annotation) {
          const note = document.createElement('div')
          note.className = 'dsq-sent-note'
          note.textContent = item.annotation
          main.append(note)
        }
        const jump = document.createElement('button')
        jump.type = 'button'
        jump.className = 'dsq-sent-jump'
        jump.textContent = '跳回原文'
        jump.addEventListener('click', (event) => {
          event.stopPropagation()
          const row = findAnchorRow(item.source)
          if (row !== null) {
            row.scrollIntoView({ block: 'center', behavior: 'smooth' })
            flashRow(row)
          }
          closeSentCard()
        })
        row.append(main, jump)
        card.append(row)
      }
      document.body.append(card)
      const rect = pill.getBoundingClientRect()
      const height = card.getBoundingClientRect().height
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12))
      let top = rect.top - height - 8
      if (top < 12) top = Math.min(window.innerHeight - height - 12, rect.bottom + 8)
      card.style.left = left + 'px'
      card.style.top = Math.max(12, top) + 'px'
      sentCard = card
      sentOutside = (event) => {
        if (card.contains(event.target) || event.target === pill) return
        closeSentCard()
      }
      document.addEventListener('mousedown', sentOutside, true)
    }

    function foldSentQuotes(root) {
      if (!root || typeof root.querySelectorAll !== 'function') return
      const flows = root.querySelectorAll('[data-chat-flow-kind="user"]')
      for (const flow of flows) {
        const nodes = sentTextNodes(flow)
        if (nodes.length === 0) continue
        const text = nodes.map((node) => node.nodeValue || '').join('')
        const start = text.indexOf(SENT_START)
        if (start < 0) continue
        const close = text.indexOf(SENT_CLOSE, start)
        if (close < 0) continue
        const open = text.indexOf(SENT_OPEN, start)
        let items = []
        if (open >= 0 && open < close) {
          const jsonText = text.slice(open + SENT_OPEN.length, close).trim()
          try {
            items = sentNormalize(JSON.parse(jsonText))
          } catch {
            items = []
          }
        }
        if (items.length === 0) items = [{ quote: '引用内容已折叠', annotation: '', source: null }]
        sentRemoveRange(nodes, start, close + SENT_CLOSE.length)
        const turn = Number(flow.getAttribute('data-chat-turn'))
        if (activeSessionId !== null && Number.isSafeInteger(turn)) {
          mergeSentRecord(activeSessionId, {
            turn,
            quotes: items.map((item) => ({
              text: item.quote,
              annotation: item.annotation || '',
              source: item.source,
            })),
            createdAt: Date.now(),
          })
          renderSentPills(activeSessionId)
        } else {
          placeSentPill(flow, items)
        }
      }
    }

    function installSentQuoteFolding() {
      if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return () => {}
      for (const old of document.querySelectorAll('[data-dsq-sent-pill]')) old.remove()
      let scheduled = false
      const safeFold = () => {
        try {
          foldSentQuotes(document.body)
          renderSentPills(activeSessionId)
          renderInlineNotes(activeSessionId)
        } catch (error) {
          console.error('[quote-annotation] fold failed', error)
        }
      }
      const scan = () => {
        if (scheduled) return
        scheduled = true
        window.requestAnimationFrame(() => {
          scheduled = false
          safeFold()
        })
      }
      const observer = new MutationObserver(scan)
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['data-streaming'],
      })
      const timer = window.setTimeout(scan, 200)
      safeFold()
      scan()
      return () => {
        window.clearTimeout(timer)
        observer.disconnect()
        closeSentCard()
        for (const pill of document.querySelectorAll('[data-dsq-sent-pill]')) pill.remove()
      }
    }

    /* ------------------------------------------------------------------ */
    /* icons                                                              */
    /* ------------------------------------------------------------------ */

    function quoteIcon(size) {
      return h(
        'svg',
        {
          width: size || 14,
          height: size || 14,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
        },
        [
          h('path', {
            key: 'a',
            d: 'M3.2 3.2h9.6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H7l-2.4 2v-2h-1.4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z',
          }),
          h('path', { key: 'b', d: 'M5.4 6.3h5.2M5.4 8.4h3.2' }),
        ],
      )
    }

    function arrowIcon() {
      return h(
        'svg',
        {
          width: 14,
          height: 14,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
        },
        [h('path', { key: 'a', d: 'M8 12.5V3.5M4.3 7.2 8 3.5l3.7 3.7' })],
      )
    }

    function pencilIcon() {
      return h(
        'svg',
        {
          width: 12,
          height: 12,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
        },
        [h('path', { key: 'a', d: 'M10.4 2.6 13.4 5.6 5.5 13.5H2.5v-3L10.4 2.6Z' })],
      )
    }

    function trashIcon() {
      return h(
        'svg',
        {
          width: 12,
          height: 12,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
        },
        [h('path', { key: 'a', d: 'M3 4.5h10M6 4.5V3h4v1.5M4.8 4.5l.5 8.2h5.4l.5-8.2' })],
      )
    }

    function closeIcon() {
      return h(
        'svg',
        {
          width: 10,
          height: 10,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          'aria-hidden': 'true',
        },
        [h('path', { key: 'a', d: 'M4 4l8 8M12 4l-8 8' })],
      )
    }

    /* ------------------------------------------------------------------ */
    /* placement                                                          */
    /* ------------------------------------------------------------------ */

    function placeAction(rect) {
      const width = 112
      const left = clamp(rect.left + rect.width / 2, width / 2 + 8, window.innerWidth - width / 2 - 8)
      let top = rect.top - 34
      if (top < 8) top = rect.bottom + 8
      if (top > window.innerHeight - 36) top = Math.max(8, window.innerHeight - 36)
      return { left: left + 'px', top: top + 'px' }
    }

    function placeComposer(rect) {
      const width = Math.min(320, window.innerWidth - 24)
      const left = clamp(rect.left, 12, window.innerWidth - width - 12)
      if (rect.top > 160) {
        return {
          left: left + 'px',
          bottom: window.innerHeight - rect.top + 8 + 'px',
          width: width + 'px',
        }
      }
      return {
        left: left + 'px',
        top: Math.min(window.innerHeight - 56, rect.bottom + 8) + 'px',
        width: width + 'px',
      }
    }

    function placeCard(pill) {
      const width = Math.min(360, window.innerWidth - 24)
      const left = clamp(pill.left, 12, window.innerWidth - width - 12)
      const bottom = Math.max(64, window.innerHeight - pill.top + 8)
      return { left: left + 'px', bottom: bottom + 'px', width: width + 'px' }
    }

    /* ------------------------------------------------------------------ */
    /* components                                                         */
    /* ------------------------------------------------------------------ */

    function CommentComposer(props) {
      const [value, setValue] = React.useState(props.initialNote || '')
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState(null)
      const inputRef = React.useRef(null)

      React.useEffect(() => {
        const timer = window.setTimeout(() => {
          if (inputRef.current) inputRef.current.focus()
        }, 20)
        return () => window.clearTimeout(timer)
      }, [])

      React.useEffect(() => {
        const node = inputRef.current
        if (!node) return
        node.style.height = 'auto'
        node.style.height = Math.min(96, Math.max(24, node.scrollHeight)) + 'px'
      }, [value])

      const submit = React.useCallback(async () => {
        if (busy) return
        setBusy(true)
        setError(null)
        try {
          await props.onSubmit(value)
        } catch (failure) {
          setError(failure && failure.message ? failure.message : '添加引用失败。')
          setBusy(false)
        }
      }, [busy, props, value])

      const onKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.stopPropagation()
          props.onClose()
          return
        }
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
          event.preventDefault()
          submit()
        }
      }

      const style = placeComposer(props.rect)
      return h(
        'div',
        {
          className: 'dsq-root dsq-comment',
          style,
          role: 'dialog',
          'aria-label': props.initialNote ? '编辑批注' : '添加引用',
          onMouseDown: (event) => event.stopPropagation(),
        },
        [
          h('textarea', {
            key: 'input',
            ref: inputRef,
            className: 'dsq-comment-input',
            value,
            rows: 1,
            maxLength: 4000,
            placeholder: props.initialNote ? '编辑批注…' : '添加可选评论…',
            'aria-label': '批注（可选）',
            title: 'Enter 确认，Shift+Enter 换行',
            onChange: (event) => setValue(event.target.value),
            onKeyDown,
          }),
          h(
            'button',
            {
              key: 'send',
              type: 'button',
              className: 'dsq-comment-send',
              title: props.initialNote ? '保存批注（Enter）' : '添加引用（Enter）',
              'aria-label': props.initialNote ? '保存批注' : '添加引用',
              disabled: busy,
              onMouseDown: (event) => event.preventDefault(),
              onClick: submit,
            },
            busy ? '…' : arrowIcon(),
          ),
          error ? h('div', { key: 'error', className: 'dsq-comment-error' }, error) : null,
        ],
      )
    }

    function PendingCard(props) {
      const pos = props.position
      if (!pos) return null
      return h(
        'div',
        {
          className: 'dsq-root dsq-card',
          style: pos,
          role: 'dialog',
          'aria-label': '待发送的对话引用',
          onMouseDown: (event) => event.stopPropagation(),
        },
        [
          ...props.quotes.map((quote, index) =>
            h('div', { className: 'dsq-card-row', key: quote.id }, [
              h('span', { className: 'dsq-card-num', key: 'num' }, String(index + 1) + '.'),
              h('div', { className: 'dsq-card-main', key: 'main' }, [
                h('div', { className: 'dsq-card-label', key: 'label' }, '所选文本'),
                h(
                  'button',
                  {
                    key: 'text',
                    type: 'button',
                    className: 'dsq-card-text',
                    title: sourceLabel(quote.source) + ' · 跳回原文',
                    onClick: () => props.onJump(quote),
                  },
                  quote.text,
                ),
                quote.annotation ? h('div', { key: 'note', className: 'dsq-card-note' }, quote.annotation) : null,
              ]),
              h('div', { className: 'dsq-card-actions', key: 'actions' }, [
                h(
                  'button',
                  {
                    key: 'edit',
                    type: 'button',
                    className: 'dsq-icon-btn',
                    title: '编辑批注',
                    'aria-label': '编辑批注',
                    onClick: (event) => props.onEdit(quote, event),
                  },
                  pencilIcon(),
                ),
                h(
                  'button',
                  {
                    key: 'remove',
                    type: 'button',
                    className: 'dsq-icon-btn dsq-danger',
                    title: '删除引用',
                    'aria-label': '删除引用',
                    onClick: () => props.onRemove(quote.id),
                  },
                  trashIcon(),
                ),
              ]),
            ]),
          ),
        ],
      )
    }

    function SentQuoteTail(props) {
      const sessionId = props.sessionId || ''
      const [records, setRecords] = React.useState(() => sentRecords.get(sessionId) || [])
      const buttonRef = React.useRef(null)

      React.useEffect(() => {
        setRecords(sentRecords.get(sessionId) || [])
        return subscribeSent(sessionId, () => {
          setRecords(sentRecords.get(sessionId) || [])
        })
      }, [sessionId])

      const turnNumber = props.turn && typeof props.turn.turn === 'number' ? props.turn.turn : null
      if (!sessionId || turnNumber === null) return null
      const record = records.find((item) => item.turn === turnNumber)
      if (!record || !Array.isArray(record.quotes) || record.quotes.length === 0) return null
      const items = record.quotes.map((quote) => ({
        quote: quote.text,
        annotation: quote.annotation || '',
        source: quote.source,
      }))
      return h(
        'div',
        { className: 'dsq-root dsq-turn-tail' },
        h(
          'button',
          {
            ref: buttonRef,
            type: 'button',
            className: 'dsq-pill dsq-turn-pill',
            title: '查看本次发送的引用',
            onClick: () => openSentCard(buttonRef.current, items),
          },
          [quoteIcon(13), h('span', { key: 'label' }, record.quotes.length + ' 条引用')],
        ),
      )
    }

    function QuoteDock(props) {
      const sessionId = props.sessionId || (props.session && props.session.id) || ''
      const inputActions = props.inputActions
      const draft =
        typeof props.useInput === 'function'
          ? props.useInput((state) => (state && typeof state.draft === 'string' ? state.draft : ''))
          : ''
      const [quotes, setQuotes] = React.useState([])
      const [selection, setSelection] = React.useState(null)
      const [composer, setComposer] = React.useState(null)
      const [adding, setAdding] = React.useState(false)
      const [cardOpen, setCardOpen] = React.useState(false)
      const [cardPos, setCardPos] = React.useState(null)
      const [notice, setNotice] = React.useState(null)
      const [markerTick, setMarkerTick] = React.useState(0)
      const rootAnchorRef = React.useRef(null)
      const pillRef = React.useRef(null)
      const rangesRef = React.useRef(new Map())
      const aliveRef = React.useRef(true)
      const composerOpenRef = React.useRef(false)
      const requestSeqRef = React.useRef(0)
      const sessionRef = React.useRef(sessionId)

      sessionRef.current = sessionId

      composerOpenRef.current = composer !== null

      const applyQuotes = React.useCallback((next) => {
        if (!aliveRef.current) return
        const list = Array.isArray(next) ? next : []
        setQuotes(list)
        const live = new Set(list.map((quote) => quote.id))
        for (const id of rangesRef.current.keys()) {
          if (!live.has(id)) rangesRef.current.delete(id)
        }
      }, [])

      const refresh = React.useCallback(async () => {
        if (!sessionId) return
        const seq = ++requestSeqRef.current
        try {
          const payload = await loadPending(sessionId)
          if (seq !== requestSeqRef.current || sessionRef.current !== sessionId || !aliveRef.current) return
          applyQuotes(payload.quotes || [])
        } catch {
          // A failed poll must never break the composer.
        }
      }, [applyQuotes, sessionId])

      React.useEffect(() => {
        const anchor = rootAnchorRef.current
        const root = anchor === null ? document : conversationRootFor(anchor)
        if (sessionId) sessionRoots.set(sessionId, root)
        activeSessionId = sessionId || null
        renderSentPills(activeSessionId)
        renderInlineNotes(activeSessionId)
        aliveRef.current = true
        setQuotes([])
        setSelection(null)
        setComposer(null)
        setAdding(false)
        setCardOpen(false)
        setCardPos(null)
        setNotice(null)
        rangesRef.current.clear()
        requestSeqRef.current += 1
        if (sessionId) {
          refresh()
          loadSent(sessionId)
        }
        return () => {
          aliveRef.current = false
          const registered = sessionRoots.get(sessionId)
          if (registered !== undefined && registered === root) sessionRoots.delete(sessionId)
        }
      }, [refresh, sessionId])

      React.useEffect(() => {
        if (!sessionId || quotes.length === 0) return undefined
        const timer = window.setInterval(refresh, POLL_MS)
        return () => window.clearInterval(timer)
      }, [quotes.length, refresh, sessionId])

      const previousQuoteCountRef = React.useRef(0)
      const lastQuotesRef = React.useRef([])
      const dismissedRef = React.useRef(false)
      const baseTurnRef = React.useRef(null)

      React.useEffect(() => {
        if (quotes.length > 0) {
          lastQuotesRef.current = quotes
          dismissedRef.current = false
          if (baseTurnRef.current === null) baseTurnRef.current = latestUserTurn()
        }
      }, [quotes])

      React.useEffect(() => {
        const previous = previousQuoteCountRef.current
        previousQuoteCountRef.current = quotes.length
        if (previous === 0 || quotes.length !== 0) return
        if (dismissedRef.current) {
          dismissedRef.current = false
          lastQuotesRef.current = []
          baseTurnRef.current = null
          return
        }
        const captured = lastQuotesRef.current
        lastQuotesRef.current = []
        if (captured.length === 0) return
        const record = () => {
          const turn = latestUserTurn()
          if (turn === null) return
          if (baseTurnRef.current !== null && turn <= baseTurnRef.current) return
          publishClientSent(sessionId, turn, captured)
          baseTurnRef.current = null
        }
        window.setTimeout(record, 600)
        loadSent(sessionId)
      }, [quotes.length, sessionId])

      React.useEffect(() => {
        if (!sessionId || !inputActions || typeof inputActions.setDraft !== 'function') return
        const hasToken = draft.indexOf(DRAFT_TOKEN) !== -1
        const text = draft.split(DRAFT_TOKEN).join('')
        if (quotes.length > 0 && text.trim() === '' && !hasToken) {
          inputActions.setDraft(DRAFT_TOKEN)
        } else if (quotes.length === 0 && hasToken && text.trim() === '') {
          inputActions.setDraft('')
        }
      }, [draft, inputActions, quotes.length, sessionId])

      React.useEffect(() => {
        if (quotes.length === 0 && cardOpen) {
          setCardOpen(false)
          setCardPos(null)
        }
      }, [cardOpen, quotes.length])

      React.useEffect(() => {
        if (!notice) return undefined
        const timer = window.setTimeout(() => setNotice(null), 2200)
        return () => window.clearTimeout(timer)
      }, [notice])

      React.useEffect(() => {
        if (quotes.length === 0) return undefined
        let raf = 0
        const bump = () => {
          if (raf) return
          raf = window.requestAnimationFrame(() => {
            raf = 0
            setMarkerTick((value) => value + 1)
          })
        }
        window.addEventListener('scroll', bump, true)
        window.addEventListener('resize', bump)
        return () => {
          if (raf) window.cancelAnimationFrame(raf)
          window.removeEventListener('scroll', bump, true)
          window.removeEventListener('resize', bump)
        }
      }, [quotes.length])

      React.useEffect(() => {
        if (!cardOpen) return undefined
        const update = () => {
          if (!pillRef.current) return
          setCardPos(placeCard(pillRef.current.getBoundingClientRect()))
        }
        update()
        window.addEventListener('scroll', update, true)
        window.addEventListener('resize', update)
        return () => {
          window.removeEventListener('scroll', update, true)
          window.removeEventListener('resize', update)
        }
      }, [cardOpen])

      React.useEffect(() => {
        const onDown = (event) => {
          if (isOwnNode(event.target)) return
          if (composerOpenRef.current) setComposer(null)
          if (cardOpen) setCardOpen(false)
        }
        document.addEventListener('mousedown', onDown, true)
        return () => document.removeEventListener('mousedown', onDown, true)
      }, [cardOpen])

      React.useEffect(() => {
        let timer = 0
        const update = () => {
          if (!aliveRef.current || composerOpenRef.current) return
          const next = readSelection()
          setSelection((current) => {
            if (!next) return current === null ? current : null
            if (
              current &&
              current.text === next.text &&
              Math.abs(current.rect.top - next.rect.top) < 1 &&
              Math.abs(current.rect.left - next.rect.left) < 1
            ) {
              return current
            }
            return next
          })
        }
        const schedule = (delay) => {
          window.clearTimeout(timer)
          timer = window.setTimeout(update, delay)
        }
        const onMouseUp = (event) => {
          if (isOwnNode(event.target)) return
          schedule(0)
        }
        const onKeyUp = (event) => {
          if (isOwnNode(event.target)) return
          if (event.key === 'Shift' || event.key === 'Escape' || event.key.indexOf('Arrow') === 0) {
            schedule(0)
          }
        }
        const onSelectionChange = () => {
          if (composerOpenRef.current || isOwnNode(document.activeElement)) return
          schedule(150)
        }
        const onMouseDown = (event) => {
          if (isOwnNode(event.target)) return
          if (composerOpenRef.current) setComposer(null)
          setSelection(null)
        }
        const onScroll = () => {
          if (composerOpenRef.current) return
          schedule(0)
        }
        const onResize = () => schedule(0)
        const onKeyDown = (event) => {
          if (event.key !== 'Escape') return
          if (composerOpenRef.current) setComposer(null)
          setCardOpen(false)
          setSelection(null)
        }

        document.addEventListener('mouseup', onMouseUp, true)
        document.addEventListener('keyup', onKeyUp, true)
        document.addEventListener('selectionchange', onSelectionChange, true)
        document.addEventListener('mousedown', onMouseDown, true)
        document.addEventListener('scroll', onScroll, true)
        document.addEventListener('keydown', onKeyDown, true)
        window.addEventListener('resize', onResize)
        return () => {
          window.clearTimeout(timer)
          document.removeEventListener('mouseup', onMouseUp, true)
          document.removeEventListener('keyup', onKeyUp, true)
          document.removeEventListener('selectionchange', onSelectionChange, true)
          document.removeEventListener('mousedown', onMouseDown, true)
          document.removeEventListener('scroll', onScroll, true)
          document.removeEventListener('keydown', onKeyDown, true)
          window.removeEventListener('resize', onResize)
        }
      }, [])

      const openCreate = React.useCallback(async () => {
        if (!selection || !sessionId || adding) return
        const snapshot = selection
        dismissedRef.current = false
        setSelection(null)
        try {
          window.getSelection()?.removeAllRanges()
        } catch {
          /* ignore */
        }
        setAdding(true)
        try {
          const before = new Set(quotes.map((quote) => quote.id))
          const payload = await addQuote(sessionId, {
            text: snapshot.text,
            annotation: '',
            source: snapshot.source,
          })
          const list = payload.quotes || []
          const fresh = list.find((quote) => !before.has(quote.id))
          if (fresh && snapshot.range) {
            try {
              rangesRef.current.set(fresh.id, snapshot.range.cloneRange())
            } catch {
              /* ignore */
            }
          }
          applyQuotes(list)
          if (fresh !== undefined) {
            setComposer({
              quote: fresh,
              rect: snapshot.rect,
              initialNote: '',
              range: snapshot.range,
            })
          } else {
            setNotice('引用没有保存成功')
          }
        } catch (failure) {
          setNotice(failure && failure.message ? failure.message : '添加引用失败。')
        } finally {
          setAdding(false)
        }
      }, [adding, applyQuotes, quotes, sessionId, selection])

      const openEdit = React.useCallback((quote, event) => {
        let rect = null
        try {
          rect = event.currentTarget.getBoundingClientRect()
        } catch {
          rect = null
        }
        if (!rect) {
          const pill = pillRef.current
          rect = pill
            ? pill.getBoundingClientRect()
            : { left: 24, top: 120, right: 120, bottom: 150, width: 96, height: 30 }
        }
        setCardOpen(false)
        setComposer({
          quote,
          rect,
          initialNote: quote.annotation || '',
          range: rangesRef.current.get(quote.id) || null,
        })
      }, [])

      const submitComposer = React.useCallback(
        async (annotation) => {
          if (!composer || !composer.quote || !sessionId) return
          let payload
          let replaced = null
          try {
            payload = await updateQuote(sessionId, composer.quote.id, annotation)
          } catch (failure) {
            if (!isMissingUpdate(failure)) throw failure
            replaced = await replaceQuote(sessionId, composer.quote, annotation)
            payload = { quotes: replaced.quotes }
          }
          if (replaced !== null && replaced.newId !== undefined) {
            const range = rangesRef.current.get(replaced.oldId)
            if (range) {
              try {
                rangesRef.current.set(replaced.newId, range)
              } catch {
                /* ignore */
              }
              rangesRef.current.delete(replaced.oldId)
            }
          }
          applyQuotes(payload.quotes || [])
          setComposer(null)
        },
        [applyQuotes, composer, sessionId],
      )

      const onRemove = React.useCallback(
        async (id) => {
          if (!sessionId) return
          try {
            const payload = await removeQuote(sessionId, id)
            rangesRef.current.delete(id)
            if ((payload.quotes || []).length === 0) dismissedRef.current = true
            applyQuotes(payload.quotes || [])
          } catch (failure) {
            setNotice(failure && failure.message ? failure.message : '移除引用失败。')
          }
        },
        [applyQuotes, sessionId],
      )

      const onClear = React.useCallback(async () => {
        if (!sessionId) return
        try {
          const payload = await clearQuotes(sessionId)
          rangesRef.current.clear()
          dismissedRef.current = true
          applyQuotes(payload.quotes || [])
          setCardOpen(false)
        } catch (failure) {
          setNotice(failure && failure.message ? failure.message : '清空引用失败。')
        }
      }, [applyQuotes, sessionId])

      const onJump = React.useCallback((quote) => {
        const row = findAnchorRow(quote.source)
        if (!row) {
          setNotice('原文不在当前视图里')
          return
        }
        setCardOpen(false)
        row.scrollIntoView({ block: 'center', behavior: 'smooth' })
        flashRow(row)
      }, [])

      const openCard = React.useCallback(() => {
        if (quotes.length === 0) return
        const pill = pillRef.current
        if (!pill) return
        setCardPos(placeCard(pill.getBoundingClientRect()))
        setCardOpen((open) => !open)
      }, [quotes.length])

      const markerPosition = (quote) => {
        const range = rangesRef.current.get(quote.id)
        if (range) {
          try {
            const rect = range.getBoundingClientRect()
            if (rect && (rect.width !== 0 || rect.height !== 0)) {
              return {
                left: Math.min(window.innerWidth - 26, rect.right + 4) + 'px',
                top: Math.max(6, rect.top - 2) + 'px',
              }
            }
          } catch {
            /* range detached */
          }
        }
        const row = findAnchorRow(quote.source)
        if (row) {
          const rect = row.getBoundingClientRect()
          if (rect && (rect.width !== 0 || rect.height !== 0)) {
            return {
              left: Math.min(window.innerWidth - 26, rect.right - 6) + 'px',
              top: Math.max(6, rect.top + 4) + 'px',
            }
          }
        }
        return null
      }

      if (!sessionId) return null

      const pill =
        quotes.length > 0
          ? h(
              'div',
              {
                key: 'pill',
                ref: pillRef,
                className: 'dsq-root dsq-pill',
              },
              [
                h(
                  'button',
                  {
                    key: 'main',
                    type: 'button',
                    className: 'dsq-pill-main',
                    onClick: openCard,
                    title: '查看引用；它们会随下一条消息发送',
                    'aria-expanded': cardOpen,
                  },
                  [quoteIcon(13), h('span', { key: 'label' }, quotes.length + ' 条注释')],
                ),
                h(
                  'button',
                  {
                    key: 'clear',
                    type: 'button',
                    className: 'dsq-pill-clear',
                    title: '清空全部引用',
                    'aria-label': '清空全部引用',
                    onClick: onClear,
                  },
                  closeIcon(),
                ),
              ],
            )
          : null

      const markers = quotes.map((quote, index) => {
        void markerTick
        const pos = markerPosition(quote)
        if (!pos) return null
        return h(
          'button',
          {
            key: 'marker-' + quote.id,
            type: 'button',
            className: 'dsq-root dsq-marker',
            style: pos,
            title: '查看引用',
            'aria-label': '查看第 ' + (index + 1) + ' 条引用',
            onClick: openCard,
          },
          String(index + 1),
        )
      })

      const highlightRects = (() => {
        if (!composer) return []
        if (composer.range) return rangeClientRects(composer.range)
        const row = findAnchorRow(composer.quote && composer.quote.source)
        if (row) {
          const rect = row.getBoundingClientRect()
          if (rect && (rect.width > 1 || rect.height > 1)) {
            return [{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, fallback: true }]
          }
        }
        return []
      })()

      const action =
        selection && !composer
          ? h(
              'button',
              {
                key: 'action',
                type: 'button',
                className: 'dsq-root dsq-action',
                style: placeAction(selection.rect),
                title: '把选中文字作为引用添加到下一条消息',
                disabled: adding,
                onMouseDown: (event) => event.preventDefault(),
                onClick: openCreate,
              },
              [quoteIcon(13), h('span', { key: 'label' }, adding ? '添加中…' : '添加到对话')],
            )
          : null

      return h(Fragment, null, [
        h('span', {
          key: 'root-anchor',
          ref: rootAnchorRef,
          style: { display: 'none' },
          'aria-hidden': 'true',
        }),
        ...highlightRects.map((rect, index) =>
          h('div', {
            key: 'hl-' + index,
            className: 'dsq-root dsq-highlight' + (rect.fallback ? ' dsq-highlight-row' : ''),
            style: {
              left: rect.left + 'px',
              top: rect.top + 'px',
              width: rect.width + 'px',
              height: rect.height + 'px',
            },
          }),
        ),
        pill,
        ...markers.filter(Boolean),
        action,
        cardOpen
          ? h(PendingCard, {
              key: 'card',
              position: cardPos,
              quotes,
              onJump,
              onEdit: openEdit,
              onRemove,
            })
          : null,
        composer
          ? h(CommentComposer, {
              key: 'composer',
              rect: composer.rect,
              initialNote: composer.initialNote,
              onSubmit: submitComposer,
              onClose: () => setComposer(null),
            })
          : null,
        notice ? h('div', { key: 'notice', className: 'dsq-root dsq-toast' }, notice) : null,
      ])
    }

    /* ------------------------------------------------------------------ */
    /* plugin                                                             */
    /* ------------------------------------------------------------------ */

    function apply(ctx) {
      ensureStyles()
      ctx.effect(() => installSentQuoteFolding(), 'quote-annotation: sent quote folding')
      ctx.slots.inject('conversation.input.left', () =>
        ctx.slots.register(
          {
            name: 'conversation.input.left',
            id: 'quote-annotation',
            order: 30,
            label: () => '对话引用',
          },
          QuoteDock,
        ),
      )
      ctx.effect(() => () => removeStyles(), 'quote-annotation: styles')
    }

    exports.apply = apply
    exports.inject = ['slots']
    exports.QuoteDock = QuoteDock
    exports.SentQuoteTail = SentQuoteTail
    exports.CommentComposer = CommentComposer
    exports.__test = {
      readSelection,
      collectSource,
      sourceLabel,
      findAnchorRow,
      isChrome,
      placeAction,
      placeComposer,
      placeCard,
      publishSent,
      sentRecords,
    }
    return module.exports
  },
})
