# Initial research pass

Date: 21 September 2026.

## Coverage

- All 84 photographed names transcribed with chapter start pages.
- All 84 entries now carry at least one provisional sourced claim; no entry is name-only anymore.
- No entry has completed regional or scholarly review — `initial_notes` is not `reviewed`.
- 320 claim fields are populated across the 84 entries, out of 14 fields × 84 entries = 1,176 possible; the remainder stay `null`/`unknown` rather than guessed.
- 41 web evidence records accompany the single initial book reference (`banerjee-2021`). This replaces and supersedes the smaller evidence set from the first publishing pass — see `research/evidence.json` for the current list.
- 6 entries carry regional `variants`; 7 carry `relationships` to other entries (for example Brahmarakshasa and Putana as rakshasa, Marid and Ifrit as jinn classifications).
- No full chapter text, scans, illustrations, inferred numerical lifespans or invented combat statistics are included.

Names follow the photographed spelling, including `Nali Ba`, `Nishidaak`, `Potachunni` and `Skondhokata`. Proposed aliases are search aids requiring identity checks. Publication year 2021 is the date of the Banerjee reference, not the age or origin date of a tradition.

## Research method and limitations

The publisher's page, an authorised introductory excerpt (a Scroll.in article covering several named entries) and a third-party public transcription of the book were consulted, alongside independently published reference articles (general encyclopaedic sources, mythology reference sites, and Quranic citations for the jinn-derived entries: Jinn, Marid, Ifrit). William Crooke's 1896 folklore survey and Mustafa Khan Dey's literary material supplied historical detail for a small number of entries; both carry the biases of their period and are cited as reported tradition, not as verified fact.

The third-party book transcription is not a publisher-controlled edition; its claims are marked provisional throughout and chapter numbers are recorded as evidence locators, not webpage line numbers. Religious and cosmological figures — Dakini, Gandharva, Pishachas, Yaksha — are not reduced to generic hostile ghosts; their variant records note this explicitly. Health, protection and death motifs describe beliefs, not medical facts or instructions.

The full book was not accessed. A contents page proves that the book includes a name, not that an unrelated online definition matches that entry. Web source IDs therefore accompany claims separately from the seed book pointer. Two spelling/identity questions are flagged for future print verification: the Guyasi/Gayasi spelling discrepancy, and whether the book's Aayeri and Crooke's "Airi" denote the same local tradition (treated here as a provisional association only, on the strength of a shared hunting motif).

## Next work, in order

1. Move every entry from `initial_notes` toward `reviewed`: trace each populated claim back to regional collections, scholarly work or documented oral accounts, and replace weaker popular-retelling evidence where possible.
2. Record native scripts and pronunciation with regional speakers. Confirm aliases before merging — in particular, verify whether Aayeri/Airi is one tradition or two.
3. Expand regional `variants` beyond the current six entries; most of the 84 likely have more than one local telling.
4. Investigate protective motifs and adversaries independently — `nemesis` remains unknown for most entries, and `protections` for many.
5. Add dated attestations only from consulted sources. A story's setting is not its date of composition, and first surviving mention is not proof of origin.
6. Archive source revisions and document reuse permissions for any future media assets.
7. Review the four concept-art atlases (`images/atlases/`) cell by cell against the sourced claims; several invented colours, anatomies and props (for example Chordewa's cat, Hara's leafy silhouette) are explicitly unsupported by the cited accounts and are flagged as such in each entry's `extensions.visual_reference.review_note`.

## Bodies of research to explore later

The bibliography remains limited to Banerjee for this release. Future source acquisition can cover regional folkloristics, oral-history archives, ethnography of ritual and possession, vernacular literary history, comparative motif studies, religious art/iconography, and gender/caste readings of supernatural narratives. These are research directions, not claims that particular books or archives have already been examined.

## Design data policy

Mechanics should be a separate interpretive layer. A source's "night caller" motif can inspire an audio encounter, but hearing range, cooldown, damage, hostility and player counters are game-design decisions. `game_design_notes` (`basis: "creative_interpretation"`) is the only place that layer belongs. The concept-art atlases are the same kind of layer: `extensions.visual_reference` on each entry states plainly that palette, costume, anatomy and props are design choices, not evidence, and lists what a given cell adds beyond what the sources support.
