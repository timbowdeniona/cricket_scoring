import { PlayCricketConfig, PlayCricketMatchSummary, PlayCricketTeamRoster, PlayCricketPlayer } from '@/types/playCricket';
import { Player, Team } from '@/types/cricket';

const MOCK_FIXTURES: PlayCricketMatchSummary[] = [
  {
    id: 5491022,
    status: 'Scheduled',
    published: 'Yes',
    last_updated: '2026-08-01',
    league_name: 'Home Counties Premier League Division 2',
    match_date: '2026-08-08',
    match_time: '12:30',
    ground_name: 'Brickhill Green',
    home_club_name: 'Great Brickhill CC',
    home_team_name: '1st XI',
    home_team_id: 101,
    away_club_name: 'Lower Slaughter CC',
    away_team_name: '1st XI',
    away_team_id: 202,
  },
  {
    id: 5491023,
    status: 'Scheduled',
    published: 'Yes',
    last_updated: '2026-08-01',
    league_name: 'Cherwell Cricket League',
    match_date: '2026-08-15',
    match_time: '13:00',
    ground_name: 'Slaughter Oval',
    home_club_name: 'Lower Slaughter CC',
    home_team_name: '1st XI',
    home_team_id: 202,
    away_club_name: 'Great Brickhill CC',
    away_team_name: '1st XI',
    away_team_id: 101,
  },
];

const MOCK_ROSTER: PlayCricketTeamRoster = {
  team_id: 101,
  team_name: 'Great Brickhill CC 1st XI',
  players: [
    { member_id: 1001, name: 'Arthur Pendelton', first_name: 'Arthur', last_name: 'Pendelton', captain: true },
    { member_id: 1002, name: 'Jack Miller', first_name: 'Jack', last_name: 'Miller' },
    { member_id: 1003, name: 'George Featherstone', first_name: 'George', last_name: 'Featherstone' },
    { member_id: 1004, name: 'Barnaby Finch', first_name: 'Barnaby', last_name: 'Finch', wicket_keeper: true },
    { member_id: 1005, name: 'Rupert Sterling', first_name: 'Rupert', last_name: 'Sterling' },
    { member_id: 1006, name: 'Charlie Higgins', first_name: 'Charlie', last_name: 'Higgins' },
    { member_id: 1007, name: 'Oliver Twist', first_name: 'Oliver', last_name: 'Twist' },
    { member_id: 1008, name: 'Teddy Thornton', first_name: 'Teddy', last_name: 'Thornton' },
    { member_id: 1009, name: 'Sebastian Vance', first_name: 'Sebastian', last_name: 'Vance' },
    { member_id: 1010, name: 'Giles Montgomery', first_name: 'Giles', last_name: 'Montgomery' },
    { member_id: 1011, name: 'Henry Oakwood', first_name: 'Henry', last_name: 'Oakwood' },
  ],
};

export class PlayCricketClient {
  private config: PlayCricketConfig;

  constructor(config?: Partial<PlayCricketConfig>) {
    this.config = {
      siteId: config?.siteId || '',
      apiToken: config?.apiToken || '',
      isDemoMode: config?.isDemoMode ?? true,
    };
  }

  async fetchFixtures(): Promise<PlayCricketMatchSummary[]> {
    if (this.config.isDemoMode || !this.config.apiToken || !this.config.siteId) {
      return MOCK_FIXTURES;
    }

    try {
      const res = await fetch(`/api/play-cricket/matches?site_id=${this.config.siteId}&api_token=${this.config.apiToken}`);
      if (!res.ok) throw new Error('Failed to fetch from Play-Cricket API');
      const data = await res.json();
      return data.matches || MOCK_FIXTURES;
    } catch (e) {
      console.warn('Play-Cricket API request failed, falling back to mock fixtures', e);
      return MOCK_FIXTURES;
    }
  }

  async fetchRoster(teamId?: number): Promise<Player[]> {
    if (this.config.isDemoMode || !this.config.apiToken || !this.config.siteId) {
      return MOCK_ROSTER.players.map(p => ({
        id: `pc_${p.member_id}`,
        name: p.name,
        battingHand: 'RHB',
        bowlingStyle: 'Right-arm Medium',
        isCaptain: p.captain,
        isWicketKeeper: p.wicket_keeper,
      }));
    }

    try {
      const res = await fetch(`/api/play-cricket/players?site_id=${this.config.siteId}&api_token=${this.config.apiToken}&team_id=${teamId || ''}`);
      if (!res.ok) throw new Error('Failed to fetch players');
      const data = await res.json();
      const players: PlayCricketPlayer[] = data.players || MOCK_ROSTER.players;
      return players.map(p => ({
        id: `pc_${p.member_id}`,
        name: p.name || `${p.first_name} ${p.last_name}`,
        battingHand: 'RHB',
        bowlingStyle: 'Right-arm Medium',
        isCaptain: p.captain,
        isWicketKeeper: p.wicket_keeper,
      }));
    } catch (e) {
      console.warn('Play-Cricket player fetch failed, using fallback', e);
      return MOCK_ROSTER.players.map(p => ({
        id: `pc_${p.member_id}`,
        name: p.name,
        battingHand: 'RHB',
        bowlingStyle: 'Right-arm Medium',
        isCaptain: p.captain,
        isWicketKeeper: p.wicket_keeper,
      }));
    }
  }
}
