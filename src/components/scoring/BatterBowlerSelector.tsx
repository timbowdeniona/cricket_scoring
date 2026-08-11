'use client';

import React from 'react';
import { Player, Team } from '@/types/cricket';
import { X, UserCheck } from 'lucide-react';

interface BatterBowlerSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  players: Player[];
  activeId: string;
  onSelectPlayer: (id: string) => void;
}

export function BatterBowlerSelector({
  isOpen,
  onClose,
  title,
  players,
  activeId,
  onSelectPlayer,
}: BatterBowlerSelectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="batter-bowler-selector-title">
      <div className="glass-panel w-full max-w-md rounded-2xl p-5 border border-emerald-500/40 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3 mb-4">
          <h3 id="batter-bowler-selector-title" className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[48px] min-w-[48px] p-2 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {players.map(player => {
            const isSelected = player.id === activeId;
            return (
              <button
                type="button"
                key={player.id}
                onClick={() => {
                  onSelectPlayer(player.id);
                  onClose();
                }}
                aria-label={`Select player ${player.name}`}
                className={`w-full min-h-[48px] p-3 rounded-xl flex items-center justify-between text-left transition-all border focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  isSelected
                    ? 'bg-emerald-500 text-black border-emerald-300 font-bold shadow-md'
                    : 'bg-emerald-950/40 text-white border-emerald-900/40 hover:bg-emerald-900/60'
                }`}
              >
                <div>
                  <div className="text-base font-semibold">{player.name}</div>
                  <div className="text-xs opacity-75">
                    {player.battingHand} {player.bowlingStyle ? `• ${player.bowlingStyle}` : ''}
                  </div>
                </div>
                {player.isCaptain && <span className="text-[10px] uppercase font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded">C</span>}
                {player.isWicketKeeper && <span className="text-[10px] uppercase font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded ml-1">WK</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
