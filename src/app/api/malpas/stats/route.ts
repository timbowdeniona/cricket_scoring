import { NextResponse } from 'next/server';
import { MALPAS_PLAYER_STATS } from '@/services/malpasData';
import { MalpasTeamId } from '@/types/malpas';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const team = (searchParams.get('team') as MalpasTeamId) || '1st_xi';

  const filtered = MALPAS_PLAYER_STATS.filter(s => s.teamId === team);
  return NextResponse.json({ stats: filtered });
}
