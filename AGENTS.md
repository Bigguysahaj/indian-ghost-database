# Agent workflow

Keep issues tiny: one behaviour change, one PR, ideally under ~50 changed lines. If an issue needs "and", split it.

## Flow
1. **Issues → subagent, always.** Never write issues yourself. Spawn the `issue-writer` agent (runs on Opus 5.5) with the goal; it returns one or more small issues, each with a test.
2. **Tests first.** Each issue ships with a test (or a runnable check) that fails before the work and passes after. Use `node --test` for `site/src/lib`, and the validators in `scripts/` for data/schema.
3. **Resolve it yourself.** Implement the issue in the main session; no further subagents needed.
4. **Review against the test.** Run the issue's test, then re-read your diff against the issue's acceptance criteria. Say plainly if anything fails or was skipped.

## Issue format
Title · Why (1 line) · Acceptance (checklist) · Test (file + command) · Out of scope.

## Navigating for game design
- Start at `data/index.json` to list or filter ghosts (id, name, aliases, status, classification, location, `research_file`).
- Open `research/ghosts/<id>.md` (the `research_file` path) for behaviours, abilities, weaknesses and triggers.
- Fall back to `data/ghosts.json` for full claims and `research/evidence.json` for source limitations.
- Abilities, weaknesses, triggers and `game_design_notes` are `creative_interpretation`, never sourced lore.
- After any edit run `python3 scripts/catalogue.py --check`.
- Never hand-edit `GHOSTS.md`, `ghosts/*.md` or `data/index.json`; edit `data/ghosts.json` and run `python3 scripts/catalogue.py`.
