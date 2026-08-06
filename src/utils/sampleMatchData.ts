import { Match, Team, Player } from '@/types/cricket';
import { MALPAS_PLAYERS_1ST_XI, MALPAS_PLAYERS_2ND_XI } from '@/services/malpasData';

export const MALPAS_HOME_TEAM: Team = {
  id: 'team_malpas',
  name: 'Malpas CC 1st XI',
  shortName: 'Malpas',
  players: MALPAS_PLAYERS_1ST_XI,
};

export const OPPONENT_AWAY_TEAM: Team = {
  id: 'team_bowdon',
  name: 'Bowdon Vale CC 1st XI',
  shortName: 'Bowdon Vale',
  players: [
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
  ],
};

export function createSampleMatch(): Match {
  return {
    id: 'match_malpas_demo',
    title: 'Cheshire Cricket League Division 4',
    venue: 'The Recreation Ground, Wrexham Road, Malpas',
    date: new Date().toISOString().split('T')[0],
    homeTeam: MALPAS_HOME_TEAM,
    awayTeam: OPPONENT_AWAY_TEAM,
    tossWinnerId: 'team_malpas',
    tossDecision: 'bat',
    settings: {
      oversPerInnings: 40,
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
        battingTeamId: 'team_malpas',
        bowlingTeamId: 'team_bowdon',
        totalRuns: 54,
        wickets: 1,
        oversCompleted: 5,
        ballsInCurrentOver: 2,
        activeStrikerId: 'm1_1', // Callum Andrews (RHB)
        activeNonStrikerId: 'm1_2', // Ben Wardle (LHB)
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
                id: 'b1_1', overNumber: 1, ballNumberInOver: 1, strikerId: 'm1_1', nonStrikerId: 'm1_2', bowlerId: 'a1',
                runs: 4, extras: { runs: 0 }, totalRuns: 4, isLegal: true, timestamp: '14:00:10',
                shotLocation: { x: 0.65, y: -0.45, angleDeg: 55, distance: 0.85, zone: 'Cover', elevationDeg: 5 },
                pitchLocation: { length: 'Good', line: 'Outside Off', px: 0.65, py: 0.4 },
              },
              {
                id: 'b1_2', overNumber: 1, ballNumberInOver: 2, strikerId: 'm1_1', nonStrikerId: 'm1_2', bowlerId: 'a1',
                runs: 0, extras: { runs: 0 }, totalRuns: 0, isLegal: true, timestamp: '14:00:50',
                shotLocation: { x: 0.1, y: -0.1, angleDeg: 10, distance: 0.15, zone: 'Long On', elevationDeg: 0 },
                pitchLocation: { length: 'Good', line: 'Middle', px: 0.5, py: 0.35 },
              },
              {
                id: 'b1_3', overNumber: 1, ballNumberInOver: 3, strikerId: 'm1_1', nonStrikerId: 'm1_2', bowlerId: 'a1',
                runs: 6, extras: { runs: 0 }, totalRuns: 6, isLegal: true, timestamp: '14:01:30',
                shotLocation: { x: -0.3, y: -0.85, angleDeg: 345, distance: 0.98, zone: 'Mid Wicket', elevationDeg: 35 },
                pitchLocation: { length: 'Short', line: 'Leg', px: 0.35, py: 0.6 },
              },
              {
                id: 'b1_4', overNumber: 1, ballNumberInOver: 4, strikerId: 'm1_1', nonStrikerId: 'm1_2', bowlerId: 'a1',
                runs: 0, extras: { runs: 0 }, totalRuns: 0, isLegal: true, timestamp: '14:02:10',
                shotLocation: { x: 0.05, y: 0.05, angleDeg: 0, distance: 0.05, zone: 'Mid Off', elevationDeg: 0 },
                pitchLocation: { length: 'Full', line: 'Off', px: 0.52, py: 0.25 },
              },
              {
                id: 'b1_5', overNumber: 1, ballNumberInOver: 5, strikerId: 'm1_1', nonStrikerId: 'm1_2', bowlerId: 'a1',
                runs: 0, extras: { runs: 0 }, totalRuns: 0, isLegal: true, timestamp: '14:02:50',
                pitchLocation: { length: 'Yorker', line: 'Outside Off', px: 0.7, py: 0.15 },
              },
              {
                id: 'b1_6', overNumber: 1, ballNumberInOver: 6, strikerId: 'm1_1', nonStrikerId: 'm1_2', bowlerId: 'a1',
                runs: 0, extras: { runs: 0 }, totalRuns: 0, isLegal: true, timestamp: '14:03:30',
                shotLocation: { x: 0.4, y: 0.2, angleDeg: 120, distance: 0.45, zone: 'Point', elevationDeg: 2 },
                pitchLocation: { length: 'Good', line: 'Outside Off', px: 0.62, py: 0.38 },
              },
            ],
          },
        ],
      },
    ],
  };
}
