import { NextResponse } from 'next/server';
import { scrapeLivePlayCricketFixtures } from '@/services/malpasScraper';
import { MALPAS_FIXTURES } from '@/services/malpasData';
import { MalpasTeamId } from '@/types/malpas';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url, 'http://localhost');
    const teamParam = url.searchParams.get('team');
    const team = (teamParam && teamParam !== 'all' ? teamParam as MalpasTeamId : undefined);

    const fixtures = await scrapeLivePlayCricketFixtures(team);
    return NextResponse.json({ fixtures });
  } catch (error) {
    console.warn('API error in /api/malpas/fixtures:', error);
    return NextResponse.json(
      { fixtures: MALPAS_FIXTURES },
      { status: 200 }
    );
  }
}

