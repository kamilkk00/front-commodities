// src/app/api/healthcheck/route.js

export async function GET(request) {
    const { searchParams } = new URL(request.url);
  
    // you can still override via ?url=…
    const target =
      searchParams.get('url') ||
      process.env.HEALTHCHECK_URL;    // ← now comes from env
  
    if (!target) {
      return new Response(
        JSON.stringify({ error: 'No HEALTHCHECK_URL configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  
    let res;
    try {
      res = await fetch(target);
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: 'Fetch failed',
          details: err.message,
          attempted: target,
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }
  
    const contentType = res.headers.get('content-type') ?? 'text/plain';
    const body = await res.arrayBuffer();
  
    return new Response(body, {
      status: res.status,
      headers: { 'Content-Type': contentType },
    });
  }