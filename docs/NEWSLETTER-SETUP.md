# Newsletter signup — interim storage (until FamiliarHQ migration)

Signups are stored in **Vercel Blob** (`newsletter/signups.json`) instead of Flodesk.

## Setup

1. **Create a Blob store** in your Vercel project:
   - Vercel Dashboard → Project → Storage → Create Database → Blob
   - Name it (e.g. "Newsletter") and create
   - `BLOB_READ_WRITE_TOKEN` is added automatically

2. **Install dependencies** (if needed):
   ```bash
   npm install
   ```

3. **For export** (when migrating to FamiliarHQ): add env var in Vercel:
   - `NEWSLETTER_EXPORT_KEY` = a secret string you choose

## Export signups

```bash
curl "https://yoursite.com/api/newsletter-export?key=YOUR_NEWSLETTER_EXPORT_KEY"
```

Returns JSON: `[{ "email", "firstName", "lastName", "subscribedAt" }, ...]`

Import this into FamiliarHQ when ready.
