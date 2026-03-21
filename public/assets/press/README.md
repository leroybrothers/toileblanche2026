# Press Clippings Archive

**PDFs** go in this folder. **Thumbnails** go in the `thumbnails/` subfolder.

## Structure

```
public/assets/press/
├── 2025-04-22_PublicationName_Country_Type.pdf
├── 2025-04-22_PublicationName_Country_Type.png
└── thumbnails/
    └── 2025-04-22_PublicationName_Country_Type.jpg
```

- **PDFs/PNGs** → root of `press/`
- **Thumbnails** → `press/thumbnails/` (same base filename + `.jpg`)

## Naming convention

`YYYY-MM-DD_PublicationName_Country_PrintOrOnline.pdf`

Examples:
- `2025-07-04_LeFigaroMagazine_France_Print.pdf`
- `2024-UNKNOWN_ADMagazine_France_Print.pdf` (use UNKNOWN when date unknown)

Thumbnail must match: `thumbnails/2025-07-04_LeFigaroMagazine_France_Print.jpg`

## Regenerating the data

After adding new PDFs and thumbnails, run:

```bash
node scripts/generate-press-clippings.mjs
```

This updates `src/data/press.json` and `src/data/press.fr.json` with all clippings that have matching thumbnails.
