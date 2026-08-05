import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('site_id');
  const apiToken = searchParams.get('api_token');
  const teamId = searchParams.get('team_id');

  if (!siteId || !apiToken) {
    return NextResponse.json({ error: 'Missing site_id or api_token' }, { status: 400 });
  }

  try {
    const pcUrl = `http://play-cricket.com/api/v2/result_summary.json?site_id=${siteId}&api_token=${apiToken}${teamId ? `&team_id=${teamId}` : ''}`;
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
