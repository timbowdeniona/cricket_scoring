export interface PlayCricketConfig {
  siteId: string;
  apiToken: string;
  isDemoMode: boolean;
}

export interface PlayCricketMatchSummary {
  id: number;
  status: string;
  published: string;
  last_updated: string;
  league_name: string;
  match_date: string;
  match_time: string;
  ground_name: string;
  home_club_name: string;
  home_team_name: string;
  home_team_id: number;
  away_club_name: string;
  away_team_name: string;
  away_team_id: number;
}

export interface PlayCricketPlayer {
  member_id: number;
  name: string;
  first_name: string;
  last_name: string;
  captain?: boolean;
  wicket_keeper?: boolean;
}

export interface PlayCricketTeamRoster {
  team_id: number;
  team_name: string;
  players: PlayCricketPlayer[];
}
