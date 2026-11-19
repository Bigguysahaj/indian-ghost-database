# 09 · Add "Navigating for game design" to AGENTS.md

**Why:** agents crawling a clone (no MCP) need a short map of where ghost data, evidence and game-usable traits live, and which layer is sourced vs invented.

Depends on: 07 and 01 (paths it names must exist); write it after 08.

## Acceptance
- [ ] AGENTS.md has a `## Navigating for game design` section, at most ~30 lines, that tells an agent to:
  - start at `data/index.json` to list/filter ghosts;
  - open `research/ghosts/<id>.md` (via `research_file`) for abilities, weaknesses, triggers;
  - fall back to `data/ghosts.json` for full claims and `research/evidence.json` for source limitations;
  - treat `game_design_notes` / dossier traits as `creative_interpretation`, never as sourced lore;
  - run `python3 scripts/catalogue.py --check` after any edit; never hand-edit `GHOSTS.md`, `ghosts/*.md` or `data/index.json`.
- [ ] Existing AGENTS.md sections unchanged.

## Test
- File: `scripts/tests/test_agents_md.py`
- Run: `python3 -m unittest scripts/tests/test_agents_md.py`
- Fails today: heading absent.

## Out of scope
- README/CONTRIBUTING edits, MCP server, site changes.
