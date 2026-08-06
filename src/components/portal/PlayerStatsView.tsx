'use client';

import React, { useState } from 'react';
import { MalpasPlayerStats, MalpasTeamId } from '@/types/malpas';
import { BarChart3, Award, Trophy, Target, Shield } from 'lucide-react';

interface PlayerStatsViewProps {
  stats: MalpasPlayerStats[];
  selectedTeamId: MalpasTeamId;
}

export function PlayerStatsView({ stats, selectedTeamId }: PlayerStatsViewProps) {
  const [activeCategory, setActiveCategory] = useState<'batting' | 'bowling' | 'fielding'>('batting');

  const teamStats = stats.filter(s => s.teamId === selectedTeamId);

  // Top Run Scorers (sorted by runs)
  const topBatters = [...teamStats].sort((a, b) => b.runs - a.runs);
  // Top Wicket Takers (sorted by wickets)
  const topBowlers = [...teamStats].filter(s => s.wickets > 0).sort((a, b) => b.wickets - a.wickets);
  // Top Fielders (sorted by catches + stumpings)
  const topFielders = [...teamStats].sort((a, b) => (b.catches + b.stumpings) - (a.catches + a.stumpings));

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-malpas-blue/40 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-malpas-blue/30 pb-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            Player Season Statistics & Leaders
          </h2>
          <p className="text-xs text-gray-300">Batting averages, highest scores, top wicket takers, and fielding catches</p>
        </div>

        {/* Category Switcher */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-malpas-blue/30">
          {(['batting', 'bowling', 'fielding'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                activeCategory === cat
                  ? 'bg-malpas-blue text-white border border-blue-400 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Batting Leaderboard */}
      {activeCategory === 'batting' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-malpas-blue/30 text-[11px] font-bold uppercase text-amber-400">
                <th className="py-2.5 px-3">Player</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3 text-center">Mat</th>
                <th className="py-2.5 px-3 text-center">Inn</th>
                <th className="py-2.5 px-3 text-center">Runs</th>
                <th className="py-2.5 px-3 text-center">HS</th>
                <th className="py-2.5 px-3 text-center">Avg</th>
                <th className="py-2.5 px-3 text-center">100s / 50s</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-malpas-blue/20 text-xs">
              {topBatters.map((player, idx) => (
                <tr key={player.id} className="hover:bg-malpas-navy/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-4 text-amber-400 font-mono">{idx + 1}.</span>
                    {player.name}
                  </td>
                  <td className="py-2.5 px-3 text-gray-300">{player.role}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-gray-300">{player.matches}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-gray-300">{player.innings}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-amber-300 text-sm">{player.runs}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400">{player.highScore}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-white">{player.battingAverage}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-gray-300">{player.hundreds} / {player.fifties}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bowling Leaderboard */}
      {activeCategory === 'bowling' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-malpas-blue/30 text-[11px] font-bold uppercase text-amber-400">
                <th className="py-2.5 px-3">Bowler</th>
                <th className="py-2.5 px-3 text-center">Overs</th>
                <th className="py-2.5 px-3 text-center">Wickets</th>
                <th className="py-2.5 px-3 text-center">Best</th>
                <th className="py-2.5 px-3 text-center">Avg</th>
                <th className="py-2.5 px-3 text-center">Econ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-malpas-blue/20 text-xs">
              {topBowlers.map((player, idx) => (
                <tr key={player.id} className="hover:bg-malpas-navy/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-4 text-amber-400 font-mono">{idx + 1}.</span>
                    {player.name}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-gray-300">{player.oversBowled}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-amber-300 text-sm">{player.wickets}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400">{player.bestBowling}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-white">{player.bowlingAverage}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-gray-300">{player.economy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Fielding Leaderboard */}
      {activeCategory === 'fielding' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-malpas-blue/30 text-[11px] font-bold uppercase text-amber-400">
                <th className="py-2.5 px-3">Fielder</th>
                <th className="py-2.5 px-3 text-center">Catches</th>
                <th className="py-2.5 px-3 text-center">Stumpings</th>
                <th className="py-2.5 px-3 text-center">Total Dismissals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-malpas-blue/20 text-xs">
              {topFielders.map((player, idx) => (
                <tr key={player.id} className="hover:bg-malpas-navy/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-4 text-amber-400 font-mono">{idx + 1}.</span>
                    {player.name}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400">{player.catches}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-400">{player.stumpings}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-amber-300 text-sm">
                    {player.catches + player.stumpings}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
