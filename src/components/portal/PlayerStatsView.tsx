'use client';

import React, { useState } from 'react';
import { MalpasPlayerStats, MalpasTeamId } from '@/types/malpas';
import { calculateSpinVsSeamStats } from '@/services/malpasData';
import { BarChart3, Award, Trophy, Target, Shield, Zap, RotateCcw, Sparkles, Filter } from 'lucide-react';

interface PlayerStatsViewProps {
  stats: MalpasPlayerStats[];
  selectedTeamId: MalpasTeamId;
}

export function PlayerStatsView({ stats, selectedTeamId }: PlayerStatsViewProps) {
  const [activeCategory, setActiveCategory] = useState<'batting' | 'bowling' | 'spin_seam' | 'fielding'>('batting');
  const [bowlerTypeFilter, setBowlerTypeFilter] = useState<'all' | 'seam' | 'spin'>('all');
  const [metricShareView, setMetricShareView] = useState<'overs' | 'wickets'>('overs');

  const teamStats = stats.filter(s => s.teamId === selectedTeamId);

  // Top Run Scorers (sorted by runs)
  const topBatters = [...teamStats].sort((a, b) => b.runs - a.runs);

  // Top Wicket Takers (sorted by wickets)
  const allBowlers = [...teamStats].filter(s => s.wickets > 0 || s.oversBowled > 0).sort((a, b) => b.wickets - a.wickets);

  const filteredBowlers = allBowlers.filter(player => {
    if (bowlerTypeFilter === 'all') return true;
    const isSpin = player.bowlingType === 'spin' || (player.bowlingStyle && player.bowlingStyle.toLowerCase().includes('spin'));
    const isSeam = player.bowlingType === 'seam' || (player.bowlingStyle && (player.bowlingStyle.toLowerCase().includes('fast') || player.bowlingStyle.toLowerCase().includes('medium')));
    if (bowlerTypeFilter === 'spin') return isSpin;
    if (bowlerTypeFilter === 'seam') return isSeam;
    return true;
  });

  // Top Fielders (sorted by catches + stumpings)
  const topFielders = [...teamStats].sort((a, b) => (b.catches + b.stumpings) - (a.catches + a.stumpings));

  // Spin vs Seam Breakdown analytics
  const spinVsSeam = calculateSpinVsSeamStats(teamStats);

  const totalOvers = spinVsSeam.seam.overs + spinVsSeam.spin.overs;
  const seamOversPct = totalOvers > 0 ? ((spinVsSeam.seam.overs / totalOvers) * 100).toFixed(1) : '50.0';
  const spinOversPct = totalOvers > 0 ? ((spinVsSeam.spin.overs / totalOvers) * 100).toFixed(1) : '50.0';

  const totalWickets = spinVsSeam.seam.wickets + spinVsSeam.spin.wickets;
  const seamWktsPct = totalWickets > 0 ? ((spinVsSeam.seam.wickets / totalWickets) * 100).toFixed(1) : '50.0';
  const spinWktsPct = totalWickets > 0 ? ((spinVsSeam.spin.wickets / totalWickets) * 100).toFixed(1) : '50.0';

  const currentSeamPct = metricShareView === 'overs' ? seamOversPct : seamWktsPct;
  const currentSpinPct = metricShareView === 'overs' ? spinOversPct : spinWktsPct;

  return (
    <div className="w-full glass-panel rounded-2xl p-4 sm:p-6 border border-malpas-blue/40 shadow-xl space-y-6">
      {/* Header & Main Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-malpas-blue/30 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            Player Season Statistics & Leaders
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Batting averages, bowling leaderboards, 5-wicket milestones, and Spin vs Seam analytics
          </p>
        </div>

        {/* Category Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/50 p-1.5 rounded-xl border border-malpas-blue/30 w-full md:w-auto">
          {[
            { id: 'batting', label: 'Batting' },
            { id: 'bowling', label: 'Bowling' },
            { id: 'spin_seam', label: 'Spin vs Seam' },
            { id: 'fielding', label: 'Fielding' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex-1 md:flex-none min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-malpas-blue text-white border border-blue-400 shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.id === 'spin_seam' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Batting Leaderboard */}
      {activeCategory === 'batting' && (
        <div className="overflow-x-auto no-scrollbar touch-pan-x rounded-xl border border-malpas-blue/30">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="border-b border-malpas-blue/30 text-[11px] font-bold uppercase text-amber-400">
                <th className="py-2.5 px-3 whitespace-nowrap">Player</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Role</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Mat</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Inn</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Runs</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">HS</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Avg</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">100s / 50s</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-malpas-blue/20 text-xs">
              {topBatters.map((player, idx) => (
                <tr key={player.id} className="hover:bg-malpas-navy/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2 whitespace-nowrap">
                    <span className="w-4 text-amber-400 font-mono">{idx + 1}.</span>
                    {player.name}
                  </td>
                  <td className="py-2.5 px-3 text-gray-300 whitespace-nowrap">{player.role}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-gray-300 whitespace-nowrap">{player.matches}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-gray-300 whitespace-nowrap">{player.innings}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-amber-300 text-sm whitespace-nowrap">{player.runs}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400 whitespace-nowrap">{player.highScore}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-white whitespace-nowrap">{player.battingAverage}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-gray-300 whitespace-nowrap">{player.hundreds} / {player.fifties}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Spin vs Seam Analytics Section (Shown in 'bowling' or 'spin_seam' tab) */}
      {(activeCategory === 'bowling' || activeCategory === 'spin_seam') && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-malpas-navy via-[#0c162e] to-malpas-card p-4 sm:p-5 rounded-xl border border-malpas-blue/40 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-malpas-blue/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Spin vs Seam Attack Analytics
                  </h3>
                  <p className="text-xs text-gray-300">Detailed workload & performance breakdown by bowling style</p>
                </div>
              </div>

              {/* Metric View Toggle */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-malpas-blue/30 self-stretch sm:self-auto justify-center">
                <button
                  onClick={() => setMetricShareView('overs')}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                    metricShareView === 'overs'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Overs Share
                </button>
                <button
                  onClick={() => setMetricShareView('wickets')}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                    metricShareView === 'wickets'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Wickets Share
                </button>
              </div>
            </div>

            {/* Comparison Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pace & Seam Attack Card */}
              <div className="bg-gradient-to-br from-cyan-950/40 to-blue-950/20 border border-cyan-500/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <span className="font-bold text-white text-sm">Pace & Seam Attack</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {spinVsSeam.seam.bowlerCount} Bowlers
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Overs</span>
                    <span className="font-mono text-base font-bold text-white">{spinVsSeam.seam.overs}</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Wickets</span>
                    <span className="font-mono text-base font-black text-amber-300">{spinVsSeam.seam.wickets}</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Average</span>
                    <span className="font-mono text-base font-bold text-cyan-300">{spinVsSeam.seam.average}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-cyan-500/10">
                  <span className="text-gray-400">Economy: <strong className="text-white font-mono">{spinVsSeam.seam.economy}</strong></span>
                  <span className="text-gray-400">Best: <strong className="text-emerald-400 font-mono">{spinVsSeam.seam.bestBowling}</strong></span>
                </div>
              </div>

              {/* Spin Unit Card */}
              <div className="bg-gradient-to-br from-purple-950/40 to-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-amber-400" />
                    <span className="font-bold text-white text-sm">Spin Bowling Unit</span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {spinVsSeam.spin.bowlerCount} Bowlers
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-1">
                  <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Overs</span>
                    <span className="font-mono text-base font-bold text-white">{spinVsSeam.spin.overs}</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Wickets</span>
                    <span className="font-mono text-base font-black text-amber-300">{spinVsSeam.spin.wickets}</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">Average</span>
                    <span className="font-mono text-base font-bold text-amber-300">{spinVsSeam.spin.average}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-500/10">
                  <span className="text-gray-400">Economy: <strong className="text-white font-mono">{spinVsSeam.spin.economy}</strong></span>
                  <span className="text-gray-400">Best: <strong className="text-emerald-400 font-mono">{spinVsSeam.spin.bestBowling}</strong></span>
                </div>
              </div>
            </div>

            {/* Visual Distribution Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-cyan-400 flex items-center gap-1">
                  ⚡ Pace & Seam: {currentSeamPct}% ({metricShareView === 'overs' ? spinVsSeam.seam.overs + ' ov' : spinVsSeam.seam.wickets + ' wkts'})
                </span>
                <span className="text-amber-400 flex items-center gap-1">
                  🌀 Spin: {currentSpinPct}% ({metricShareView === 'overs' ? spinVsSeam.spin.overs + ' ov' : spinVsSeam.spin.wickets + ' wkts'})
                </span>
              </div>
              <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-700/80 shadow-inner p-0.5">
                <div
                  style={{ width: `${currentSeamPct}%` }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-l-full transition-all duration-500"
                />
                <div
                  style={{ width: `${currentSpinPct}%` }}
                  className="bg-gradient-to-r from-purple-500 to-amber-500 h-full rounded-r-full transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bowling Leaderboard Table */}
      {(activeCategory === 'bowling' || activeCategory === 'spin_seam') && (
        <div className="space-y-3">
          {/* Sub-filter controls for bowling table */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Bowling Leaderboard & 5-Wicket Milestones
            </h3>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-malpas-blue/30">
              <span className="text-[10px] text-gray-400 uppercase px-2 font-bold flex items-center gap-1">
                <Filter className="w-3 h-3 text-gray-400" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All' },
                { id: 'seam', label: 'Seam' },
                { id: 'spin', label: 'Spin' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setBowlerTypeFilter(f.id as any)}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                    bowlerTypeFilter === f.id
                      ? 'bg-malpas-blue text-white border border-blue-400 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar touch-pan-x rounded-xl border border-malpas-blue/30">
            <table className="w-full min-w-[650px] text-left border-collapse">
              <thead>
                <tr className="border-b border-malpas-blue/30 text-[11px] font-bold uppercase text-amber-400">
                  <th className="py-2.5 px-3 whitespace-nowrap">Bowler</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Overs</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Wickets</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">5w</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Best</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Avg</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Econ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-malpas-blue/20 text-xs">
                {filteredBowlers.map((player, idx) => (
                  <tr key={player.id} className="hover:bg-malpas-navy/60 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-4 text-amber-400 font-mono">{idx + 1}.</span>
                          <span className="text-white font-semibold">{player.name}</span>
                        </div>
                        {player.bowlingStyle && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-900/50 text-blue-300 border border-blue-500/30 whitespace-nowrap">
                            {player.bowlingStyle}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-gray-300 whitespace-nowrap">{player.oversBowled}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-black text-amber-300 text-sm whitespace-nowrap">{player.wickets}</td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {player.fiveWickets > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1 shadow-sm">
                          <Trophy className="w-3 h-3 text-amber-400" />
                          {player.fiveWickets}
                        </span>
                      ) : (
                        <span className="text-gray-500 font-mono">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400 whitespace-nowrap">{player.bestBowling}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-white whitespace-nowrap">{player.bowlingAverage}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-gray-300 whitespace-nowrap">{player.economy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fielding Leaderboard */}
      {activeCategory === 'fielding' && (
        <div className="overflow-x-auto no-scrollbar touch-pan-x rounded-xl border border-malpas-blue/30">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="border-b border-malpas-blue/30 text-[11px] font-bold uppercase text-amber-400">
                <th className="py-2.5 px-3 whitespace-nowrap">Fielder</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Catches</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Stumpings</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Total Dismissals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-malpas-blue/20 text-xs">
              {topFielders.map((player, idx) => (
                <tr key={player.id} className="hover:bg-malpas-navy/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2 whitespace-nowrap">
                    <span className="w-4 text-amber-400 font-mono">{idx + 1}.</span>
                    {player.name}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400 whitespace-nowrap">{player.catches}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-400 whitespace-nowrap">{player.stumpings}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-black text-amber-300 text-sm whitespace-nowrap">
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
