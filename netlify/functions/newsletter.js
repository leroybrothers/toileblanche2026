const FLODESK_API = 'https://api.flodesk.com/v1/subscribers';

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {};
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const { email, firstName, lastName } = body;

  if (!email || typeof email !== 'string') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Email is required' }),
    };
  }

  const apiKey = process.env.FLODESK_API_KEY;
  if (!apiKey) {
    console.error('FLODESK_API_KEY is not set');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Newsletter service is not configured' }),
    };
  }

  const payload = {
    email: email.trim().toLowerCase(),
  };
  if (firstName) payload.first_name = firstName.trim();
  if (lastName) payload.last_name = lastName.trim();

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
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Subscription failed. Please try again.' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error('Flodesk request failed:', err);
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Subscription failed. Please try again.' }),
    };
  }
};
