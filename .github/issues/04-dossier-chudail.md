# 04 · Add research dossier for Chudail

**Why:** the most widely recognised entry (pan-South Asian), with a strong visual tell and liminal-place habitat.

Depends on: 01 (validator).

## Acceptance
- [ ] `research/ghosts/chudail.md` exists with headings `# Chudail`, then `## Sources`, `## Region`, `## Behaviours`, `## Abilities`, `## Weaknesses`, `## Triggers`, each non-empty.
- [ ] `## Sources` lists the backticked source ids already cited for `chudail` in `data/ghosts.json` (`wiki-churel`), plus the seed `banerjee-2021` locator.
- [ ] Region and Behaviours restate existing sourced claims only; no new lore without a new evidence record.
- [ ] Abilities, Weaknesses and Triggers are each marked `creative_interpretation` and name the claim field they derive from (per RESEARCH.md "Design data policy"). Unknowns say "Unknown — research needed." rather than invent.
- [ ] Suggested hooks: tell = backward-facing feet (appearance); trigger = crossroads / cremation grounds (habitat); ability = luring travellers, revenge on male relatives (behavior); weakness = Unknown in current sources.

## Test
- File: `scripts/tests/test_dossiers.py` (`test_chudail`)
- Run: `python3 -m unittest scripts/tests/test_dossiers.py -k chudail`
- Also: `python3 scripts/catalogue.py --check`
- Fails today: `research/ghosts/chudail.md` does not exist.

## Out of scope
- Editing `data/ghosts.json` claims, `research_status`, or the other four dossiers.
- Combat numbers (damage, HP, cooldowns).
