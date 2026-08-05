import { Match, Team, Player } from '@/types/cricket';

export const SAMPLE_PLAYERS_HOME: Player[] = [
  { id: 'p1', name: 'Arthur Pendelton', battingHand: 'RHB', bowlingStyle: 'Right-arm Medium', isCaptain: true },
  { id: 'p2', name: 'Jack "Thunder" Miller', battingHand: 'LHB', bowlingStyle: 'Right-arm Fast' },
  { id: 'p3', name: 'George Featherstone', battingHand: 'RHB', bowlingStyle: 'Right-arm Spin' },
  { id: 'p4', name: 'Barnaby Finch', battingHand: 'RHB', isWicketKeeper: true },
  { id: 'p5', name: 'Rupert Sterling', battingHand: 'LHB', bowlingStyle: 'Left-arm Spin' },
  { id: 'p6', name: 'Charlie Higgins', battingHand: 'RHB', bowlingStyle: 'Right-arm Medium' },
  { id: 'p7', name: 'Oliver Twist', battingHand: 'RHB' },
  { id: 'p8', name: 'Teddy Thornton', battingHand: 'LHB' },
  { id: 'p9', name: 'Sebastian Vance', battingHand: 'RHB', bowlingStyle: 'Right-arm Fast' },
  { id: 'p10', name: 'Giles Montgomery', battingHand: 'RHB', bowlingStyle: 'Left-arm Spin' },
  { id: 'p11', name: 'Henry Oakwood', battingHand: 'RHB', bowlingStyle: 'Right-arm Medium' },
];

export const SAMPLE_PLAYERS_AWAY: Player[] = [
  { id: 'a1', name: 'Archie Harrison', battingHand: 'RHB', bowlingStyle: 'Right-arm Fast', isCaptain: true },
  { id: 'a2', name: 'Leo Radcliffe', battingHand: 'RHB', isWicketKeeper: true },
  { id: 'a3', name: 'Hugo Blackwood', battingHand: 'LHB', bowlingStyle: 'Right-arm Medium' },
  { id: 'a4', name: 'Freddie Macintyre', battingHand: 'RHB', bowlingStyle: 'Right-arm Spin' },
  { id: 'a5', name: 'Toby Greenfield', battingHand: 'RHB' },
  { id: 'a6', name: 'Monty Carlisle', battingHand: 'LHB', bowlingStyle: 'Left-arm Fast' },
  { id: 'a7', name: 'Edward Percy', battingHand: 'RHB' },
  { id: 'a8', name: 'William Prescott', battingHand: 'RHB' },
  { id: 'a9', name: 'Alfie Sterling', battingHand: 'RHB', bowlingStyle: 'Right-arm Spin' },
  { id: 'a10', name: 'Buster Brown', battingHand: 'RHB' },
  { id: 'a11', name: 'Harry Croft', battingHand: 'LHB', bowlingStyle: 'Left-arm Spin' },
];

export const HOME_TEAM: Team = {
  id: 'team_home',
  name: 'Great Brickhill CC',
  shortName: 'GBC',
  players: SAMPLE_PLAYERS_HOME,
};

export const AWAY_TEAM: Team = {
  id: 'team_away',
  name: 'Lower Slaughter CC',
  shortName: 'LSL',
  players: SAMPLE_PLAYERS_AWAY,
};

