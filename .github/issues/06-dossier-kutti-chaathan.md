# 06 · Add research dossier for Kutti Chaathan

**Why:** Kerala poltergeist/trickster archetype; the only one of the five with a regional variant record, testing how dossiers handle variants.

Depends on: 01 (validator).

## Acceptance
- [ ] `research/ghosts/kutti-chaathan.md` exists with headings `# Kutti Chaathan`, then `## Sources`, `## Region`, `## Behaviours`, `## Abilities`, `## Weaknesses`, `## Triggers`, each non-empty.
- [ ] `## Sources` lists the backticked source ids already cited for `kutti-chaathan` in `data/ghosts.json` (`wiki-kutti`), plus the seed `banerjee-2021` locator.
- [ ] Region and Behaviours restate existing sourced claims only; no new lore without a new evidence record.
- [ ] Abilities, Weaknesses and Triggers are each marked `creative_interpretation` and name the claim field they derive from (per RESEARCH.md "Design data policy"). Unknowns say "Unknown — research needed." rather than invent.
- [ ] Suggested hooks: ability = thrown stones, disturbed beds, household fires (behavior); weakness = appeasement through offerings (protections); note the Vishnumaya Chathan variant is a deity, not a generic hostile ghost.

## Test
- File: `scripts/tests/test_dossiers.py` (`test_kutti_chaathan`)
- Run: `python3 -m unittest scripts/tests/test_dossiers.py -k kutti_chaathan`
- Also: `python3 scripts/catalogue.py --check`
- Fails today: `research/ghosts/kutti-chaathan.md` does not exist.

## Out of scope
- Editing `data/ghosts.json` claims, `research_status`, or the other four dossiers.
- Combat numbers (damage, HP, cooldowns).
