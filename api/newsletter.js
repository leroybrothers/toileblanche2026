const FLODESK_API = 'https://api.flodesk.com/v1/subscribers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName, lastName } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const apiKey = process.env.FLODESK_API_KEY;
  if (!apiKey) {
    console.error('FLODESK_API_KEY is not set');
    return res.status(500).json({ error: 'Newsletter service is not configured' });
  }

  const payload = {
    email: email.trim().toLowerCase(),
  };
  if (firstName) payload.first_name = String(firstName).trim();
  if (lastName) payload.last_name = String(lastName).trim();

  const segmentId = process.env.FLODESK_SEGMENT_ID;
  if (segmentId) payload.segment_ids = [segmentId];

  try {
    const response = await fetch(FLODESK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Flodesk API error ${response.status}: ${text}`);
      return res.status(502).json({ error: 'Subscription failed. Please try again.' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Flodesk request failed:', err);
    return res.status(502).json({ error: 'Subscription failed. Please try again.' });
  }
}
