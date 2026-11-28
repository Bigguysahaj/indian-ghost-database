#!/usr/bin/env python3
"""Split the Aacheri cut-out into hair, body and head layers for the /v2/ mockup. Dev-only (Pillow, numpy, scipy).

    python scripts/layer_aacheri.py site/v2/cutouts/aacheri.webp site/v2/layers
"""
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

# shortcut: outlines traced by hand on this one image (339x319); use a segmentation tool if more ghosts get layers.
BODY = [(108, 112), (97, 119), (88, 140), (78, 165), (66, 188), (68, 196), (76, 200), (75, 215), (80, 224), (87, 228),
        (87, 250), (82, 252), (82, 268), (92, 272), (99, 274), (98, 284), (94, 289), (78, 292), (78, 302), (90, 305),
        (112, 303), (113, 307), (136, 307), (146, 298), (144, 286), (141, 278), (158, 273), (157, 262), (151, 258),
        (150, 226), (160, 218), (163, 205), (161, 196), (171, 192), (168, 180), (162, 164), (155, 150), (149, 130),
        (140, 118), (128, 112)]
HEAD = [(52, 10), (166, 10), (166, 50), (153, 76), (156, 90), (146, 102), (134, 112), (127, 123), (111, 123),
        (106, 114), (88, 118), (72, 112), (58, 98), (52, 60)]
FACE = [(84, 72), (96, 60), (108, 40), (116, 52), (134, 64), (139, 78), (137, 96), (124, 108), (108, 110), (92, 100), (85, 90)]
GROUND_Y, GROUND_RIGHT = 284, 200  # the sand under the feet stays with the body
UNDERLAP = 22                      # px of hidden hair painted behind the body so movement opens no gaps

src, out = sys.argv[1], sys.argv[2]
rgba = np.asarray(Image.open(src).convert('RGBA')).copy()
h, w = rgba.shape[:2]


def polygon(points):
    mask = Image.new('1', (w, h))
    ImageDraw.Draw(mask).polygon(points, fill=1)
    return np.array(mask)


body, head, face = polygon(BODY), polygon(HEAD), polygon(FACE)
# below the neck, the body keeps its whole outline so no part of the dress edge travels with the hair
body |= ndimage.binary_dilation(body, iterations=3) & (np.arange(h)[:, None] > 128)
yy, xx = np.mgrid[0:h, 0:w]
solid = rgba[..., 3] > 0
ground = solid & (yy >= GROUND_Y) & (xx < GROUND_RIGHT) & ~((rgba[..., 2] > rgba[..., 0] + 25) & (xx > 160))

# cream trapped inside the hair loops is background the edge fill could not reach
r, g, b = (rgba[..., i].astype(int) for i in range(3))
cream = (r > 222) & (g > 214) & (b > 196) & (r - b < 40) & (r >= b)
rgba[cream & ~body & ~face & ~ground, 3] = 0
solid = rgba[..., 3] > 0

stray = ((yy >= 270) & (xx < 150)) | ((yy >= 170) & (xx < 100)) | ((yy >= 282) & (yy >= GROUND_Y) & (xx < 190))  # outline and sand crumbs
body_mask = solid & (body | ground | stray)
hair = solid & ~body_mask & ~face

# paint the nearest dark hair colour behind the body and the face
peak = rgba[..., :3].max(axis=2)
dark = hair & (rgba[..., 3] == 255) & ((peak < 50) | ((b > g + 15) & (peak < 140)))  # black or purple, never dress red
dist, (ny, nx) = ndimage.distance_transform_edt(~dark, return_indices=True)
reach = np.where(xx < 118, 175, 262)  # no hair hangs below these rows on each side
hidden = solid & ((body & (dist <= UNDERLAP) & (yy < reach)) | face)
hair_rgba = np.zeros_like(rgba)
hair_rgba[hair] = rgba[hair]
hair_rgba[hidden] = rgba[ny[hidden], nx[hidden]]


def save(name, pixels):
    Image.fromarray(pixels, 'RGBA').save(f'{out}/aacheri-{name}.webp', 'WEBP', lossless=True)


def only(mask):
    pixels = np.zeros_like(rgba)
    pixels[mask] = rgba[mask]
    return pixels


save('hair', hair_rgba)
save('body', only(body_mask))
save('head', only(solid & head & (~body | (yy < 124) & (xx > 104) & (xx < 132))))
save('still', rgba)
print('wrote hair, body, head, still')
