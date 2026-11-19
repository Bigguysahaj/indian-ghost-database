# 08 · Link research dossiers from `data/index.json`

**Why:** agents crawling the index should know which ghosts have a game-ready dossier without probing the filesystem.

Depends on: 07 (index), and is most useful after 02-06.

## Acceptance
- [ ] Each index entry gains `research_file`: `"research/ghosts/<id>.md"` if that file exists, else `null`.
- [ ] Regenerated `data/index.json` committed; `python3 scripts/catalogue.py --check` passes.
- [ ] Adding or deleting a dossier without regenerating makes `--check` fail (falls out of 07's stale-output check).

## Test
- File: `scripts/tests/test_index.py`
- Run: `python3 -m unittest scripts/tests/test_index.py -k test_index_links_research_dossier`
- Fails today: no `data/index.json` output, then no `research_file` key.

## Out of scope
- Any other new index fields (e.g. traits, tags).
- Rendering dossier links into `ghosts/*.md` or `GHOSTS.md`.
