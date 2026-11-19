# 02 · Add research dossier for Aacheri

**Why:** most complete entry (9/14 claims), with a clear time trigger, a reported counter and a target, so it is the best template dossier.

Depends on: 01 (validator).

## Acceptance
- [ ] `research/ghosts/aacheri.md` exists with headings `# Aacheri`, then `## Sources`, `## Region`, `## Behaviours`, `## Abilities`, `## Weaknesses`, `## Triggers`, each non-empty.
- [ ] `## Sources` lists the backticked source ids already cited for `aacheri` in `data/ghosts.json` (`wiki-acheri`), plus the seed `banerjee-2021` locator.
- [ ] Region and Behaviours restate existing sourced claims only; no new lore without a new evidence record.
- [ ] Abilities, Weaknesses and Triggers are each marked `creative_interpretation` and name the claim field they derive from (per RESEARCH.md "Design data policy"). Unknowns say "Unknown — research needed." rather than invent.
- [ ] Suggested hooks: trigger = dusk descent from summits; weakness = scarlet thread (protections); ability = shadow brings illness (behavior); prey = children.

## Test
- File: `scripts/tests/test_dossiers.py` (`test_aacheri`)
- Run: `python3 -m unittest scripts/tests/test_dossiers.py -k aacheri`
- Also: `python3 scripts/catalogue.py --check`
- Fails today: `research/ghosts/aacheri.md` does not exist.

## Out of scope
- Editing `data/ghosts.json` claims, `research_status`, or the other four dossiers.
- Combat numbers (damage, HP, cooldowns).
