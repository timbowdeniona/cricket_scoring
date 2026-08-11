'use client';

import React from 'react';
import { Match } from '@/types/cricket';
import { formatOvers, calculateRunRate, computeBatsmanStats } from '@/utils/cricketCalculations';
import { ArrowLeftRight, UserCheck } from 'lucide-react';
import { SocialShareButtons } from './SocialShareButtons';

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
    <header className="w-full glass-panel rounded-2xl p-4 shadow-xl border border-malpas-blue/40 space-y-3">
      {/* Top Banner: Match Title, Score & 1-Click Social Share */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-malpas-blue/30 pb-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold">{match.title} • {match.venue}</div>
          <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{battingTeam.name}</span>
            <span className="text-amber-300 font-mono text-3xl">{inn.totalRuns}-{inn.wickets}</span>
            <span className="text-sm font-normal text-gray-400">({formatOvers(totalBallsBowled)} / {match.settings.oversPerInnings} ov)</span>
          </div>
        </div>

        {/* 1-Click Social Media Share Buttons */}
        <SocialShareButtons
          matchTitle={match.title}
          battingTeamName={battingTeam.name}
          bowlingTeamName={bowlingTeam.name}
          totalRuns={inn.totalRuns}
          wickets={inn.wickets}
          oversCompleted={inn.oversCompleted}
          ballsInCurrentOver={inn.ballsInCurrentOver}
          strikerName={strikerStats?.name}
          strikerRuns={strikerStats?.runs}
          nonStrikerName={nonStrikerStats?.name}
          nonStrikerRuns={nonStrikerStats?.runs}
          venue={match.venue}
        />
      </div>

      {/* Middle Banner: Striker & Non-Striker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Striker */}
        <button
          type="button"
          onClick={onOpenBatterChange}
          aria-label={`Change Striker: ${strikerStats ? strikerStats.name : 'Select Batter'}`}
          className="w-full text-left bg-malpas-navy/80 hover:bg-malpas-dark focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[48px] p-3 rounded-xl border border-amber-500/40 cursor-pointer transition-all flex items-center justify-between shadow-md"
        >
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
              <span>Striker</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-base font-bold text-white flex items-center gap-1.5">
              {strikerStats ? strikerStats.name : 'Select Batter'}
            </div>
          </div>
          {strikerStats && (
            <div className="text-right font-mono">
              <div className="text-xl font-black text-amber-300">{strikerStats.runs}</div>
              <div className="text-[10px] text-gray-400">{strikerStats.ballsFaced}b • {strikerStats.fours}×4 {strikerStats.sixes}×6</div>
            </div>
          )}
        </button>

        {/* Non-Striker */}
        <button
          type="button"
          onClick={onSwapStrike}
          aria-label={`Swap strike with Non-Striker: ${nonStrikerStats ? nonStrikerStats.name : 'Select Batter'}`}
          className="w-full text-left bg-malpas-navy/80 hover:bg-malpas-dark focus:outline-none focus:ring-2 focus:ring-malpas-blue min-h-[48px] p-3 rounded-xl border border-malpas-blue/30 cursor-pointer transition-all flex items-center justify-between shadow-md"
        >
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-400">Non-Striker</div>
            <div className="text-base font-bold text-gray-200">
              {nonStrikerStats ? nonStrikerStats.name : 'Select Batter'}
            </div>
          </div>
          {nonStrikerStats && (
            <div className="text-right font-mono">
              <div className="text-xl font-bold text-gray-300">{nonStrikerStats.runs}</div>
              <div className="text-[10px] text-gray-400">{nonStrikerStats.ballsFaced}b • {nonStrikerStats.fours}×4 {nonStrikerStats.sixes}×6</div>
            </div>
          )}
        </button>
      </div>

      {/* Bottom Row: Bowler & Recent Over Balls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={onOpenBowlerChange}
          aria-label={`Change Bowler: ${activeBowler ? activeBowler.name : 'Choose Bowler'}`}
          className="w-full sm:w-auto text-left bg-malpas-navy/60 hover:bg-malpas-navy focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[48px] p-2.5 rounded-xl border border-malpas-blue/30 cursor-pointer flex items-center gap-3"
        >
          <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="text-xs">
            <span className="text-gray-400 font-semibold">Bowler: </span>
            <span className="font-bold text-white">{activeBowler ? activeBowler.name : 'Choose Bowler'}</span>
            <span className="font-mono text-amber-400 ml-2 font-bold">
              {bowlerWickets}-{bowlerRuns} ({formatOvers(bowlerBalls)})
            </span>
          </div>
        </button>

        {/* Current Over Balls */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <span className="text-[10px] uppercase font-bold text-gray-400 mr-1">Over:</span>
          {recentBalls.length === 0 ? (
            <span className="text-xs text-gray-500 italic">No balls bowled</span>
          ) : (
            recentBalls.map((b, i) => (
              <span
                key={i}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-sm ${
                  b.wicket
                    ? 'bg-red-600 text-white animate-bounce'
                    : b.runs === 6
                    ? 'bg-purple-600 text-white'
                    : b.runs === 4
                    ? 'bg-emerald-600 text-white'
                    : b.runs === 0
                    ? 'bg-gray-800 text-gray-400 border border-gray-700'
                    : 'bg-malpas-blue text-white'
                }`}
              >
                {b.wicket ? 'W' : b.runs}
              </span>
            ))
          )}
        </div>
      </div>
    </header>
  );
}
