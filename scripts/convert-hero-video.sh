#!/bin/bash
# Convert hero .mov to .mp4 for universal browser support
# Requires ffmpeg: brew install ffmpeg  (or download from ffmpeg.org)

set -e
SRC="public/assets/videos/ToileBlancheHeroShort2.mov"
OUT="public/assets/videos/ToileBlancheHeroShort2.mp4"

if [ ! -f "$SRC" ]; then
  echo "Source video not found: $SRC"
  exit 1
fi

if ! command -v ffmpeg &> /dev/null; then
  echo "ffmpeg is required. Install with: brew install ffmpeg"
  echo "Or use an online converter: https://cloudconvert.com/mov-to-mp4"
  echo "Then save the output as: $OUT"
  exit 1
fi

echo "Converting $SRC -> $OUT"
ffmpeg -i "$SRC" -c:v libx264 -preset medium -crf 23 -movflags +faststart -an "$OUT" -y

echo "Done. Redeploy to see the new hero video."
