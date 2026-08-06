export type BattingHand = 'RHB' | 'LHB';
export type BowlingStyle = 'Right-arm Fast' | 'Right-arm Medium' | 'Right-arm Spin' | 'Left-arm Fast' | 'Left-arm Medium' | 'Left-arm Spin';

export interface Player {
  id: string;
  name: string;
  battingHand: BattingHand;
  bowlingStyle?: BowlingStyle;
  isCaptain?: boolean;
  isWicketKeeper?: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  players: Player[];
}

export type ShotZone = 
  | 'Third Man'
  | 'Point'
  | 'Cover'
  | 'Extra Cover'
  | 'Mid Off'
  | 'Long On'
  | 'Mid Wicket'
  | 'Square Leg'
  | 'Fine Leg'
  | 'Behind Wicket';

export interface ShotLocation {
  /** Relative x on 2D ground circle (-1 to +1) */
  x: number;
  /** Relative y on 2D ground circle (-1 to +1) */
  y: number;
  /** Angle in degrees (0 = straight down ground towards bowler, 90 = off-side, 270 = leg-side for RHB) */
  angleDeg: number;
  /** Distance ratio 0 (pitch center) to 1 (boundary rope) */
  distance: number;
  zone: ShotZone;
  /** Elevation trajectory angle (degrees) for 3D aerial vs grounded shot */
  elevationDeg?: number;
}

export type PitchLength = 'Yorker' | 'Full' | 'Good' | 'Short' | 'Bouncer';
export type PitchLine = 'Outside Off' | 'Off' | 'Middle' | 'Leg' | 'Outside Leg';

export interface PitchLocation {
  length: PitchLength;
  line: PitchLine;
  /** Normalized coordinate on pitch 0..1 x (width), 0..1 y (length) */
  px: number;
  py: number;
}

export type ExtrasType = 'wide' | 'noBall' | 'bye' | 'legBye' | 'penalty';
export type WicketType = 
  | 'bowled'
  | 'caught'
  | 'lbw'
  | 'runOut'
  | 'stumped'
  | 'hitWicket'
  | 'handledBall'
  | 'timedOut'
  | 'obstructingField';

export interface WicketInfo {
  type: WicketType;
  playerDismissedId: string;
  fielderId?: string;
  assistedFielderId?: string;
  description?: string;
}

export interface Ball {
  id: string;
  overNumber: number;
  ballNumberInOver: number; // 1-6 (legal balls)
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  runs: number; // Batter runs scored
  extras: {
    type?: ExtrasType;
    runs: number;
  };
  totalRuns: number; // runs + extras.runs
  isLegal: boolean; // false for wide / noBall
  wicket?: WicketInfo;
  shotLocation?: ShotLocation;
  pitchLocation?: PitchLocation;
  timestamp: string;
}

export interface Over {
  overNumber: number;
  bowlerId: string;
  balls: Ball[];
  runsConceded: number;
  wicketsTaken: number;
  isComplete: boolean;
}

export interface Innings {
  id: string;
  battingTeamId: string;
  bowlingTeamId: string;
  totalRuns: number;
  wickets: number;
  oversCompleted: number;
  ballsInCurrentOver: number;
  overs: Over[];
  activeStrikerId: string;
  activeNonStrikerId: string;
  activeBowlerId: string;
  isCompleted: boolean;
  declared?: boolean;
}

export interface MatchSettings {
  oversPerInnings: number;
  ballsPerOver: number;
  wideValue: number;
  noBallValue: number;
  wideExtraBall: boolean;
  playCricketMatchId?: string;
}

export interface Match {
  id: string;
  title: string;
  venue: string;
  date: string;
  homeTeam: Team;
  awayTeam: Team;
  tossWinnerId: string;
  tossDecision: 'bat' | 'bowl';
  settings: MatchSettings;
  innings: Innings[];
  currentInningsIndex: number;
  status: 'not_started' | 'live' | 'break' | 'completed';
  winnerTeamId?: string;
  winMargin?: string;
}

export interface BatsmanStats {
  playerId: string;
  name: string;
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalText?: string;
  shots: ShotLocation[];
}
