#!/usr/bin/env python3
"""Re-cut every per-ghost portrait from the atlas sheets in images/atlases/.

The atlas cells are not evenly spaced, so dividing a sheet into a uniform grid
drifts row by row and slices off the bottom labels on later rows. This script
finds the real divider lines on each sheet, takes the ghost's cell
(extensions.visual_reference.row/column in data/ghosts.json), trims it to the
artwork plus its label, and writes a square crop to visual_reference.crop.

Requires Pillow and numpy (dev-only; not needed by the site or CI):
    pip install pillow numpy

Usage, from the repo root:
    python scripts/crop_portraits.py                  # re-cut all portraits
    python scripts/crop_portraits.py --ids hara jinn  # just these
    python scripts/crop_portraits.py --preview out.png  # also write a contact sheet

Then run `python scripts/sync_site.py` to copy the crops into site/public/.
"""
import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
GHOSTS = ROOT / 'data' / 'ghosts.json'

LINE_MIN, LINE_MAX = 6, 60   # a divider is this much darker than the background
LINE_COVERAGE = 0.5          # ...across at least this fraction of the sheet
INSET = 5                    # px kept clear of a divider line on each side
INK = 28                     # a pixel this much darker than the background is artwork
PAD = 8                      # px of background kept around the artwork


def line_centres(mask_profile, lo, hi):
    """Centres of runs where the profile marks a divider, within (lo, hi)."""
    centres, run = [], []
    for i in np.where(mask_profile > LINE_COVERAGE)[0]:
        if run and i - run[-1] > 2:
            centres.append((run[0] + run[-1]) / 2)
            run = []
        run.append(i)
    if run:
        centres.append((run[0] + run[-1]) / 2)
    return [c for c in centres if lo < c < hi]


def boundaries(internal, size, count, outer, inked):
    """count+1 cell edges along one axis: the internal dividers plus two outer edges.

    Outer edges use a full-length border line when the sheet has one. Otherwise
    they start one median cell-width beyond the outermost internal divider and
    are pushed outward to the first blank line, so a label that hangs past the
    estimate is kept whole while the sheet's header and footer stay outside.
    `inked[i]` says whether row/column i has any artwork on it.
    """
    if len(internal) != count - 1:
        raise ValueError(f'expected {count - 1} internal dividers, found {len(internal)}: {internal}')
    step = float(np.median(np.diff(internal))) if len(internal) > 1 else min(internal[0], size - internal[0])
    first = [c for c in outer if c < internal[0] and internal[0] - c < step * 1.15]
    last = [c for c in outer if c > internal[-1] and c - internal[-1] < step * 1.15]
    if first:
        start = max(first)
    else:
        start = int(max(0, internal[0] - step))
        while start > 0 and inked[start]:
            start -= 1
        start -= INSET  # cancels the inset, which only matters next to a drawn line
    if last:
        end = min(last)
    else:
        end = int(min(size - 1, internal[-1] + step))
        while end < size - 1 and inked[end]:
            end += 1
        end += INSET
    return [start, *internal, end]


def grid(sheet):
    gray = np.asarray(sheet.convert('L')).astype(int)
    bg = float(np.median(gray))
    line = (gray < bg - LINE_MIN) & (gray > bg - LINE_MAX)
    h, w = gray.shape
    row_lines = line_centres(line.mean(axis=1), 0, h)
    col_lines = line_centres(line.mean(axis=0), 0, w)
    inner_rows = [r for r in row_lines if 0.1 * h < r < 0.9 * h]
    inner_cols = [c for c in col_lines if 0.1 * w < c < 0.9 * w]
    ink = gray < bg - INK
    return (
        boundaries(inner_rows, h, len(inner_rows) + 1, row_lines, ink.mean(axis=1) > 0.002),
        boundaries(inner_cols, w, len(inner_cols) + 1, col_lines, ink.mean(axis=0) > 0.002),
        bg,
    )


def square_crop(sheet, box, bg):
    """Trim the cell to its artwork (plus PAD), then grow it to a square inside the cell."""
    left, top, right, bottom = (int(round(v)) for v in box)
    cell = np.asarray(sheet.convert('L').crop((left, top, right, bottom))).astype(int)
    ys, xs = np.where(cell < bg - INK)
    if not len(xs):
        raise ValueError(f'no artwork found in cell {box}')
    x0, x1 = max(0, xs.min() - PAD), min(cell.shape[1], xs.max() + 1 + PAD)
    y0, y1 = max(0, ys.min() - PAD), min(cell.shape[0], ys.max() + 1 + PAD)
    side = min(max(x1 - x0, y1 - y0), cell.shape[0], cell.shape[1])

    def fit(a0, a1, limit):
        centre = (a0 + a1) / 2
        start = int(round(centre - side / 2))
        return min(max(0, start), limit - side)

    sx, sy = fit(x0, x1, cell.shape[1]), fit(y0, y1, cell.shape[0])
    if y1 - y0 > side or x1 - x0 > side:
        print(f'  warning: artwork {x1 - x0}x{y1 - y0} does not fit a {side}px square in its cell; edges may be trimmed')
    return sheet.crop((left + sx, top + sy, left + sx + side, top + sy + side))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ids', nargs='*', help='only re-cut these ghost ids')
    ap.add_argument('--preview', help='also write a contact sheet of every crop to this PNG')
    args = ap.parse_args()

    ghosts = json.loads(GHOSTS.read_text())['ghosts']
    ghosts.sort(key=lambda g: (g.get('seed_reference') or {}).get('entry_number', 999))
    if args.ids:
        ghosts = [g for g in ghosts if g['id'] in args.ids]

    by_sheet = {}
    for g in ghosts:
        vr = (g.get('extensions') or {}).get('visual_reference') or {}
        if vr.get('sheet') and vr.get('crop'):
            by_sheet.setdefault(vr['sheet'], []).append((g, vr))

    crops = []
    for sheet_path, entries in sorted(by_sheet.items()):
        sheet = Image.open(ROOT / sheet_path).convert('RGB')
        row_edges, col_edges, bg = grid(sheet)
        print(f'{sheet_path}: rows {[round(v) for v in row_edges]} cols {[round(v) for v in col_edges]}')
        for g, vr in entries:
            r, c = vr['row'] - 1, vr['column'] - 1
            if r + 1 >= len(row_edges) or c + 1 >= len(col_edges):
                raise ValueError(f'{g["id"]}: cell row {r + 1}, column {c + 1} is outside the detected grid')
            box = (col_edges[c] + INSET, row_edges[r] + INSET, col_edges[c + 1] - INSET, row_edges[r + 1] - INSET)
            img = square_crop(sheet, box, bg)
            out = ROOT / vr['crop']
            img.save(out, 'WEBP', quality=90, method=6)
            crops.append((g, img))
            print(f'  {g["id"]}: {img.width}x{img.height} -> {vr["crop"]}')

    if args.preview and crops:
        tile, per_row = 160, 10
        rows = -(-len(crops) // per_row)
        sheet = Image.new('RGB', (tile * per_row, tile * rows), 'white')
        for i, (_, img) in enumerate(crops):
            sheet.paste(img.resize((tile, tile)), ((i % per_row) * tile, (i // per_row) * tile))
        sheet.save(args.preview)
        print(f'preview: {args.preview}')


if __name__ == '__main__':
    main()