export function createSampleMatch(): Match {
  return {
    id: 'match_village_demo',
    title: 'The Village Cup Quarter Final',
    venue: 'Brickhill Green, Bucks',
    date: new Date().toISOString().split('T')[0],
    homeTeam: HOME_TEAM,
    awayTeam: AWAY_TEAM,
    tossWinnerId: 'team_home',
    tossDecision: 'bat',
    settings: {
      oversPerInnings: 20,
      ballsPerOver: 6,
      wideValue: 1,
      noBallValue: 1,
      wideExtraBall: true,
      playCricketMatchId: '5491022',
    },
    status: 'live',
    currentInningsIndex: 0,
    innings: [
      {
        id: 'inn_1',
        battingTeamId: 'team_home',
        bowlingTeamId: 'team_away',
        totalRuns: 42,
        wickets: 1,
        oversCompleted: 4,
        ballsInCurrentOver: 3,
        activeStrikerId: 'p1', // Arthur Pendelton (RHB)
        activeNonStrikerId: 'p2', // Jack Miller (LHB)
        activeBowlerId: 'a1', // Archie Harrison
        isCompleted: false,
        overs: [
          {
            overNumber: 1,
            bowlerId: 'a1',
            runsConceded: 10,
            wicketsTaken: 0,
            isComplete: true,
            balls: [
              {
                id: 'b1_1', overNumber: 1, ballNumberInOver: 1, strikerId: 'p1', nonStrikerId: 'p2', bowlerId: 'a1',
                runs: 4, extras: { runs: 0 }, totalRuns: 4, isLegal: true, timestamp: '14:00:10',
                shotLocation: { x: 0.65, y: -0.45, angleDeg: 55, distance: 0.85, zone: 'Cover', elevationDeg: 5 },
                pitchLocation: { length: 'Good', line: 'Outside Off', px: 0.65, py: 0.4 },
              },
              {
                id: 'b1_2', overNumber: 1, ballNumberInOver: 2, strikerId: 'p1', nonStrikerId: 'p2', bowlerId: 'a1',
                runs: 0, extras: { runs: 0 }, totalRuns: 0, isLegal: true, timestamp: '14:00:50',
                shotLocation: { x: 0.1, y: -0.1, angleDeg: 10, distance: 0.15, zone: 'Long On', elevationDeg: 0 },
                pitchLocation: { length: 'Good', line: 'Middle', px: 0.5, py: 0.35 },
              },
              {
                id: 'b1_3', overNumber: 1, ballNumberInOver: 3, strikerId: 'p1', nonStrikerId: 'p2', bowlerId: 'a1',
                runs: 6, extras: { runs: 0 }, totalRuns: 6, isLegal: true, timestamp: '14:01:30',
                shotLocation: { x: -0.3, y: -0.85, angleDeg: 345, distance: 0.98, zone: 'Mid Wicket', elevationDeg: 35 },
                pitchLocation: { length: 'Short', line: 'Leg', px: 0.35, py: 0.6 },
              },
              {
                id: 'b1_4', overNumber: 1, ballNumberInOver: 4, strikerId: 'p1', nonStrikerId: 'p2', bowlerId: 'a1',
                runs: 0, extras: { runs: 0 }, totalRuns: 0, isLegal: true, timestamp: '14:02:10',
                shotLocation: { x: 0.05, y: 0.05, angleDeg: 0, distance: 0.05, zone: 'Mid Off', elevationDeg: 0 },
                pitchLocation: { length: 'Full', line: 'Off', px: 0.52, py: 0.25 },
              },
              {
                id: 'b1_5', overNumber: 1, ballNumberInOver: 5, strikerId: 'p1', nonStrikerId: 'p2', bowlerId: 'a1',
                runs: 0, extras: { runs: 0 }, totalRuns: 0, isLegal: true, timestamp: '14:02:50',
                pitchLocation: { length: 'Yorker', line: 'Outside Off', px: 0.7, py: 0.15 },
              },
              {
                id: 'b1_6', overNumber: 1, ballNumberInOver: 6, strikerId: 'p1', nonStrikerId: 'p2', bowlerId: 'a1',
                runs: 0, extras: { runs: 0 }, totalRuns: 0, isLegal: true, timestamp: '14:03:30',
                shotLocation: { x: 0.4, y: 0.2, angleDeg: 120, distance: 0.45, zone: 'Point', elevationDeg: 2 },
                pitchLocation: { length: 'Good', line: 'Outside Off', px: 0.62, py: 0.38 },
              },
            ],
          },
          {
            overNumber: 2,
            bowlerId: 'a3',
            runsConceded: 12,
            wicketsTaken: 0,
            isComplete: true,
            balls: [
              {
                id: 'b2_1', overNumber: 2, ballNumberInOver: 1, strikerId: 'p2', nonStrikerId: 'p1', bowlerId: 'a3',
                runs: 4, extras: { runs: 0 }, totalRuns: 4, isLegal: true, timestamp: '14:05:00',
                shotLocation: { x: -0.75, y: -0.4, angleDeg: 290, distance: 0.88, zone: 'Square Leg', elevationDeg: 8 },
                pitchLocation: { length: 'Full', line: 'Middle', px: 0.48, py: 0.28 },
              },
              {
                id: 'b2_2', overNumber: 2, ballNumberInOver: 2, strikerId: 'p2', nonStrikerId: 'p1', bowlerId: 'a3',
                runs: 1, extras: { runs: 0 }, totalRuns: 1, isLegal: true, timestamp: '14:05:40',
                shotLocation: { x: 0.3, y: -0.4, angleDeg: 40, distance: 0.5, zone: 'Cover', elevationDeg: 0 },
                pitchLocation: { length: 'Good', line: 'Off', px: 0.55, py: 0.38 },
              },
              {
                id: 'b2_3', overNumber: 2, ballNumberInOver: 3, strikerId: 'p1', nonStrikerId: 'p2', bowlerId: 'a3',
                runs: 4, extras: { runs: 0 }, totalRuns: 4, isLegal: true, timestamp: '14:06:20',
                shotLocation: { x: 0.5, y: 0.65, angleDeg: 140, distance: 0.82, zone: 'Third Man', elevationDeg: 12 },
                pitchLocation: { length: 'Short', line: 'Outside Off', px: 0.72, py: 0.58 },
              },
              {
                id: 'b2_4', overNumber: 2, ballNumberInOver: 4, strikerId: 'p1', nonStrikerId: 'p2', bowlerId: 'a3',
                runs: 1, extras: { runs: 0 }, totalRuns: 1, isLegal: true, timestamp: '14:07:00',
                shotLocation: { x: -0.2, y: -0.3, angleDeg: 330, distance: 0.4, zone: 'Mid Wicket', elevationDeg: 0 },
                pitchLocation: { length: 'Good', line: 'Leg', px: 0.42, py: 0.42 },
              },
              {
                id: 'b2_5', overNumber: 2, ballNumberInOver: 5, strikerId: 'p2', nonStrikerId: 'p1', bowlerId: 'a3',
                runs: 2, extras: { runs: 0 }, totalRuns: 2, isLegal: true, timestamp: '14:07:40',
                shotLocation: { x: -0.5, y: -0.6, angleDeg: 310, distance: 0.75, zone: 'Mid Wicket', elevationDeg: 15 },
                pitchLocation: { length: 'Full', line: 'Middle', px: 0.5, py: 0.3 },
              },
              {
                id: 'b2_6', overNumber: 2, ballNumberInOver: 6, strikerId: 'p2', nonStrikerId: 'p1', bowlerId: 'a3',
                runs: 0, extras: { runs: 0 }, totalRuns: 0, isLegal: true, timestamp: '14:08:20',
                pitchLocation: { length: 'Good', line: 'Off', px: 0.52, py: 0.36 },
              },
            ],
          },
          {
            overNumber: 3,
            bowlerId: 'a1',
            runsConceded: 11,
            wicketsTaken: 1,
            isComplete: true,
            balls: [
              {
                id: 'b3_1', overNumber: 3, ballNumberInOver: 1, strikerId: 'p1', nonStrikerId: 'p2', bowlerId: 'a1',
                runs: 6, extras: { runs: 0 }, totalRuns: 6, isLegal: true, timestamp: '14:10:00',
                shotLocation: { x: 0.1, y: -0.92, angleDeg: 5, distance: 0.95, zone: 'Long On', elevationDeg: 42 },
                pitchLocation: { length: 'Full', line: 'Middle', px: 0.5, py: 0.22 },
              },
              {
                id: 'b3_2', overNumber: 3, ballNumberInOver: 2, strikerId: 'p1', nonStrikerId: 'p2', bowlerId: 'a1',
                runs: 4, extras: { runs: 0 }, totalRuns: 4, isLegal: true, timestamp: '14:10:40',
                shotLocation: { x: 0.85, y: 0.1, angleDeg: 95, distance: 0.88, zone: 'Point', elevationDeg: 6 },
                pitchLocation: { length: 'Short', line: 'Outside Off', px: 0.78, py: 0.62 },
              },
              {
                id: 'b3_3', overNumber: 3, ballNumberInOver: 3, strikerId: 'p1', nonStrikerId: 'p2', bowlerId: 'a1',
                runs: 1, extras: { runs: 0 }, totalRuns: 1, isLegal: true, timestamp: '14:11:20',
                shotLocation: { x: -0.4, y: -0.3, angleDeg: 300, distance: 0.5, zone: 'Square Leg', elevationDeg: 2 },
                pitchLocation: { length: 'Good', line: 'Leg', px: 0.38, py: 0.4 },
              },
              {
                id: 'b3_4', overNumber: 3, ballNumberInOver: 4, strikerId: 'p2', nonStrikerId: 'p1', bowlerId: 'a1',
                runs: 0, extras: { runs: 0 }, totalRuns: 0, isLegal: true, timestamp: '14:12:00',
                wicket: { type: 'caught', playerDismissedId: 'p2', fielderId: 'a2', description: 'c Leo Radcliffe b Archie Harrison' },
                shotLocation: { x: -0.2, y: 0.7, angleDeg: 170, distance: 0.72, zone: 'Behind Wicket', elevationDeg: 30 },
                pitchLocation: { length: 'Good', line: 'Outside Off', px: 0.68, py: 0.39 },
              },
              {
                id: 'b3_5', overNumber: 3, ballNumberInOver: 5, strikerId: 'p3', nonStrikerId: 'p1', bowlerId: 'a1',
                runs: 0, extras: { runs: 0 }, totalRuns: 0, isLegal: true, timestamp: '14:13:00',
                pitchLocation: { length: 'Good', line: 'Middle', px: 0.5, py: 0.4 },
              },
              {
                id: 'b3_6', overNumber: 3, ballNumberInOver: 6, strikerId: 'p3', nonStrikerId: 'p1', bowlerId: 'a1',
                runs: 0, extras: { runs: 0 }, totalRuns: 0, isLegal: true, timestamp: '14:13:40',
                shotLocation: { x: 0.2, y: -0.2, angleDeg: 20, distance: 0.3, zone: 'Extra Cover', elevationDeg: 0 },
                pitchLocation: { length: 'Full', line: 'Off', px: 0.55, py: 0.25 },
              },
            ],
          },
          {
            overNumber: 4,
            bowlerId: 'a3',
            runsConceded: 9,
            wicketsTaken: 0,
            isComplete: false,
            balls: [
              {
                id: 'b4_1', overNumber: 4, ballNumberInOver: 1, strikerId: 'p1', nonStrikerId: 'p3', bowlerId: 'a3',
                runs: 4, extras: { runs: 0 }, totalRuns: 4, isLegal: true, timestamp: '14:15:00',
                shotLocation: { x: 0.7, y: -0.4, angleDeg: 60, distance: 0.85, zone: 'Cover', elevationDeg: 4 },
                pitchLocation: { length: 'Full', line: 'Outside Off', px: 0.64, py: 0.26 },
              },
              {
                id: 'b4_2', overNumber: 4, ballNumberInOver: 2, strikerId: 'p1', nonStrikerId: 'p3', bowlerId: 'a3',
                runs: 4, extras: { runs: 0 }, totalRuns: 4, isLegal: true, timestamp: '14:15:40',
                shotLocation: { x: -0.6, y: -0.6, angleDeg: 315, distance: 0.88, zone: 'Mid Wicket', elevationDeg: 18 },
                pitchLocation: { length: 'Short', line: 'Leg', px: 0.34, py: 0.55 },
              },
              {
                id: 'b4_3', overNumber: 4, ballNumberInOver: 3, strikerId: 'p1', nonStrikerId: 'p3', bowlerId: 'a3',
                runs: 1, extras: { runs: 0 }, totalRuns: 1, isLegal: true, timestamp: '14:16:20',
                shotLocation: { x: 0.1, y: -0.4, angleDeg: 15, distance: 0.45, zone: 'Long On', elevationDeg: 0 },
                pitchLocation: { length: 'Good', line: 'Middle', px: 0.5, py: 0.38 },
              },
            ],
          },
        ],
      },
    ],
  };
}
