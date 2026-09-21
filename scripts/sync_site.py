"""Copy the canonical data/images into site/ so the site is a self-contained,
zero-build static deployable. Run this after editing data/ghosts.json or the
images. `data/ghosts.json` and `images/` remain the single source of truth;
this script only mirrors what the site needs."""
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main():
    data = json.loads((ROOT / 'data/ghosts.json').read_text(encoding='utf-8'))

    site_data = ROOT / 'site/data'
    site_data.mkdir(parents=True, exist_ok=True)
    (site_data / 'ghosts.json').write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8'
    )
    shutil.copyfile(ROOT / 'data/references.json', site_data / 'references.json')
    shutil.copyfile(ROOT / 'research/evidence.json', site_data / 'evidence.json')

    site_images = ROOT / 'site/images/ghosts'
    site_images.mkdir(parents=True, exist_ok=True)
    copied = 0
    for ghost in data['ghosts']:
        crop = ghost.get('extensions', {}).get('visual_reference', {}).get('crop')
        if not crop:
            continue
        src = ROOT / crop
        dst = ROOT / 'site' / crop
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dst)
        copied += 1
    print(f'Synced {len(data["ghosts"])} ghost records and {copied} portrait images into site/.')


if __name__ == '__main__':
    main()
