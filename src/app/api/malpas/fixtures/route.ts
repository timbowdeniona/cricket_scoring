import { NextResponse } from 'next/server';
import { scrapeLivePlayCricketFixtures } from '@/services/malpasScraper';
import { MalpasTeamId } from '@/types/malpas';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const team = (searchParams.get('team') as MalpasTeamId) || '2nd_xi';

  const fixtures = await scrapeLivePlayCricketFixtures(team);
  return NextResponse.json({ fixtures });
}
