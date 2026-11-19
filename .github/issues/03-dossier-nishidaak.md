# 03 · Add research dossier for Nishidaak

**Why:** its "calls only twice" rule is already a ready-made, sourced audio mechanic; it also has a relationship to Nali Ba.

Depends on: 01 (validator).

## Acceptance
- [ ] `research/ghosts/nishidaak.md` exists with headings `# Nishidaak`, then `## Sources`, `## Region`, `## Behaviours`, `## Abilities`, `## Weaknesses`, `## Triggers`, each non-empty.
- [ ] `## Sources` lists the backticked source ids already cited for `nishidaak` in `data/ghosts.json` (`enroute-nishi`), plus the seed `banerjee-2021` locator.
- [ ] Region and Behaviours restate existing sourced claims only; no new lore without a new evidence record.
- [ ] Abilities, Weaknesses and Triggers are each marked `creative_interpretation` and name the claim field they derive from (per RESEARCH.md "Design data policy"). Unknowns say "Unknown — research needed." rather than invent.
- [ ] Suggested hooks: trigger = being alone on a road at night; ability = familiar-voice call that leads the listener away; weakness = do not answer until a third call (protections).

## Test
- File: `scripts/tests/test_dossiers.py` (`test_nishidaak`)
- Run: `python3 -m unittest scripts/tests/test_dossiers.py -k nishidaak`
- Also: `python3 scripts/catalogue.py --check`
- Fails today: `research/ghosts/nishidaak.md` does not exist.

## Out of scope
- Editing `data/ghosts.json` claims, `research_status`, or the other four dossiers.
- Combat numbers (damage, HP, cooldowns).
