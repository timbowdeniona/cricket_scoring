import { ShotZone, BattingHand, Innings, Ball, Player, BatsmanStats } from '@/types/cricket';

/**
 * Calculates shot zone based on 2D coordinates (x, y) relative to pitch center.
 * x: -1 (left of bowler view) to +1 (right of bowler view)
 * y: -1 (behind bowler / long off/on) to +1 (behind keeper)
 */
export function calculateShotZone(x: number, y: number, stance: BattingHand = 'RHB'): ShotZone {
  // Convert x, y into angle in degrees from top (0 deg = straight down pitch towards bowler, i.e. long on / long off)
  // atan2(x, -y) gives angle relative to straight drive
  let rad = Math.atan2(x, -y);
  let deg = (rad * 180) / Math.PI; // -180 to 180
  if (deg < 0) deg += 360; // 0 to 360

  // For Left Handed Batsman, mirror off-side / leg-side angle
  if (stance === 'LHB') {
    deg = (360 - deg) % 360;
  }

  // 0 deg: Straight drive / Long on / Long off
  // 45 deg: Cover / Extra cover
  // 90 deg: Point / Square cut
  // 135 deg: Third man / Fly slip
  // 180 deg: Fine leg / Behind keeper
  // 225 deg: Square leg
  // 270 deg: Midwicket
  // 315 deg: Mid on / Cow corner

  if (deg >= 340 || deg < 20) return 'Long On';
  if (deg >= 20 && deg < 60) return 'Extra Cover';
  if (deg >= 60 && deg < 110) return 'Cover';
  if (deg >= 110 && deg < 150) return 'Point';
  if (deg >= 150 && deg < 190) return 'Third Man';
  if (deg >= 190 && deg < 230) return 'Behind Wicket';
  if (deg >= 230 && deg < 260) return 'Fine Leg';
  if (deg >= 260 && deg < 290) return 'Square Leg';
  if (deg >= 290 && deg < 320) return 'Mid Wicket';
  return 'Mid Off';
}

export function formatOvers(ballsTotal: number): string {
  const overs = Math.floor(ballsTotal / 6);
  const balls = ballsTotal % 6;
  return `${overs}.${balls}`;
}

export function calculateRunRate(runs: number, totalBalls: number): number {
  if (totalBalls === 0) return 0;
  return Number(((runs / totalBalls) * 6).toFixed(2));
}

export function computeBatsmanStats(innings: Innings, playerId: string, players: Player[]): BatsmanStats {
  const player = players.find(p => p.id === playerId);
  const name = player ? player.name : 'Batsman';

  let runs = 0;
  let ballsFaced = 0;
  let fours = 0;
  let sixes = 0;
  let isOut = false;
  let dismissalText = 'Not Out';
  const shots = [];

  for (const over of innings.overs) {
    for (const ball of over.balls) {
      if (ball.strikerId === playerId) {
        // Wides don't count towards balls faced for batsman
        if (ball.extras.type !== 'wide') {
          ballsFaced += 1;
        }

        runs += ball.runs;
        if (ball.runs === 4) fours += 1;
        if (ball.runs === 6) sixes += 1;

        if (ball.shotLocation) {
          shots.push(ball.shotLocation);
        }
      }

      if (ball.wicket && ball.wicket.playerDismissedId === playerId) {
        isOut = true;
        dismissalText = formatDismissalText(ball, players);
      }
    }
  }

  const strikeRate = ballsFaced > 0 ? Number(((runs / ballsFaced) * 100).toFixed(1)) : 0;

  return {
    playerId,
    name,
    runs,
    ballsFaced,
    fours,
    sixes,
    strikeRate,
    isOut,
    dismissalText,
    shots,
  };
}

function formatDismissalText(ball: Ball, players: Player[]): string {
  if (!ball.wicket) return '';
  const type = ball.wicket.type;
  const bowler = players.find(p => p.id === ball.bowlerId)?.name || 'Bowler';
  const fielder = players.find(p => p.id === ball.wicket?.fielderId)?.name;

  switch (type) {
    case 'bowled': return `b ${bowler}`;
    case 'caught': return fielder ? `c ${fielder} b ${bowler}` : `c & b ${bowler}`;
    case 'lbw': return `lbw b ${bowler}`;
    case 'runOut': return fielder ? `run out (${fielder})` : 'run out';
    case 'stumped': return fielder ? `st ${fielder} b ${bowler}` : `st b ${bowler}`;
    case 'hitWicket': return `hit wicket b ${bowler}`;
    default: return type;
  }
}
