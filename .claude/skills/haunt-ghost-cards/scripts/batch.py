#!/usr/bin/env python3
"""Print the next batch of ghost cards to animate, with everything needed to design them.

Usage (from the repo root):
    python .claude/skills/haunt-ghost-cards/scripts/batch.py            # next 5 not yet haunted
    python .claude/skills/haunt-ghost-cards/scripts/batch.py --count 3
    python .claude/skills/haunt-ghost-cards/scripts/batch.py --ids chanda chedipe
"""
import argparse
import json
import re
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
GHOSTS = ROOT / 'data' / 'ghosts.json'
HAUNTS = ROOT / 'site' / 'src' / 'lib' / 'haunts.js'
IMAGES = ROOT / 'site' / 'public' / 'images' / 'ghosts'


def webp_size(path):
    b = path.read_bytes()[:40]
    chunk = b[12:16]
    if chunk == b'VP8 ':
        w, h = struct.unpack('<HH', b[26:30])
        return w & 0x3FFF, h & 0x3FFF
    if chunk == b'VP8L':
        v = int.from_bytes(b[21:25], 'little')
        return (v & 0x3FFF) + 1, ((v >> 14) & 0x3FFF) + 1
    if chunk == b'VP8X':
        return int.from_bytes(b[24:27], 'little') + 1, int.from_bytes(b[27:30], 'little') + 1
    return None


def haunted_ids():
    text = HAUNTS.read_text()
    body = text[text.index('export const HAUNTS'):]
    return set(re.findall(r"^\s{2}'?([a-z0-9-]+)'?: \{", body, re.M))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--count', type=int, default=5)
    ap.add_argument('--ids', nargs='*')
    args = ap.parse_args()

    ghosts = json.loads(GHOSTS.read_text())['ghosts']
    ghosts.sort(key=lambda g: (g.get('seed_reference') or {}).get('entry_number', 999))
    done = haunted_ids()

    if args.ids:
        batch = [g for g in ghosts if g['id'] in args.ids]
    else:
        batch = [g for g in ghosts if g['id'] not in done and (g.get('extensions') or {}).get('visual_reference', {}).get('crop')][: args.count]

    print(f'Already haunted ({len(done)}): {", ".join(sorted(done))}\n')
    for g in batch:
        vr = (g.get('extensions') or {}).get('visual_reference') or {}
        crop = vr.get('crop')
        img = IMAGES / Path(crop).name if crop else None
        size = webp_size(img) if img and img.exists() else None
        num = (g.get('seed_reference') or {}).get('entry_number')
        print(f'===== #{num} {g["name"]}  (id: {g["id"]})')
        print(f'  portrait: {img}  size: {size}')
        filled = {k: c['value'] for k, c in g['claims'].items() if c.get('value')}
        if not filled:
            print('  claims: NONE. Name-only record, so keep the effect generic and the line non-factual.')
        for k, v in filled.items():
            print(f'  {k}: {v}')
        if vr.get('review_note'):
            print(f'  art review note: {vr["review_note"]}')
        print()


if __name__ == '__main__':
    main()
