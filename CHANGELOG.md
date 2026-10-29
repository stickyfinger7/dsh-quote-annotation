# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-10-29

UI language support and a fixed home for inline markers.

### Added

- UI copy follows the DSH UI language: Chinese and English dictionaries, with English as the
  fallback for every other language. Switching the language in Settings updates pills, cards,
  inline markers and the composer live, without a reload.
- Host-side copy follows the language sent by the Client: the quote-only placeholder (`（引用）` /
  `Quote`) and the route error messages.
- English demo GIF (`docs/media/quote-demo.en.gif`) and a Demo section in both READMEs.

### Fixed

- Inline notes no longer land inside the collapsed reasoning block. `findAssistantFlow` skips
  `reasoning` flows, so the `Note N` / `注释 N` marker attaches to the visible assistant answer.

### Changed

- `lib/client.js` and `lib/host.js` carry one dictionary per language; no user-visible string is
  hardcoded outside a dictionary.
- Tests cover language normalization, localized Host copy and the language header on `POST /add`.

## [1.0.0] - 2026-10-28

First public release.

### Added

- Select text in Chat → **Add to chat**, with an optional annotation that can be edited later.
- Pending quote pill in the composer tool row and sent pill above the user message; clicking a
  pill opens the quote/annotation card and jumps back to the source.
- Quote-only sends: the send button stays enabled without typing extra text.
- Inline `注释 N` markers in assistant replies, placed after the turn completes; hover shows the
  quote and comment, click jumps back to the source.
- Historical backfill: `GET /dsh-quote-annotation/sent` rebuilds sent records from the Session log,
  so pills and markers survive a Host restart.
- `node:test` smoke tests covering normalization, prompt rendering, pre-step injection and the HTTP
  surface.
- `dsh.plugin.json` manifest and complete `package.json` metadata for release publishing.

### Changed

- Sources formatted with Prettier (`semi: false`, single quotes, 120 columns); no runtime
  dependencies and no build step.
- Route handlers now return their promise so the error path is observable and testable.
- Installation and verification steps consolidated into `README.md` / `README.zh.md`
  (`INSTALL.md` removed).

[1.0.0]: https://github.com/stickyfinger7/dsh-quote-annotation/releases/tag/v1.0.0
[1.1.0]: https://github.com/stickyfinger7/dsh-quote-annotation/releases/tag/v1.1.0
