"""Issue 09: AGENTS.md tells crawling agents how to navigate the repo for game design."""
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HEADING = '## Navigating for game design'


class AgentsGuide(unittest.TestCase):
    def test_section_exists_and_names_entry_points(self):
        text = (ROOT / 'AGENTS.md').read_text(encoding='utf-8')
        self.assertIn(HEADING, text)
        section = text.split(HEADING, 1)[1].split('\n## ', 1)[0]
        for needle in ['data/index.json', 'research/ghosts/', 'data/ghosts.json', 'research/evidence.json',
                       'creative_interpretation', 'python3 scripts/catalogue.py --check']:
            with self.subTest(needle=needle):
                self.assertIn(needle, section)
        self.assertLessEqual(len(section.strip().splitlines()), 30, 'keep the section short')


if __name__ == '__main__':
    unittest.main()
