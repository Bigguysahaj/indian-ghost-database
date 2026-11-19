# 01 · Validate research dossiers in `research/ghosts/`

**Why:** game builders need per-ghost dossiers with sources, region and game-usable traits, and nothing currently checks their shape.

## Acceptance
- [ ] `scripts/catalogue.py` exposes `DOSSIER_SECTIONS = ['Sources', 'Region', 'Behaviours', 'Abilities', 'Weaknesses', 'Triggers']`.
- [ ] `validate_dossier(path, ghost_ids, source_ids)` raises `ValueError` when:
  - the file stem is not a ghost `id` in `data/ghosts.json`;
  - any `## <section>` heading is missing, or its body is empty;
  - `## Sources` names no backticked source id that exists in `data/references.json` or `research/evidence.json`.
- [ ] `main()` runs `validate_dossier` on every `research/ghosts/*.md` (none exist yet, so `--check` still passes).
- [ ] Stdlib only, like the rest of `catalogue.py`.

## Test
- File: `scripts/tests/test_dossier_validator.py`
- Run: `python3 -m unittest scripts/tests/test_dossier_validator.py`
- Also: `python3 scripts/catalogue.py --check` still passes.
- Fails today: `catalogue` has no `validate_dossier` / `DOSSIER_SECTIONS`.

## Out of scope
- Writing any dossier (issues 02-06).
- Checking that Abilities/Weaknesses/Triggers are *true*; that is research review.
- Changing `data/ghosts.json` or the schema.
