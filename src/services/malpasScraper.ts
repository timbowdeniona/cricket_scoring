import crypto from 'crypto';
import { MalpasFixture, MalpasPlayerStats, MalpasTeamId } from '@/types/malpas';
import { MALPAS_FIXTURES, MALPAS_PLAYER_STATS } from './malpasData';

const TEAM_PLAY_CRICKET_IDS: Record<MalpasTeamId, string> = {
  '1st_xi': '39623',
  '2nd_xi': '355847',
  'sunday_xi': '307154',
};

function sha1(str: string): string {
  return crypto.createHash('sha1').update(str, 'utf8').digest('hex');
}

function solveChallenge(x: number, y: string): number | null {
  for (let i = 0; i <= 99; i++) {
    if (sha1((x + i).toString()) === y) return i;
  }
  return null;
}

export async function scrapeLivePlayCricketFixtures(teamId: MalpasTeamId = '2nd_xi'): Promise<MalpasFixture[]> {
  try {
    const pcTeamId = TEAM_PLAY_CRICKET_IDS[teamId] || '355847';
    const baseUrl = 'https://malpas.play-cricket.com';
    const targetUrl = `${baseUrl}/Matches?team_id=${pcTeamId}`;

    const res1 = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 300 }, // Cache 5 min
    });

    const rawCookies1 = res1.headers.getSetCookie ? res1.headers.getSetCookie() : [res1.headers.get('set-cookie')];
    const validCookies1 = rawCookies1.filter((c): c is string => typeof c === 'string' && c.length > 0);
    let cookies = validCookies1.map(c => c.split(';')[0]).join('; ');

    const html1 = await res1.text();
    const xMatch = html1.match(/var x\s*=\s*(\d+);/);
    const yMatch = html1.match(/var y\s*=\s*["']([^"']+)["'];/);
    const hintMatch = html1.match(/name="hint"\s+value="([^"]+)"/);

    let html = html1;

    if (xMatch && yMatch && hintMatch) {
      const x = parseInt(xMatch[1], 10);
      const y = yMatch[1];
      const hint = hintMatch[1];
      const answer = solveChallenge(x, y);

      const solvedUrl = `${baseUrl}/Teams?hint=${encodeURIComponent(hint)}&answer=${answer}`;

      const res2 = await fetch(solvedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          ...(cookies ? { Cookie: cookies } : {}),
        },
      });

      const rawCookies2 = res2.headers.getSetCookie ? res2.headers.getSetCookie() : [res2.headers.get('set-cookie')];
      const validCookies2 = rawCookies2.filter((c): c is string => typeof c === 'string' && c.length > 0);
      if (validCookies2.length > 0) {
        cookies = validCookies2.map(c => c.split(';')[0]).join('; ');
      }

      const res3 = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Cookie: cookies,
        },
      });

      html = await res3.text();
    }

    // Parse matches from HTML
    const matches = [...html.matchAll(/<p class='time[^']*'>([^<]*)<\/p>[\s\S]*?<p class='txt1'>([\s\S]*?)<\/p>[\s\S]*?<p class='txt1'>([\s\S]*?)<\/p>/gi)];

    if (matches.length === 0) {
      return MALPAS_FIXTURES.filter(f => f.teamId === teamId);
    }

    const scrapedFixtures: MalpasFixture[] = matches.map((m, idx) => {
      const time = m[1].trim() || '13:00';
      const team1 = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      const team2 = m[3].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

      const isMalpasTeam1 = team1.includes('Malpas');
      const opponent = isMalpasTeam1 ? team2 : team1;
      const venue = isMalpasTeam1 ? 'Home' : 'Away';

      return {
        id: `pc_live_${teamId}_${idx + 1}`,
        teamId,
        opponent,
        date: new Date().toISOString().split('T')[0],
        time,
        venue,
        ground: venue === 'Home' ? 'The Recreation Ground, Wrexham Road, Malpas' : opponent,
        competition: teamId === '2nd_xi' ? 'Cheshire League Reserve Div 4' : 'Cheshire Cricket League',
        status: 'upcoming',
      };
    });

    return scrapedFixtures;
  } catch (e) {
    console.warn(`Play-Cricket scraper fallback for team ${teamId}`, e);
    return MALPAS_FIXTURES.filter(f => f.teamId === teamId);
  }
}

export class MalpasScraperClient {
  async getFixtures(teamId: MalpasTeamId = '2nd_xi'): Promise<MalpasFixture[]> {
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

  async getPlayerStats(teamId: MalpasTeamId = '2nd_xi'): Promise<MalpasPlayerStats[]> {
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
