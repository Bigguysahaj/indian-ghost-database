# Contributing

Help build a useful, traceable resource for Indian game developers. Regional knowledge, language corrections and corrections to overgeneralised descriptions are particularly valuable.

## Add or improve an entry

1. Search existing names and aliases before adding a record. Similar names do not automatically mean the same being.
2. Edit `data/ghosts.json`; use `data/entry-template.json` for a new record and assign a unique stable slug. Set `seed_reference` to `null` for additions outside the photographed list.
3. Add sources to `research/evidence.json`. Include a stable ID, title, URL or archival locator, source type, access date and limitations. Books accepted into the bibliography belong in `data/references.json`.
4. Cite evidence on every populated claim. Keep unsupported values `null`, with `status: "unknown"` and an empty source list. An empty prey field does not mean harmless; an empty nemesis field does not mean invulnerable.
5. Put competing regional accounts in `variants`, each with a `region`, a `difference` description and its own `source_ids`. Avoid merging contradictory accounts into one creature.
6. Run `python scripts/catalogue.py`, then `python scripts/catalogue.py --check`. Include the generated Markdown in the pull request.

## Evidence status

| Status | Meaning |
| --- | --- |
| `unknown` | No supported value entered |
| `provisional` | Consulted source supports the note; underlying evidence or identity still needs review |
| `documented` | A reviewer checked the claim against a traceable primary or suitable scholarly source |
| `disputed` | Contradictory evidence exists; explain it in the note and variant records |

`documented` concerns documentation of a belief or story, never proof of a supernatural event. Do not upgrade an entire entry merely because one field has a strong citation. `reviewed` is a human editorial milestone, not a guarantee of exhaustive coverage.

## Oral histories

Record the language, approximate region, date, teller’s consent and permitted attribution. Anonymity is welcome. Explain whether this is personal recollection, a family story, a ritual account or a modern retelling. Do not publish private contact information or restricted community knowledge. One teller’s account is a regional variant, not universal consensus.

## Cultural context and rights

Describe beliefs about caste, gender, religion and illness as attributed beliefs. Do not encode a community as inherently evil or turn a living guardian deity into a monster without acknowledging context. Clinical symptoms and folklore motifs are different kinds of information.

Write original concise summaries. Do not copy book chapters, modern character designs, illustrations or game statistics. Include third-party attribution where appropriate. Submit only material you may contribute under the applicable project license; see `LICENSE.md`.

## Extending the schema

Stable IDs are permanent. Add new sourced claims within `claims` or prototype structured fields under `extensions`. Promote widely useful fields into a versioned schema change. Add relationships with target IDs rather than duplicating entries. Keep `game_design_notes` explicitly creative. Native names should include a language/script and a source trail.
