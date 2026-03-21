/**
 * Newsletter signup — interim storage on Vercel Blob until migration to FamiliarHQ.
 * Saves email, firstName, lastName to newsletter/signups.json in Blob storage.
 * Export via GET /api/newsletter-export?key=YOUR_SECRET
 */
import { list, get, put } from '@vercel/blob';

const BLOB_PATH = 'newsletter/signups.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName, lastName } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const entry = {
    email: email.trim().toLowerCase(),
    firstName: firstName ? String(firstName).trim() : '',
    lastName: lastName ? String(lastName).trim() : '',
    subscribedAt: new Date().toISOString(),
  };

  try {
    let signups = [];

    const { blobs } = await list({ prefix: 'newsletter/' });
    const existing = blobs.find((b) => b.pathname === BLOB_PATH);
    if (existing) {
      const blob = await get(existing.url, { access: 'private' });
      if (blob) {
        const text = await blob.text();
        try {
          signups = JSON.parse(text || '[]');
        } catch {
          signups = [];
        }
      }
    }

    const exists = signups.some((s) => s.email === entry.email);
    if (!exists) {
      signups.push(entry);
    }

    await put(BLOB_PATH, JSON.stringify(signups, null, 2), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Newsletter storage failed:', err);
    return res.status(500).json({ error: 'Subscription failed. Please try again.' });
  }
}
