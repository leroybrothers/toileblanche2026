# Homepage Suite Cards — Source Images

**Important:** Put original, unprocessed photos in the `sources/` subfolder. The script reads from `sources/` first and never overwrites files there.

## Setup

1. Create `Homepage/sources/` if it doesn't exist.
2. Add your best originals with these exact names (.jpg, .jpeg, or .png):

| Suite | Filename |
|-------|----------|
| Pénard | `suite-penard.jpg` |
| Pétanque | `Suite pétanque.jpg` |
| Bronzette | `Suite bronzette.jpg` |
| **Cabanat** | `Suite cabanat.jpg` |
| **Suite de l'Artiste** | `suite de l'artiste.jpg` |
| **Mas de l'Artiste** | `mas-de-l-artiste.jpg` or `Mas de l'artist.jpeg` |
| Villa Pénéquet | `Villa pénéquet.jpg` |
| Bon Vivant | `Suite bon vivant.jpg` |

3. Run:
```bash
npm run optimize-homepage-cards
```

## Fallback

If no source is found in `sources/`, Cabanat, Suite de l'Artiste, and Mas de l'Artiste use their suite hero images as fallback (from `cabanat/hero.jpg`, etc.). Replace with better cropped card photos when you have them.
