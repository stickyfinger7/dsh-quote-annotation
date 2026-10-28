# Changelog

All notable changes to this project are documented in this file. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
