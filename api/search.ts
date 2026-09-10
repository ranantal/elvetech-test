import type { VercelRequest, VercelResponse } from '@vercel/node';

const THIRD_PARTY_BASE_URL = 'https://service.test.elvetech.io';

// Mirrors what the Vite dev-server proxy does locally (see
// apps/*/vite.config.mts): forward to the real service and inject the API
// token server-side, so it never reaches the client. This becomes
// /api/search once deployed, matching what SearchService.ts already calls —
// no client-side changes needed between dev and production.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiToken = process.env.API_TOKEN;

  if (!apiToken) {
    res.status(500).json({ error: 'API_TOKEN is not configured' });
    return;
  }

  const query = typeof req.query['q'] === 'string' ? req.query['q'] : '';

  const response = await fetch(
    `${THIRD_PARTY_BASE_URL}/search?q=${encodeURIComponent(query)}`,
    { headers: { 'x-api-token': apiToken } },
  );

  const body = await response.json();

  res.status(response.status).json(body);
}
