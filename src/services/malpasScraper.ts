import { MalpasFixture, MalpasPlayerStats, MalpasTeamId } from '@/types/malpas';
import { MALPAS_FIXTURES, MALPAS_PLAYER_STATS } from './malpasData';

const TEAM_PLAY_CRICKET_IDS: Record<MalpasTeamId, string> = {
  '1st_xi': '39623',
  '2nd_xi': '355847',
  'sunday_xi': '307154',
};

function sha1(str: string): string {
  const buffer = new TextEncoder().encode(str);
  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const len = buffer.length;
  const bitLen = len * 8;

  const padLen = (len % 64 < 56) ? 56 - (len % 64) : 120 - (len % 64);
  const padded = new Uint8Array(len + padLen + 8);
  padded.set(buffer);
  padded[len] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 4, bitLen, false);

  for (let offset = 0; offset < padded.length; offset += 64) {
    const w = new Uint32Array(80);
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 80; i++) {
      const val = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
      w[i] = (val << 1) | (val >>> 31);
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let i = 0; i < 80; i++) {
      let f: number;
      let k: number;
      if (i < 20) {
        f = (b & c) | ((~b) & d);
        k = 0x5a827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      const temp = (((a << 5) | (a >>> 27)) + f + e + k + w[i]) >>> 0;
      e = d;
      d = c;
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = temp;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }

  const hex = (n: number) => n.toString(16).padStart(8, '0');
  return hex(h0) + hex(h1) + hex(h2) + hex(h3) + hex(h4);
}

function solveChallenge(x: number, y: string): number | null {
  for (let i = 0; i <= 99; i++) {
    if (sha1((x + i).toString()) === y) return i;
  }
  return null;
}

export async function scrapeLivePlayCricketFixtures(teamId?: MalpasTeamId): Promise<MalpasFixture[]> {
  const baseFixtures = teamId 
    ? MALPAS_FIXTURES.filter(f => f.teamId === teamId)
    : MALPAS_FIXTURES;

  try {
    const targetTeamId = teamId || '2nd_xi';
    const pcTeamId = TEAM_PLAY_CRICKET_IDS[targetTeamId] || '355847';
    const baseUrl = 'https://malpas.play-cricket.com';
    const targetUrl = `${baseUrl}/Teams/${pcTeamId}`;

    const res1 = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 300 }, // Cache 5 min
    });

    if (!res1.ok) {
      return baseFixtures;
    }

    const html = await res1.text();

    // Parse matches from HTML card elements
    const matchBlocks = [...html.matchAll(/href=["']\/match_details\?id=(\d+)["'][\s\S]*?<p class='time[^']*'>([^<]*)<\/p>[\s\S]*?<p class='txt1'>([\s\S]*?)<\/p>[\s\S]*?<p class='txt1'>([\s\S]*?)<\/p>/gi)];

    if (matchBlocks.length === 0) {
      return baseFixtures;
    }

    const liveScraped: MalpasFixture[] = matchBlocks.map((m, idx) => {
      const matchId = m[1];
      const time = (m[2] && m[2].trim()) || '13:00';
      const team1 = m[3] ? m[3].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : 'Malpas CC';
      const team2 = m[4] ? m[4].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : 'Opponent';

      const isMalpasTeam1 = team1.includes('Malpas');
      const opponent = isMalpasTeam1 ? team2 : team1;
      const venue: 'Home' | 'Away' = isMalpasTeam1 ? 'Home' : 'Away';

      return {
        id: `pc_live_${matchId}_${idx}`,
        teamId: targetTeamId,
        opponent,
        date: '2026-08-08',
        time,
        venue,
        ground: venue === 'Home' ? 'The Recreation Ground, Wrexham Road, Malpas' : opponent,
        competition: targetTeamId === '2nd_xi' ? 'Cheshire League Reserve Div 4' : 'Cheshire Cricket League Div 4',
        status: 'upcoming',
      };
    });

    // Merge scraped live fixtures into baseFixtures avoiding duplicates
    const combined = [...liveScraped];
    for (const bf of baseFixtures) {
      if (!combined.some(c => c.opponent.toLowerCase().includes(bf.opponent.toLowerCase().split(' ')[0]) && c.date === bf.date)) {
        combined.push(bf);
      }
    }

    return combined.sort((a, b) => b.date.localeCompare(a.date));
  } catch (e) {
    console.warn(`Play-Cricket scraper fallback for team ${teamId}`, e);
    return baseFixtures;
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
