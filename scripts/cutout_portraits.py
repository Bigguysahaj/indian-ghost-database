#!/usr/bin/env python3
"""Make transparent, label-free portraits for the /v2/ mockup. Dev-only (Pillow, numpy, scipy).

    python scripts/cutout_portraits.py . site/public/v2/cutouts [ids...]
"""
import sys, glob, os
import numpy as np
from PIL import Image
from scipy import ndimage
repo, out, ids = sys.argv[1], sys.argv[2], sys.argv[3:]
files = [f'{repo}/images/ghosts/{i}.webp' for i in ids] or sorted(glob.glob(f'{repo}/images/ghosts/*.webp'))
LO, HI = 12, 34  # colour distance from the background: <=LO is background, >=HI is solid
TALL = 0.94  # output height as a fraction of width


def label_top(ink):
    """Row of the blank gap between the artwork and the baked-in number+name label."""
    h = ink.shape[0]
    rows = ink.sum(axis=1)
    y = h - 1
    while y > 0 and rows[y] <= 1: y -= 1  # blank margin under the label
    while y > 0 and rows[y] > 1: y -= 1   # the label itself
    if y >= h * 0.8:
        return y + 1
    lo, hi = int(h * 0.82), int(h * 0.92)  # art touches the label: cut at the emptiest row
    return lo + int(rows[lo:hi].argmin())


for f in files:
    im = Image.open(f).convert('RGB')
    full = np.asarray(im).astype(float)
    half = full.shape[0] // 2
    bg = np.median(np.concatenate([full[0], full[:half, 0], full[:half, -1]]), axis=0)
    rgb = full[:label_top(np.abs(full - bg).max(axis=2) > HI)]
    h = rgb.shape[0]
    dist = np.abs(ndimage.gaussian_filter(rgb, (0.6, 0.6, 0)) - bg).max(axis=2)
    lab, _ = ndimage.label(dist < LO)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    outside = np.isin(lab, border[border > 0])
    # soften only a thin rim next to the removed area, so pale clothes inside the outline stay solid
    rim = ndimage.binary_dilation(outside, iterations=3) & ~outside
    alpha = np.ones(dist.shape)
    alpha[rim] = np.clip((dist[rim] - LO) / (HI - LO), 0, 1)
    alpha[outside] = 0
    a = alpha[..., None]
    colour = np.clip((rgb - bg * (1 - a)) / np.maximum(a, 0.05), 0, 255)  # remove cream fringe
    art = Image.fromarray(np.dstack([colour, alpha * 255]).astype(np.uint8), 'RGBA')
    art = art.crop((0, 0, art.width, art.getchannel('A').point(lambda v: v > 40 and 255).getbbox()[3]))
    # one frame size ratio for all, art resting on the bottom edge, so the row shares a baseline
    frame = Image.new('RGBA', (im.width, round(im.width * TALL)))
    art.thumbnail(frame.size, Image.LANCZOS)
    frame.paste(art, ((frame.width - art.width) // 2, frame.height - art.height))
    frame.save(f'{out}/{os.path.basename(f)}', 'WEBP', quality=92, method=6)
print(len(files), 'cut')
