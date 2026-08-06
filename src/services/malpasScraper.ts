import { MalpasFixture, MalpasPlayerStats, MalpasTeamId } from '@/types/malpas';
import { MALPAS_FIXTURES, MALPAS_PLAYER_STATS } from './malpasData';

export class MalpasScraperClient {
  private baseUrl = 'https://malpas.play-cricket.com';

  async getFixtures(teamId: MalpasTeamId = '1st_xi'): Promise<MalpasFixture[]> {
    try {
      const res = await fetch(`/api/malpas/fixtures?team=${teamId}`);
      if (!res.ok) throw new Error('HTML scraper request failed');
      const data = await res.json();
      return data.fixtures || MALPAS_FIXTURES.filter(f => f.teamId === teamId);
    } catch (e) {
      console.warn('Play-Cricket scraper fallback to local Malpas dataset', e);
      return MALPAS_FIXTURES.filter(f => f.teamId === teamId);
    }
  }

  async getPlayerStats(teamId: MalpasTeamId = '1st_xi'): Promise<MalpasPlayerStats[]> {
    try {
      const res = await fetch(`/api/malpas/stats?team=${teamId}`);
      if (!res.ok) throw new Error('Stats scraper failed');
      const data = await res.json();
      return data.stats || MALPAS_PLAYER_STATS.filter(s => s.teamId === teamId);
    } catch (e) {
      console.warn('Play-Cricket stats fallback to local dataset', e);
      return MALPAS_PLAYER_STATS.filter(s => s.teamId === teamId);
    }
  }
}
