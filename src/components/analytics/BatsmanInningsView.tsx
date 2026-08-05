'use client';

import React, { useState } from 'react';
import { Innings, Player, ShotLocation } from '@/types/cricket';
import { computeBatsmanStats } from '@/utils/cricketCalculations';
import { WagonWheel2D } from '../ground/WagonWheel2D';
import { Target, Award, Shield, User, Filter } from 'lucide-react';

interface BatsmanInningsViewProps {
  innings: Innings;
  players: Player[];
}

export function BatsmanInningsView({ innings, players }: BatsmanInningsViewProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(players[0]?.id || '');
  const [filterType, setFilterType] = useState<'all' | 'boundaries' | 'singles' | 'dots'>('all');

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);
  const stats = computeBatsmanStats(innings, selectedPlayerId, players);

  const filteredShots = stats.shots.filter(shot => {
    if (filterType === 'boundaries') return shot.distance >= 0.8;
    if (filterType === 'singles') return shot.distance > 0.25 && shot.distance < 0.8;
    if (filterType === 'dots') return shot.distance <= 0.25;
    return true;
  });

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-emerald-900/40 shadow-xl space-y-5">
      {/* Player Selector Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-emerald-900/30 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" />
            Batsman Innings & Stroke Breakdown
          </h2>
          <p className="text-xs text-emerald-400">Analyze individual batsman shot placement and wagon wheel</p>
        </div>

        {/* Player Dropdown */}
        <div className="w-full sm:w-64">
          <select
            value={selectedPlayerId}
            onChange={e => setSelectedPlayerId(e.target.value)}
            className="w-full bg-emerald-950/80 border border-emerald-700/50 rounded-xl p-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-400"
          >
            {players.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.battingHand})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Innings Summary Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40">
          <div className="text-xs text-gray-400 font-semibold uppercase">Total Score</div>
          <div className="text-2xl font-black font-mono text-emerald-300">
            {stats.runs} <span className="text-xs text-gray-400 font-normal">({stats.ballsFaced}b)</span>
          </div>
          <div className="text-[11px] text-gray-400 truncate mt-1">{stats.dismissalText}</div>
        </div>

        <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40">
          <div className="text-xs text-gray-400 font-semibold uppercase">Strike Rate</div>
          <div className="text-2xl font-black font-mono text-white">{stats.strikeRate}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Runs / 100 Balls</div>
        </div>

        <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40">
          <div className="text-xs text-gray-400 font-semibold uppercase">Boundaries</div>
          <div className="text-2xl font-black font-mono text-amber-400">
            {stats.fours}x4 • {stats.sixes}x6
          </div>
          <div className="text-[11px] text-amber-300 mt-1">{stats.fours * 4 + stats.sixes * 6} Boundary Runs</div>
        </div>

        <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40">
          <div className="text-xs text-gray-400 font-semibold uppercase">Shots Tracked</div>
          <div className="text-2xl font-black font-mono text-blue-400">{stats.shots.length}</div>
          <div className="text-[11px] text-blue-300 mt-1">On Wagon Wheel</div>
        </div>
      </div>

      {/* Main Grid: 2D Wagon Wheel + Filtered Shot Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Wagon Wheel Display */}
        <div className="flex flex-col items-center justify-center p-3 bg-black/40 rounded-2xl border border-emerald-900/30">
          <WagonWheel2D
            stance={selectedPlayer?.battingHand || 'RHB'}
            shots={filteredShots}
            interactive={false}
          />
        </div>

        {/* Filter Controls & Zone Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase text-gray-300">Filter Shot Types</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
                filterType === 'all'
                  ? 'bg-emerald-500 text-black border-emerald-300'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}
            >
              All Shots ({stats.shots.length})
            </button>
            <button
              onClick={() => setFilterType('boundaries')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
                filterType === 'boundaries'
                  ? 'bg-amber-500 text-black border-amber-300'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}
            >
              Boundaries 4s/6s
            </button>
            <button
              onClick={() => setFilterType('singles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
                filterType === 'singles'
                  ? 'bg-blue-500 text-white border-blue-300'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}
            >
              Singles & 2s
            </button>
            <button
              onClick={() => setFilterType('dots')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border transition-all ${
                filterType === 'dots'
                  ? 'bg-gray-600 text-white border-gray-400'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}
            >
              Dots
            </button>
          </div>

          {/* Zone Distribution List */}
          <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-900/40 max-h-60 overflow-y-auto space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase mb-2">Stroke Location Breakdown</div>
            {filteredShots.length === 0 ? (
              <div className="text-xs text-gray-500 italic">No shots matching selected filter</div>
            ) : (
              filteredShots.map((shot, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-emerald-900/30">
                  <span className="font-semibold text-white">{shot.zone}</span>
                  <span className="font-mono text-emerald-300">
                    Angle: {shot.angleDeg}° • Dist: {Math.round(shot.distance * 100)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
