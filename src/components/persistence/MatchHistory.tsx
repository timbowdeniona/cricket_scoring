'use client';

import React, { useState } from 'react';
import { Match } from '@/types/cricket';
import { Database, Download, Upload, RefreshCw, FileText, Check } from 'lucide-react';

interface MatchHistoryProps {
  currentMatch: Match | null;
  savedMatches: Match[];
  onLoadSampleMatch: () => void;
  onExportJson: () => string;
  onImportJson: (json: string) => void;
  onSaveToHistory: () => void;
}

export function MatchHistory({
  currentMatch,
  savedMatches,
  onLoadSampleMatch,
  onExportJson,
  onImportJson,
  onSaveToHistory,
}: MatchHistoryProps) {
  const [importText, setImportText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const jsonStr = onExportJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `match_${currentMatch?.id || 'scorecard'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    const jsonStr = onExportJson();
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-emerald-900/40 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-emerald-900/30 pb-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-400" />
            Data Persistence & Match History
          </h2>
          <p className="text-xs text-emerald-400">Save offline to IndexedDB, export scorecards, or reset demo match</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLoadSampleMatch}
            className="px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            Reload Demo Match
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={onSaveToHistory}
          className="p-3 bg-emerald-950/60 hover:bg-emerald-900/60 rounded-xl border border-emerald-800/40 text-left transition-all"
        >
          <div className="text-xs font-bold text-emerald-400 uppercase">Local Storage</div>
          <div className="text-sm font-bold text-white mt-1">Save Current Match</div>
          <div className="text-[11px] text-gray-400 mt-0.5">Persist match to offline IndexedDB</div>
        </button>

        <button
          onClick={handleCopyJson}
          className="p-3 bg-emerald-950/60 hover:bg-emerald-900/60 rounded-xl border border-emerald-800/40 text-left transition-all"
        >
          <div className="text-xs font-bold text-emerald-400 uppercase">Export Clipboard</div>
          <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <FileText className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Scorecard JSON'}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">Raw JSON with 3D trajectories</div>
        </button>

        <button
          onClick={() => setShowImportArea(!showImportArea)}
          className="p-3 bg-emerald-950/60 hover:bg-emerald-900/60 rounded-xl border border-emerald-800/40 text-left transition-all"
        >
          <div className="text-xs font-bold text-emerald-400 uppercase">Import Data</div>
          <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
            <Upload className="w-4 h-4" />
            Import Match JSON
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">Paste match JSON to restore state</div>
        </button>
      </div>

      {/* Import Area */}
      {showImportArea && (
        <div className="bg-black/50 p-4 rounded-xl border border-emerald-800/40 space-y-3">
          <textarea
            rows={4}
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder="Paste Match JSON payload here..."
            className="w-full bg-emerald-950/80 border border-emerald-800/40 rounded-xl p-3 text-xs text-emerald-200 font-mono focus:outline-none focus:border-emerald-400"
          />
          <button
            onClick={() => {
              if (importText.trim()) {
                onImportJson(importText.trim());
                setShowImportArea(false);
                setImportText('');
              }
            }}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
          >
            Load Match from JSON
          </button>
        </div>
      )}
    </div>
  );
}
