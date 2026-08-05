'use client';

import React from 'react';
import { Match, Player } from '@/types/cricket';
import { formatOvers, calculateRunRate, computeBatsmanStats } from '@/utils/cricketCalculations';
import { ArrowLeftRight, UserCheck, ShieldAlert } from 'lucide-react';

interface LiveHeaderProps {
  match: Match;
  onSwapStrike: () => void;
  onOpenBowlerChange: () => void;
  onOpenBatterChange: () => void;
}

export function LiveHeader({
  match,
  onSwapStrike,
  onOpenBowlerChange,
  onOpenBatterChange,
}: LiveHeaderProps) {
  const inn = match.innings[match.currentInningsIndex];
  if (!inn) return null;

  const battingTeam = match.homeTeam.id === inn.battingTeamId ? match.homeTeam : match.awayTeam;
  const bowlingTeam = match.homeTeam.id === inn.bowlingTeamId ? match.homeTeam : match.awayTeam;
  const allPlayers = [...match.homeTeam.players, ...match.awayTeam.players];

  const strikerStats = computeBatsmanStats(inn, inn.activeStrikerId, allPlayers);
  const nonStrikerStats = computeBatsmanStats(inn, inn.activeNonStrikerId, allPlayers);

  const activeBowler = allPlayers.find(p => p.id === inn.activeBowlerId);

  // Calculate bowler stats in current innings
  let bowlerOvers = 0;
  let bowlerBalls = 0;
  let bowlerRuns = 0;
  let bowlerWickets = 0;

  inn.overs.forEach(o => {
    if (o.bowlerId === inn.activeBowlerId) {
      o.balls.forEach(b => {
        if (b.isLegal) bowlerBalls++;
        bowlerRuns += b.totalRuns;
        if (b.wicket && b.wicket.type !== 'runOut') bowlerWickets++;
      });
    }
  });

  const totalBallsBowled = inn.oversCompleted * 6 + inn.ballsInCurrentOver;
  const crr = calculateRunRate(inn.totalRuns, totalBallsBowled);

  // Recent balls in current over
  const currentOver = inn.overs[inn.overs.length - 1];
  const recentBalls = currentOver ? currentOver.balls.slice(-6) : [];

  return (
    <header className="w-full glass-panel rounded-2xl p-4 shadow-xl border border-emerald-900/40">
      {/* Top Banner: Match Title & Score */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-emerald-800/30 pb-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">{match.title} • {match.venue}</div>
          <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{battingTeam.name}</span>
            <span className="text-emerald-400 font-mono text-3xl">{inn.totalRuns}-{inn.wickets}</span>
            <span className="text-sm font-normal text-gray-400">({formatOvers(totalBallsBowled)} / {match.settings.oversPerInnings} ov)</span>
          </div>
        </div>

        {/* Run Rate & Match Status */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-right">
            <div className="text-[10px] uppercase text-emerald-400 font-semibold">Run Rate</div>
            <div className="text-lg font-bold font-mono text-white">{crr.toFixed(2)}</div>
          </div>
          <div className="bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-500/30 text-right">
            <div className="text-[10px] uppercase text-amber-400 font-semibold">Toss</div>
            <div className="text-xs font-semibold text-amber-200">
              {match.tossWinnerId === match.homeTeam.id ? match.homeTeam.shortName : match.awayTeam.shortName} chose to {match.tossDecision}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Active Batsmen & Bowler Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        {/* Striker Card */}
        <div
          onClick={onSwapStrike}
          className="glass-button p-3 rounded-xl cursor-pointer hover:border-emerald-500/50 flex items-center justify-between border-l-4 border-l-emerald-400"
        >
          <div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Striker ({strikerStats.name ? (allPlayers.find(p => p.id === inn.activeStrikerId)?.battingHand || 'RHB') : ''})
            </div>
            <div className="font-bold text-white text-base truncate">{strikerStats.name}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xl font-black text-emerald-300">{strikerStats.runs}</div>
            <div className="text-xs text-gray-400">({strikerStats.ballsFaced}b • {strikerStats.fours}x4 {strikerStats.sixes}x6)</div>
          </div>
        </div>

        {/* Non-Striker Card */}
        <div
          onClick={onSwapStrike}
          className="glass-button p-3 rounded-xl cursor-pointer hover:border-gray-500/50 flex items-center justify-between border-l-4 border-l-gray-600"
        >
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">Non-Striker</div>
            <div className="font-bold text-white text-base truncate">{nonStrikerStats.name}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xl font-bold text-gray-200">{nonStrikerStats.runs}</div>
            <div className="text-xs text-gray-400">({nonStrikerStats.ballsFaced}b)</div>
          </div>
        </div>

        {/* Bowler Card */}
        <div
          onClick={onOpenBowlerChange}
          className="glass-button p-3 rounded-xl cursor-pointer hover:border-emerald-500/50 flex items-center justify-between border-l-4 border-l-amber-500"
        >
          <div>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-bold uppercase">
              Current Bowler
            </div>
            <div className="font-bold text-white text-base truncate">{activeBowler?.name || 'Select Bowler'}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-lg font-bold text-amber-300">
              {bowlerWickets}-{bowlerRuns}
            </div>
            <div className="text-xs text-gray-400">({formatOvers(bowlerBalls)} ov)</div>
          </div>
        </div>
      </div>

      {/* Bottom Over Sequence Bar */}
      <div className="mt-3 pt-2 border-t border-emerald-900/30 flex items-center justify-between">
        <div className="text-xs text-gray-400 font-medium">This Over ({recentBalls.length}/6):</div>
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {recentBalls.map((b, i) => {
            let label = `${b.totalRuns}`;
            let bg = 'bg-emerald-900/40 text-emerald-200 border-emerald-700/50';

            if (b.wicket) {
              label = 'W';
              bg = 'bg-rose-600 text-white font-bold border-rose-400 animate-pulse';
            } else if (b.runs === 4 || b.runs === 6) {
              bg = 'bg-amber-500 text-black font-black border-amber-300';
            } else if (b.extras.type === 'wide') {
              label = `WD${b.totalRuns > 1 ? b.totalRuns : ''}`;
              bg = 'bg-blue-600 text-white font-bold';
            } else if (b.extras.type === 'noBall') {
              label = `NB${b.totalRuns > 1 ? b.totalRuns : ''}`;
              bg = 'bg-purple-600 text-white font-bold';
            } else if (b.runs === 0) {
              label = '•';
              bg = 'bg-gray-800 text-gray-400 border-gray-700';
            }

            return (
              <span
                key={i}
                className={`w-7 h-7 rounded-full border text-xs flex items-center justify-center font-mono shadow ${bg}`}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </header>
  );
}
