# AGENTS.md

Operational notes for maintainers and AI agents. Keep changes small and boring.

## Repo shape

```
lib/host.js          Host plugin (ESM): stores, HTTP routes, agent/pre-step, log backfill
lib/client.js        Browser module loaded by window.__ModuleLoader__ (no build step)
cordis.patch.yml     Profile bundle patch (plugin id: quote-annotation)
dsh.plugin.json      Release manifest (metadata only; DSH loads package.json)
test/host.test.js    node:test smoke tests for the Host half
```

There is no bundler and no generated client source: `lib/client.js` is the artifact. Tests use the
built-in `node:test` runner, so there is still no dependency to install.

## Runtime model

1. Client selection calls `POST /dsh-quote-annotation/add`.
2. Host keeps a per-session pending list.
3. On the next `agent/pre-step` that contains a direct user message, Host appends a **separate** `user/message` with `source.kind = "conversation-quote"` and `source.references = [{ quote, annotation?, source }]`.
4. Chat hides ordinary context nodes (`isVisibleChatNode`), so the raw context never renders. Do not prepend the prompt to the direct user message.
5. `GET /dsh-quote-annotation/sent` rebuilds sent records from `ctx.sessions.get(id).snapshotEvents()`; the client places pills above matching `[data-chat-flow-kind="user"][data-chat-turn]` flows.

## Inline notes

- `sentAnnotations(sessionId)` flattens sent records into a stable `turn:index` key and a session-wide `注释 N` number.
- A marker is inserted only into an `assistant-step` flow of the same turn, and only after that turn's `turn-tail` exists (i.e. the turn is complete). Skipping streaming avoids moving the marker as text arrives.
- Appends the marker to the end of the paragraph/block containing the quote; no text-node splitting. Fallback is the last paragraph of the reply.
- The marker is `<button data-dsq-inline-key>`; hover opens a card with the quote and user comment. Click scrolls to `source`, flashes the source row, and shows a small toast.
- The MutationObserver also watches `data-streaming`; when the attribute clears, scan again.
- Marker updates are idempotent: only set `textContent`/dataset when changed, otherwise the observer loops on its own mutations.

## Invariants

- **Never mutate the editor** except the invisible draft token `U+2063`. The Host must strip the token in `stripDraftToken` and fall back to `（引用）` when the message becomes empty.
- **Never put quoted text into the user's draft.** Quotes live in the Host pending store.
- **Never render raw context in Chat.** A separate hidden context message is the contract.
- **Sent pill placement is DOM enhancement.** Keep it additive; do not override `conversation.chat.node` for `user`.
- **Inline notes are idempotent DOM enhancement.** Key them by `turn:index`; never append a second marker for the same key; avoid rewriting unchanged text.
- **Pending quotes are volatile.** Host restart clears them; sent records are backfilled from the log.
- **No new dependencies.** Pure Node/browser APIs only. Tests must stay on `node:test`.

## HTTP API

| Method | Path | Body / query |
|---|---|---|
| `GET` | `/dsh-quote-annotation/pending?sessionId=` | — |
| `POST` | `/dsh-quote-annotation/add` | `{ sessionId, quote: { text, annotation, source } }` |
| `POST` | `/dsh-quote-annotation/update` | `{ sessionId, id, annotation }` |
| `POST` | `/dsh-quote-annotation/remove` | `{ sessionId, id }` |
| `POST` | `/dsh-quote-annotation/clear` | `{ sessionId }` |
| `GET` | `/dsh-quote-annotation/sent?sessionId=` | — |

Mutations require `content-type: application/json` and `x-dsh-quote-annotation: 1`. Routes are loopback/connection checked. Every handler is wrapped so failures become JSON errors; the wrapper returns the handler promise so tests can await it.

## Dev loop

```sh
npm run check                 # node --check on both files
npm test                      # node:test smoke tests
npx prettier@3 --write lib test
dsh plugin --profile web add /path/to/this/repo
# restart the profile once; refresh the page
```

Formatting is Prettier with `semi: false`, single quotes and 120 columns (see `.prettierrc.json`).
Do not reformat by hand — run the formatter, then re-run `npm run check` and `npm test`.

Client-only changes can be reloaded by the DSH client HMR when a watcher is running; Host changes require a profile restart. Node's ESM cache survives disable/enable, so do not rely on toggling the plugin to load new Host code.

## Release

1. Bump `version` in `package.json` **and** `dsh.plugin.json`, and add a `CHANGELOG.md` entry.
2. Run `npm run check` and `npm test`.
3. Commit, then tag: `git tag -a vX.Y.Z -m "vX.Y.Z"` and `git push origin main --tags`.
4. Create the GitHub release from the tag; users can pin it with
   `dsh plugin --profile web add github:stickyfinger7/dsh-quote-annotation#vX.Y.Z`.

## Fragile points

- DSH Chat DOM selectors: `data-conversation-scroll`, `data-chat-flow-kind`, `data-chat-turn`, `data-chat-node-key`, `data-chat-anchor-key`.
- Inline markers require `data-chat-flow-kind="turn-tail"` for the same turn; no tail means no marker yet.
- Marker placement is paragraph-based; there is no sentence parser. If the quote is paraphrased, the marker lands at the end of the reply.
- Chat visibility rule for `context` nodes; changing `source.kind` can make the raw block visible.
- `session.snapshotEvents()` is deprecated but still the only simple historical read. Keep the seq-keyed cache.
- Quote-only messages show `（引用）` to the model; the pill is the human-visible record.

## 中文摘要

- `lib/client.js` 直接是可加载的浏览器模块，没有构建步骤；测试用内置 `node:test`，仍然零依赖。
- 引用只能通过 Host 的 pending 表 + 隐藏 `conversation-quote` context 消息发送，禁止塞回用户草稿或直接拼进用户消息。
- 唯一允许写入草稿的是不可见 token `U+2063`，Host 必须在模型步骤前剥离。
- 发送后的胶囊按 `data-chat-flow-kind="user"` + `data-chat-turn` 挂到消息上方；这是 DOM 增强，不要覆盖 Chat 的 React 节点。
- 行内 `注释 N` 只在同回合的 `turn-tail` 出现后插入助手回复，追加到引用所在段落末尾；悬停只展示引用和评论，点击滚回原文并 toast；按 `turn:index` 幂等，避免 MutationObserver 自循环。
- Host 改动需要重启 profile；Node ESM 缓存不会因插件禁用/启用而失效。
- 发版：同步改 `package.json` 和 `dsh.plugin.json` 的版本号、补 CHANGELOG、跑 check/test、打 `vX.Y.Z` tag。
