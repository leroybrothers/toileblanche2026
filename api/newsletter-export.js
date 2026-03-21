/**
 * Export newsletter signups for migration to FamiliarHQ.
 * GET /api/newsletter-export?key=YOUR_NEWSLETTER_EXPORT_KEY
 * Returns JSON array. Add NEWSLETTER_EXPORT_KEY to Vercel env.
 */
import { list, get } from '@vercel/blob';

const BLOB_PATH = 'newsletter/signups.json';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = req.query.key || '';
  const expectedKey = process.env.NEWSLETTER_EXPORT_KEY;
  if (!expectedKey || key !== expectedKey) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const { blobs } = await list({ prefix: 'newsletter/' });
    const existing = blobs.find((b) => b.pathname === BLOB_PATH);
    if (!existing) {
      return res.status(200).json([]);
    }

    const blob = await get(existing.url, { access: 'private' });
    if (!blob) {
      return res.status(200).json([]);
    }

    const text = await blob.text();
    const signups = JSON.parse(text || '[]');

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(signups, null, 2));
  } catch (err) {
    console.error('Newsletter export failed:', err);
    return res.status(500).json({ error: 'Export failed' });
  }
}
