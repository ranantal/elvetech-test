const THIRD_PARTY_BASE_URL = 'https://service.test.elvetech.io';

// Mirrors what the Vite dev-server proxy does locally (see
// apps/*/vite.config.mts): forward to the real service and inject the API
// token server-side, so it never reaches the client. This becomes
// /api/search once deployed, matching what SearchService.ts already calls —
// no client-side changes needed between dev and production.
export default async function handler(request: Request): Promise<Response> {
  const apiToken = process.env.API_TOKEN;

  console.log('API_TOKEN exists:', Boolean(process.env.API_TOKEN));

  if (!apiToken) {
    return new Response(
      JSON.stringify({ error: 'API_TOKEN is not configured' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';

  const response = await fetch(
    `${THIRD_PARTY_BASE_URL}/search?q=${encodeURIComponent(query)}`,
    { headers: { 'x-api-token': apiToken } },
  );

  console.log('Third-party status:', response.status);

  return new Response(response.body, {
    status: response.status,
    headers: { 'content-type': 'application/json' },
  });
}
