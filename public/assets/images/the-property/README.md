# The Property — Image Guide

**Images live in:** `public/assets/images/theproperty/` (no hyphen)

Drop images into each subfolder with **any filenames**. The page reads them at build time and uses them in **alphabetical order**.

| Subfolder      | Count | Slots (in order)                                                        |
|----------------|-------|-------------------------------------------------------------------------|
| `theplace/`    | 2–4 | 1st=hero (page hero), rest=portraits                                   |
| `thehouses/`   | 3–5+ | 1–2=landscapes, 3rd=fullbleed, 4–5=extra row                           |
| `therooms/`    | 3–5 | 1–3=portraits, 4–5=landscapes (optional)                               |
| `thetable/`    | 3–4 | 1st=hero, rest=portraits                                               |
| `theart/`      | 3 | 2 landscapes, fullbleed                                                |
| `thegarden/`   | 2–4 | 1st=hero, 2–3=middle row (if 4 imgs), last=fullbleed                   |
| `theatmosphere/` | 10 | 1st=hero, 2–10=3×3 grid                                              |

**Order:** Files are sorted A–Z. First file = first slot, second = second, etc.

**Empty folders:** Placeholder images from other project folders are used.

**Check inventory:** `node scripts/check-property-images.mjs`

**Format:** JPG, PNG, WebP, or AVIF. For responsive srcsets, run the image optimization script so `-600w`, `-1200w` variants exist.
