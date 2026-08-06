export type MalpasTeamId = '1st_xi' | '2nd_xi' | 'sunday_xi';

export interface MalpasTeamInfo {
  id: MalpasTeamId;
  name: string;
  shortName: string;
  captain: string;
  league: string;
  division: string;
  description: string;
}

export interface MalpasFixture {
  id: string;
  teamId: MalpasTeamId;
  opponent: string;
  date: string;
  time: string;
  venue: string; // Home or Away
  ground: string;
  competition: string;
  status: 'upcoming' | 'completed' | 'abandoned';
  resultText?: string;
  malpasScore?: string;
  opponentScore?: string;
  matchReportUrl?: string;
}

export interface MalpasPlayerStats {
  id: string;
  name: string;
  teamId: MalpasTeamId;
  role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicket Keeper';
  matches: number;
  innings: number;
  runs: number;
  highScore: string;
  battingAverage: number;
  hundreds: number;
  fifties: number;
  oversBowled: number;
  wickets: number;
  bestBowling: string;
  bowlingAverage: number;
  economy: number;
  catches: number;
  stumpings: number;
}

export interface MalpasClubRecord {
  category: string;
  recordTitle: string;
  value: string;
  holder: string;
  year: string;
  opponent?: string;
}
