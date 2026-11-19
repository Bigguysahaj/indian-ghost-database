# 07 · Generate `data/index.json` for crawling agents

**Why:** an agent should list and filter all 84 ghosts from one small file instead of reading `data/ghosts.json` (large) or 84 Markdown pages.

## Acceptance
- [ ] `render()` in `scripts/catalogue.py` adds an output `data/index.json` (so `--check` already fails when it is stale, and plain `python3 scripts/catalogue.py` rewrites it).
- [ ] Shape: `{"schema_version", "updated", "ghosts": [...]}` with one entry per ghost, in `data/ghosts.json` order:
  `id`, `name`, `aliases`, `research_status`, `classification` (claim value or null), `location` (claim value or null), `page` (`ghosts/<id>.md`).
- [ ] `json.dumps(..., indent=2, ensure_ascii=False) + '\n'`, matching other JSON in the repo.
- [ ] Generated `data/index.json` is committed; `python3 scripts/catalogue.py --check` passes.
- [ ] Summary line in `main()` still prints (output count goes from 85 to 86).

## Test
- File: `scripts/tests/test_index.py`
- Run: `python3 -m unittest scripts/tests/test_index.py -k test_index_lists_every_ghost -k test_committed_index_is_in_sync`
- Fails today: `render()` emits no `data/index.json`.

## Out of scope
- `research_file` field (issue 08).
- Copying the index into `site/public/` (`sync_site.py` unchanged).
- A schema file for the index.
