import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url, 'http://localhost');
    const siteId = url.searchParams.get('site_id');
    const apiToken = url.searchParams.get('api_token');

    if (!siteId || !apiToken) {
      return NextResponse.json({ error: 'Missing site_id or api_token' }, { status: 400 });
    }

    const pcUrl = `http://play-cricket.com/api/v2/matches.json?site_id=${siteId}&api_token=${apiToken}`;
    const res = await fetch(pcUrl, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Play-Cricket API returned an error' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error proxying request' }, { status: 500 });
  }
}

