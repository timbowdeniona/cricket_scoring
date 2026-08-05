'use client';

import React, { useState } from 'react';
import { PlayCricketConfig } from '@/types/playCricket';
import { Settings, X, Save, Key } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pcConfig: PlayCricketConfig;
  onSaveConfig: (config: Partial<PlayCricketConfig>) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  pcConfig,
  onSaveConfig,
}: SettingsModalProps) {
  const [siteId, setSiteId] = useState(pcConfig.siteId || '');
  const [apiToken, setApiToken] = useState(pcConfig.apiToken || '');
  const [isDemoMode, setIsDemoMode] = useState(pcConfig.isDemoMode);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({ siteId, apiToken, isDemoMode });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-5 border border-emerald-500/40 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3 mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            Play-Cricket & Scoring Settings
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center justify-between bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40">
            <div>
              <div className="text-sm font-semibold text-white">Enable Demo Mode</div>
              <div className="text-xs text-gray-400">Use pre-loaded sample Play-Cricket data</div>
            </div>
            <input
              type="checkbox"
              checked={isDemoMode}
              onChange={e => setIsDemoMode(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Play-Cricket Site ID</label>
            <input
              type="text"
              placeholder="e.g. 10429"
              value={siteId}
              onChange={e => setSiteId(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-800/40 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Play-Cricket API Token</label>
            <div className="relative">
              <input
                type="password"
                placeholder="ECB Issued API Token"
                value={apiToken}
                onChange={e => setApiToken(e.target.value)}
                className="w-full bg-emerald-950/80 border border-emerald-800/40 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono"
              />
              <Key className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Contact <span className="text-emerald-400">play.cricket@ecb.co.uk</span> for official club API credentials.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-emerald-900/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium border border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
