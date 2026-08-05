'use client';

import React, { useState } from 'react';
import { Team, Player, BattingHand, BowlingStyle } from '@/types/cricket';
import { Users, Plus, Trash2, Shield, UserCheck } from 'lucide-react';

interface TeamManagerProps {
  homeTeam: Team;
  awayTeam: Team;
  onUpdateTeams: (home: Team, away: Team) => void;
  onOpenPlayCricketImporter: () => void;
}

export function TeamManager({
  homeTeam,
  awayTeam,
  onUpdateTeams,
  onOpenPlayCricketImporter,
}: TeamManagerProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'away'>('home');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerHand, setNewPlayerHand] = useState<BattingHand>('RHB');
  const [newPlayerStyle, setNewPlayerStyle] = useState<BowlingStyle>('Right-arm Medium');

  const currentTeam = activeTab === 'home' ? homeTeam : awayTeam;

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: newPlayerName.trim(),
      battingHand: newPlayerHand,
      bowlingStyle: newPlayerStyle,
    };

    const updatedPlayers = [...currentTeam.players, newPlayer];
    if (activeTab === 'home') {
      onUpdateTeams({ ...homeTeam, players: updatedPlayers }, awayTeam);
    } else {
      onUpdateTeams(homeTeam, { ...awayTeam, players: updatedPlayers });
    }

    setNewPlayerName('');
  };

  const handleRemovePlayer = (id: string) => {
    const updatedPlayers = currentTeam.players.filter(p => p.id !== id);
    if (activeTab === 'home') {
      onUpdateTeams({ ...homeTeam, players: updatedPlayers }, awayTeam);
    } else {
      onUpdateTeams(homeTeam, { ...awayTeam, players: updatedPlayers });
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-emerald-900/40 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-emerald-900/30 pb-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            Team Squads & Playing XI
          </h2>
          <p className="text-xs text-emerald-400">Nominate players, batting stance (RHB/LHB), and captains</p>
        </div>

        <button
          onClick={onOpenPlayCricketImporter}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg flex items-center gap-1.5"
        >
          <Shield className="w-4 h-4" />
          Import Squad from Play-Cricket
        </button>
      </div>

      {/* Team Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all border ${
            activeTab === 'home'
              ? 'bg-emerald-500 text-black border-emerald-300 shadow'
              : 'bg-emerald-950/40 text-gray-400 border-emerald-900/40 hover:bg-emerald-900/50'
          }`}
        >
          {homeTeam.name} ({homeTeam.players.length})
        </button>
        <button
          onClick={() => setActiveTab('away')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all border ${
            activeTab === 'away'
              ? 'bg-emerald-500 text-black border-emerald-300 shadow'
              : 'bg-emerald-950/40 text-gray-400 border-emerald-900/40 hover:bg-emerald-900/50'
          }`}
        >
          {awayTeam.name} ({awayTeam.players.length})
        </button>
      </div>

      {/* Add Player Form */}
      <form onSubmit={handleAddPlayer} className="flex flex-col sm:flex-row gap-2 bg-black/40 p-3 rounded-xl border border-emerald-900/30">
        <input
          type="text"
          placeholder="Player Full Name"
          value={newPlayerName}
          onChange={e => setNewPlayerName(e.target.value)}
          className="flex-1 bg-emerald-950/80 border border-emerald-800/40 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400"
        />
        <select
          value={newPlayerHand}
          onChange={e => setNewPlayerHand(e.target.value as BattingHand)}
          className="bg-emerald-950/80 border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white font-semibold"
        >
          <option value="RHB">Right Handed (RHB)</option>
          <option value="LHB">Left Handed (LHB)</option>
        </select>
        <select
          value={newPlayerStyle}
          onChange={e => setNewPlayerStyle(e.target.value as BowlingStyle)}
          className="bg-emerald-950/80 border border-emerald-800/40 rounded-xl px-3 py-2 text-xs text-white font-semibold"
        >
          <option value="Right-arm Medium">Right-arm Medium</option>
          <option value="Right-arm Fast">Right-arm Fast</option>
          <option value="Right-arm Spin">Right-arm Spin</option>
          <option value="Left-arm Fast">Left-arm Fast</option>
          <option value="Left-arm Spin">Left-arm Spin</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1 shadow"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      {/* Players List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {currentTeam.players.map((player, idx) => (
          <div
            key={player.id}
            className="flex items-center justify-between bg-emerald-950/40 p-2 rounded-xl border border-emerald-900/30"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-mono text-xs text-emerald-400 font-bold w-5 shrink-0">{idx + 1}.</span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{player.name}</div>
                <div className="text-[10px] text-gray-400 truncate">
                  {player.battingHand} {player.bowlingStyle ? `• ${player.bowlingStyle}` : ''}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemovePlayer(player.id)}
              className="p-1 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-950/50 shrink-0 ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
