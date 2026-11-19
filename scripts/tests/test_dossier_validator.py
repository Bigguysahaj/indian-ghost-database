"""Issue 01: catalogue.validate_dossier checks a research/ghosts/<id>.md dossier."""
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import catalogue  # noqa: E402

GOOD = """# Aacheri

## Sources
- `wiki-acheri`

## Region
Kumaon.

## Behaviours
Descends at dusk.

## Abilities
Shadow brings illness (creative_interpretation of `behavior`).

## Weaknesses
Scarlet thread.

## Triggers
Dusk.
"""
IDS, SOURCES = {'aacheri'}, {'wiki-acheri'}


def check(text, name='aacheri.md'):
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / name
        path.write_text(text, encoding='utf-8')
        catalogue.validate_dossier(path, IDS, SOURCES)


class DossierValidator(unittest.TestCase):
    def test_accepts_complete_dossier(self):
        check(GOOD)

    def test_rejects_missing_section(self):
        for heading in catalogue.DOSSIER_SECTIONS:
            with self.subTest(heading=heading), self.assertRaises(ValueError):
                check(GOOD.replace(f'## {heading}\n', ''))

    def test_rejects_empty_section(self):
        with self.assertRaises(ValueError):
            check(GOOD.replace('Dusk.\n', ''))

    def test_rejects_unknown_ghost_id(self):
        with self.assertRaises(ValueError):
            check(GOOD, name='not-a-ghost.md')

    def test_rejects_sources_without_known_id(self):
        with self.assertRaises(ValueError):
            check(GOOD.replace('`wiki-acheri`', '`made-up`'))


if __name__ == '__main__':
    unittest.main()
