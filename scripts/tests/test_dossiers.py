"""Issues 02-06: the first five research-ready ghosts each have a valid dossier."""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts'))
import catalogue  # noqa: E402


def assert_dossier(ghost_id):
    path = ROOT / 'research/ghosts' / f'{ghost_id}.md'
    assert path.exists(), f'missing {path.relative_to(ROOT)}'
    ids = {g['id'] for g in catalogue.read('data/ghosts.json')['ghosts']}
    sources = {s['id'] for s in catalogue.read('research/evidence.json')['sources'] + catalogue.read('data/references.json')['references']}
    catalogue.validate_dossier(path, ids, sources)


class Dossiers(unittest.TestCase):
    def test_aacheri(self):
        assert_dossier('aacheri')

    def test_nishidaak(self):
        assert_dossier('nishidaak')

    def test_chudail(self):
        assert_dossier('chudail')

    def test_shankhchunni(self):
        assert_dossier('shankhchunni')

    def test_kutti_chaathan(self):
        assert_dossier('kutti-chaathan')


if __name__ == '__main__':
    unittest.main()
