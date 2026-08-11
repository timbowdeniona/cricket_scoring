'use client';

import React, { useState } from 'react';
import { Player, WicketType, WicketInfo } from '@/types/cricket';
import { AlertTriangle, X, Check } from 'lucide-react';

interface WicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  striker: Player | undefined;
  nonStriker: Player | undefined;
  fieldingPlayers: Player[];
  onConfirmWicket: (wicketInfo: WicketInfo, newBatterId?: string) => void;
  availableBatters: Player[];
}

const WICKET_TYPES: { type: WicketType; label: string; needsFielder: boolean }[] = [
  { type: 'bowled', label: 'Bowled', needsFielder: false },
  { type: 'caught', label: 'Caught', needsFielder: true },
  { type: 'lbw', label: 'LBW', needsFielder: false },
  { type: 'runOut', label: 'Run Out', needsFielder: true },
  { type: 'stumped', label: 'Stumped', needsFielder: true },
  { type: 'hitWicket', label: 'Hit Wicket', needsFielder: false },
];

export function WicketModal({
  isOpen,
  onClose,
  striker,
  nonStriker,
  fieldingPlayers,
  onConfirmWicket,
  availableBatters,
}: WicketModalProps) {
  const [selectedType, setSelectedType] = useState<WicketType>('caught');
  const [dismissedId, setDismissedId] = useState<string>(striker?.id || '');
  const [selectedFielderId, setSelectedFielderId] = useState<string>('');
  const [nextBatterId, setNextBatterId] = useState<string>(availableBatters[0]?.id || '');

  if (!isOpen) return null;

  const currentWicketType = WICKET_TYPES.find(w => w.type === selectedType);

  const handleSubmit = () => {
    onConfirmWicket(
      {
        type: selectedType,
        playerDismissedId: dismissedId || striker?.id || '',
        fielderId: currentWicketType?.needsFielder ? selectedFielderId : undefined,
      },
      nextBatterId
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="wicket-modal-title">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-5 border border-rose-500/40 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-rose-900/40 pb-3 mb-4">
          <h3 id="wicket-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
            Record Wicket / Dismissal
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[48px] min-w-[48px] p-2 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Dismissed Player Switcher */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-400 block mb-1.5">Batter Dismissed</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDismissedId(striker?.id || '')}
                aria-label={`Dismiss ${striker?.name || 'Striker'} (Striker)`}
                className={`min-h-[48px] p-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center ${
                  dismissedId === striker?.id
                    ? 'bg-rose-600 text-white border-rose-400 shadow'
                    : 'bg-emerald-950/40 text-gray-300 border-emerald-900/40'
                }`}
              >
                {striker?.name} (Striker)
              </button>
              <button
                type="button"
                onClick={() => setDismissedId(nonStriker?.id || '')}
                aria-label={`Dismiss ${nonStriker?.name || 'Non-Striker'} (Non-Striker)`}
                className={`min-h-[48px] p-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center ${
                  dismissedId === nonStriker?.id
                    ? 'bg-rose-600 text-white border-rose-400 shadow'
                    : 'bg-emerald-950/40 text-gray-300 border-emerald-900/40'
                }`}
              >
                {nonStriker?.name} (Non-Striker)
              </button>
            </div>
          </div>

          {/* Dismissal Type Selector */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-400 block mb-1.5">Dismissal Type</label>
            <div className="grid grid-cols-3 gap-2">
              {WICKET_TYPES.map(wt => (
                <button
                  key={wt.type}
                  type="button"
                  onClick={() => setSelectedType(wt.type)}
                  aria-label={`Dismissal type: ${wt.label}`}
                  className={`min-h-[48px] p-2 rounded-xl text-xs font-bold uppercase border transition-all flex items-center justify-center ${
                    selectedType === wt.type
                      ? 'bg-rose-600 text-white border-rose-300 shadow-md scale-105'
                      : 'bg-gray-800/80 text-gray-300 border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  {wt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fielder Selector (if applicable) */}
          {currentWicketType?.needsFielder && (
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 block mb-1.5">Fielder / Keeper</label>
              <select
                value={selectedFielderId}
                onChange={e => setSelectedFielderId(e.target.value)}
                aria-label="Select Fielder or Wicket Keeper"
                className="w-full min-h-[48px] bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-white text-sm font-semibold focus:outline-none focus:border-rose-500"
              >
                <option value="">Select Fielder (or C&B / Keeper)</option>
                {fieldingPlayers.map(fp => (
                  <option key={fp.id} value={fp.id}>
                    {fp.name} {fp.isWicketKeeper ? '(WK)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Next Batsman Nomination */}
          {availableBatters.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 block mb-1.5">Next Batsman In</label>
              <select
                value={nextBatterId}
                onChange={e => setNextBatterId(e.target.value)}
                aria-label="Select Next Batsman In"
                className="w-full min-h-[48px] bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500"
              >
                {availableBatters.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.battingHand})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-rose-900/40">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel wicket recording"
            className="min-h-[48px] px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            aria-label="Confirm dismissal"
            className="min-h-[48px] px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <Check className="w-4 h-4" />
            Confirm Dismissal
          </button>
        </div>
      </div>
    </div>
  );
}
