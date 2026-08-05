'use client';

import React, { useState } from 'react';
import { ExtrasType, ShotLocation, PitchLocation, BattingHand } from '@/types/cricket';
import { WagonWheel2D } from '../ground/WagonWheel2D';
import { PitchMap2D } from '../ground/PitchMap2D';
import { RotateCcw, AlertTriangle, ChevronDown, Check, X } from 'lucide-react';

interface QuickKeypadProps {
  onRecordBall: (
    runs: number,
    extras?: { type?: ExtrasType; runs: number },
    wicket?: any,
    shotLocation?: ShotLocation,
    pitchLocation?: PitchLocation
  ) => void;
  onUndoLastBall: () => void;
  onOpenWicketModal: () => void;
  strikerStance?: BattingHand;
}

export function QuickKeypad({
  onRecordBall,
  onUndoLastBall,
  onOpenWicketModal,
  strikerStance = 'RHB',
}: QuickKeypadProps) {
  const [selectedExtra, setSelectedExtra] = useState<ExtrasType | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const [pendingRuns, setPendingRuns] = useState<number>(0);
  const [pendingShotLocation, setPendingShotLocation] = useState<ShotLocation | null>(null);
  const [pendingPitchLocation, setPendingPitchLocation] = useState<PitchLocation | null>(null);

  const handleRunPress = (runs: number) => {
    setPendingRuns(runs);
    setPendingShotLocation(null);
    setPendingPitchLocation(null);
    setShowLocationPicker(true);
  };

  const handleConfirmBall = (skipLocation = false) => {
    let finalExtras: { type?: ExtrasType; runs: number } | undefined = undefined;
    if (selectedExtra) {
      // Wides and No Balls include +1 extra run by default
      const extraBase = (selectedExtra === 'wide' || selectedExtra === 'noBall') ? 1 : 0;
      finalExtras = { type: selectedExtra, runs: extraBase };
    }

    onRecordBall(
      pendingRuns,
      finalExtras,
      undefined,
      skipLocation ? undefined : (pendingShotLocation || undefined),
      skipLocation ? undefined : (pendingPitchLocation || undefined)
    );

    setSelectedExtra(null);
    setShowLocationPicker(false);
    setPendingShotLocation(null);
    setPendingPitchLocation(null);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 shadow-xl border border-emerald-900/40 mt-4">
      {/* Top Extras Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Scoring Controls</div>

        {/* Extras Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['wide', 'noBall', 'bye', 'legBye'] as ExtrasType[]).map(ext => {
            const isSelected = selectedExtra === ext;
            return (
              <button
                key={ext}
                onClick={() => setSelectedExtra(isSelected ? null : ext)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all shadow ${
                  isSelected
                    ? 'bg-amber-500 text-black border-2 border-amber-300 scale-105'
                    : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/50'
                }`}
              >
                {ext === 'wide' ? 'Wide (+1)' : ext === 'noBall' ? 'No Ball (+1)' : ext === 'bye' ? 'Bye' : 'Leg Bye'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Touch Keypad (0-6, Wicket, Undo) */}
      <div className="grid grid-cols-4 gap-3">
        {/* Runs 0 to 6 */}
        <button
          onClick={() => handleRunPress(0)}
          className="h-16 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-95 text-white font-mono text-2xl font-black border border-gray-600 shadow-md flex items-center justify-center"
        >
          0
        </button>
        <button
          onClick={() => handleRunPress(1)}
          className="h-16 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 active:scale-95 text-emerald-200 font-mono text-2xl font-black border border-emerald-700/50 shadow-md flex items-center justify-center"
        >
          1
        </button>
        <button
          onClick={() => handleRunPress(2)}
          className="h-16 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 active:scale-95 text-emerald-200 font-mono text-2xl font-black border border-emerald-700/50 shadow-md flex items-center justify-center"
        >
          2
        </button>
        <button
          onClick={() => handleRunPress(3)}
          className="h-16 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/80 active:scale-95 text-emerald-200 font-mono text-2xl font-black border border-emerald-700/50 shadow-md flex items-center justify-center"
        >
          3
        </button>

        <button
          onClick={() => handleRunPress(4)}
          className="h-16 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-black font-mono text-3xl font-black border-2 border-amber-300 shadow-lg flex items-center justify-center"
        >
          4
        </button>
        <button
          onClick={() => handleRunPress(6)}
          className="h-16 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-mono text-3xl font-black border-2 border-amber-200 shadow-lg flex items-center justify-center"
        >
          6
        </button>

        {/* Wicket Button */}
        <button
          onClick={onOpenWicketModal}
          className="h-16 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-lg border-2 border-rose-400 shadow-lg flex items-center justify-center gap-1.5"
        >
          <AlertTriangle className="w-5 h-5" />
          OUT
        </button>

        {/* Undo Button */}
        <button
          onClick={onUndoLastBall}
          className="h-16 rounded-xl bg-gray-900 hover:bg-gray-800 active:scale-95 text-gray-300 font-semibold text-sm border border-gray-700 shadow-md flex flex-col items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 mb-0.5 text-amber-400" />
          Undo
        </button>
      </div>

      {/* Shot & Pitch Location Modal Popup */}
      {showLocationPicker && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl rounded-2xl p-5 border border-emerald-500/40 shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95">
            <div className="w-full flex items-center justify-between border-b border-emerald-900/40 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Record Ball Placement</span>
                  <span className="bg-emerald-500 text-black px-2 py-0.5 rounded text-sm font-mono font-black">
                    +{pendingRuns} runs
                  </span>
                  {selectedExtra && (
                    <span className="bg-amber-500 text-black px-2 py-0.5 rounded text-xs font-bold uppercase">
                      {selectedExtra}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-emerald-400">Tap where the ball went on the ground & pitch map</p>
              </div>
              <button
                onClick={() => setShowLocationPicker(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Side-by-side 2D Wagon Wheel & Pitch Map */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full items-center justify-items-center">
              <WagonWheel2D
                stance={strikerStance}
                selectedLocation={pendingShotLocation}
                onSelectLocation={setPendingShotLocation}
                interactive={true}
              />
              <PitchMap2D
                selectedLocation={pendingPitchLocation}
                onSelectPitchLocation={setPendingPitchLocation}
              />
            </div>

            {/* Action Buttons */}
            <div className="w-full flex items-center justify-end gap-3 mt-6 pt-4 border-t border-emerald-900/40">
              <button
                onClick={() => handleConfirmBall(true)}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium border border-gray-600"
              >
                Skip Location
              </button>
              <button
                onClick={() => handleConfirmBall(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirm Ball
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
