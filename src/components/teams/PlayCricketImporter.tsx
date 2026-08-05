'use client';

import React, { useState, useEffect } from 'react';
import { PlayCricketClient } from '@/services/playCricketApi';
import { PlayCricketConfig, PlayCricketMatchSummary } from '@/types/playCricket';
import { Player } from '@/types/cricket';
import { Shield, X, Download, CheckCircle, RefreshCw } from 'lucide-react';

interface PlayCricketImporterProps {
  isOpen: boolean;
  onClose: () => void;
  pcConfig: PlayCricketConfig;
  onImportFixture: (match: PlayCricketMatchSummary, players: Player[]) => void;
}

export function PlayCricketImporter({
  isOpen,
  onClose,
  pcConfig,
  onImportFixture,
}: PlayCricketImporterProps) {
  const [fixtures, setFixtures] = useState<PlayCricketMatchSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<PlayCricketMatchSummary | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const client = new PlayCricketClient(pcConfig);
      client.fetchFixtures().then(data => {
        setFixtures(data);
        if (data.length > 0) setSelectedMatch(data[0]);
        setLoading(false);
      });
    }
  }, [isOpen, pcConfig]);

  if (!isOpen) return null;

  const handleImport = async () => {
    if (!selectedMatch) return;
    setLoading(true);
    const client = new PlayCricketClient(pcConfig);
    const players = await client.fetchRoster(selectedMatch.home_team_id);
    onImportFixture(selectedMatch, players);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-5 border border-amber-500/40 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-amber-900/40 pb-3 mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-500" />
            ECB Play-Cricket Fixture Importer
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {pcConfig.isDemoMode && (
          <div className="bg-amber-950/60 border border-amber-500/30 rounded-xl p-3 mb-3 text-xs text-amber-300">
            <strong>Demo Mode Active:</strong> Showing sample Play-Cricket fixtures & registered rosters. You can configure your official club API credentials in Settings.
          </div>
        )}

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-xs font-semibold text-gray-400">Fetching Play-Cricket Fixtures...</span>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase text-gray-400 block">Select Fixture</label>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {fixtures.map(f => {
                const isSelected = selectedMatch?.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedMatch(f)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-black border-amber-300 font-bold shadow-md'
                        : 'bg-emerald-950/40 text-white border-emerald-900/40 hover:bg-emerald-900/50'
                    }`}
                  >
                    <div className="text-sm font-bold">{f.home_team_name} vs {f.away_team_name}</div>
                    <div className="text-xs opacity-80">{f.league_name} • {f.match_date} at {f.ground_name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-amber-900/40">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium border border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedMatch || loading}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-sm shadow-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Import Squad & Start
          </button>
        </div>
      </div>
    </div>
  );
}
