# 05 · Add research dossier for Shankhchunni

**Why:** possession archetype with a sourced counter (ojha exorcism) and a specific Bengal setting.

Depends on: 01 (validator).

## Acceptance
- [ ] `research/ghosts/shankhchunni.md` exists with headings `# Shankhchunni`, then `## Sources`, `## Region`, `## Behaviours`, `## Abilities`, `## Weaknesses`, `## Triggers`, each non-empty.
- [ ] `## Sources` lists the backticked source ids already cited for `shankhchunni` in `data/ghosts.json` (`wiki-shakchunni`), plus the seed `banerjee-2021` locator.
- [ ] Region and Behaviours restate existing sourced claims only; no new lore without a new evidence record.
- [ ] Abilities, Weaknesses and Triggers are each marked `creative_interpretation` and name the claim field they derive from (per RESEARCH.md "Design data policy"). Unknowns say "Unknown — research needed." rather than invent.
- [ ] Suggested hooks: trigger = trees such as sheora/mango (habitat); ability = possessing married women (behavior); weakness = expulsion by an ojha (protections); tell = conch bangles, red-and-white sari.

## Test
- File: `scripts/tests/test_dossiers.py` (`test_shankhchunni`)
- Run: `python3 -m unittest scripts/tests/test_dossiers.py -k shankhchunni`
- Also: `python3 scripts/catalogue.py --check`
- Fails today: `research/ghosts/shankhchunni.md` does not exist.

## Out of scope
- Editing `data/ghosts.json` claims, `research_status`, or the other four dossiers.
- Combat numbers (damage, HP, cooldowns).
