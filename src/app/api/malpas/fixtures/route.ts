import { NextResponse } from 'next/server';
import { MALPAS_FIXTURES } from '@/services/malpasData';
import { MalpasTeamId } from '@/types/malpas';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const team = (searchParams.get('team') as MalpasTeamId) || '1st_xi';

  // Return pre-scraped / cached fixtures for Malpas CC
  const filtered = MALPAS_FIXTURES.filter(f => f.teamId === team);
  return NextResponse.json({ fixtures: filtered });
}
