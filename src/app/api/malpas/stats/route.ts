import { NextResponse } from 'next/server';
import { MALPAS_PLAYER_STATS } from '@/services/malpasData';
import { MalpasTeamId } from '@/types/malpas';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url, 'http://localhost');
    const team = (url.searchParams.get('team') as MalpasTeamId) || '1st_xi';

    const filtered = MALPAS_PLAYER_STATS.filter(s => s.teamId === team);
    return NextResponse.json({ stats: filtered });
  } catch (error) {
    console.warn('API error in /api/malpas/stats:', error);
    return NextResponse.json(
      { stats: MALPAS_PLAYER_STATS.filter(s => s.teamId === '1st_xi') },
      { status: 200 }
    );
  }
}

