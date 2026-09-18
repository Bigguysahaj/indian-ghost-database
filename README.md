# Indian Ghost Database

An open, growing research resource for developers making games rooted in Indian folklore.

**84 names indexed · 39 entries with initial sourced notes · 45 name-only research stubs · 0 fully reviewed entries.**

Start with the [Markdown catalogue](GHOSTS.md), load the [JSON database](data/ghosts.json), or [contribute a tradition you know](CONTRIBUTING.md).

## What this contains

The seed list transcribes all 84 entries from the supplied contents photographs of Riksundar Banerjee’s *The Book of Indian Ghosts*. Spelling, ordering and chapter start pages are preserved. The collection can grow beyond that seed list.

Each entry has space for description, habitat, location, nemesis, protective motifs, prey, appearance, age, notable facts, behaviour, origin stories, regional variants and source evidence. Apparent age, lifespan and earliest attestation are separate fields. `null` means unknown, not nonexistent.

This is an initial research release. The full chapters were not supplied or read. Web notes are provisional and do not claim to represent the book’s treatment of each being. Most nemeses and lifespans remain unknown. The contents list also includes deities, celestial beings and transregional figures; inclusion does not classify every entry as an evil ghost or claim an exclusively Indian origin.

## For game developers

- Filter and inspect the structured claims; follow the evidence before committing to a depiction.
- Preserve regional differences. An adaptation from one community should not become a universal rule for a whole spirit category.
- Add invented powers, statistics and mechanics only under `game_design_notes`, with `basis: "creative_interpretation"`.
- Keep the distinction between a story’s adversary (`nemesis`) and protective motifs (`protections`). Neither is automatically a combat weakness.
- Native spellings and pronunciation are welcome with language information and evidence. None have been guessed in this release.

```python
import json
from pathlib import Path

database = json.loads(Path('data/ghosts.json').read_text(encoding='utf-8'))
for ghost in database['ghosts']:
    habitat = ghost['claims']['habitat']
    if habitat['value'] and 'tree' in habitat['value'].lower():
        print(ghost['name'], habitat['value'], habitat['source_ids'])
```

## Structure

| Path | Purpose |
| --- | --- |
| `data/ghosts.json` | Canonical editable catalogue |
| `data/entry-template.json` | Blank entry for expansion |
| `data/references.json` | Book bibliography: Banerjee only in this release |
| `research/evidence.json` | Field-level web evidence and limitations |
| `schema/ghosts.schema.json` | JSON Schema, version 0.1.0 |
| `GHOSTS.md`, `ghosts/*.md` | Generated index and individual Markdown entries |
| `research/RESEARCH.md` | Method, gaps and next research work |
| `RELATED_PROJECTS.md` | Existing GitHub projects to inspect |

## Contribute

Anyone can propose an entry, correction, local spelling, oral-history account or source through an issue or pull request. Start with [CONTRIBUTING.md](CONTRIBUTING.md). We welcome incomplete records with honestly marked gaps.

Python 3.10 or newer is sufficient; no third-party packages are required:

```bash
python scripts/catalogue.py
python scripts/catalogue.py --check
```

The checker validates the schema keywords used here, stable IDs, evidence links, unknown-value semantics and generated Markdown consistency. Adding more JSON Schema keywords requires updating the checker or using a full Draft 2020-12 validator.

## Reference and reuse

The initial book reference is [Riksundar Banerjee, *The Book of Indian Ghosts*, Aleph Book Company, 2021](REFERENCES.md). This is an independent project, not an official adaptation or endorsed companion. No book chapters, scans, illustrations or third-party game assets are redistributed.

Research data and documentation: **CC BY-SA 4.0**. Utility code and schema: **MIT**. See [LICENSE.md](LICENSE.md) for scope and attribution. External sources retain their own rights. The project records cultural traditions; it does not assert that supernatural beings exist.
