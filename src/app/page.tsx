'use client';

import React, { useState } from 'react';
import { useMatchEngine } from '@/store/matchStore';
import { LiveHeader } from '@/components/scoring/LiveHeader';
import { QuickKeypad } from '@/components/scoring/QuickKeypad';
import { BatterBowlerSelector } from '@/components/scoring/BatterBowlerSelector';
import { WicketModal } from '@/components/scoring/WicketModal';
import { WagonWheel2D } from '@/components/ground/WagonWheel2D';
import { PitchMap2D } from '@/components/ground/PitchMap2D';
import { BatsmanInningsView } from '@/components/analytics/BatsmanInningsView';
import { Innings3DCanvas } from '@/components/simulation/Innings3DCanvas';
import { TeamManager } from '@/components/teams/TeamManager';
import { PlayCricketImporter } from '@/components/teams/PlayCricketImporter';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { MatchHistory } from '@/components/persistence/MatchHistory';

import {
  Target,
  Box,
  Users,
  Database,
  Settings,
  Shield,
  Activity,
  Award,
} from 'lucide-react';

export default function Home() {
  const {
    match,
    setMatch,
    pcConfig,
    updatePlayCricketConfig,
    savedMatches,
    loadSampleMatch,
    recordBall,
    undoLastBall,
    swapStrike,
    setStriker,
    setNonStriker,
    setBowler,
    saveCurrentMatchToHistory,
    exportMatchJson,
    importMatchJson,
  } = useMatchEngine();

  const [activeTab, setActiveTab] = useState<'scoring' | 'analytics' | 'simulation' | 'teams' | 'persistence'>('scoring');
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showStrikerModal, setShowStrikerModal] = useState(false);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showPlayCricketImporter, setShowPlayCricketImporter] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  if (!match) {
    return (
      <div className="min-h-screen bg-[#090f0c] text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <Activity className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-400">Loading Village Cricket Scorer...</p>
        </div>
      </div>
    );
  }

  const inn = match.innings[match.currentInningsIndex];
  const battingTeam = match.homeTeam.id === inn.battingTeamId ? match.homeTeam : match.awayTeam;
  const bowlingTeam = match.homeTeam.id === inn.bowlingTeamId ? match.homeTeam : match.awayTeam;

  const striker = battingTeam.players.find(p => p.id === inn.activeStrikerId);
  const nonStriker = battingTeam.players.find(p => p.id === inn.activeNonStrikerId);
  const availableBatters = battingTeam.players.filter(
    p => p.id !== inn.activeStrikerId && p.id !== inn.activeNonStrikerId
  );

  return (
    <main className="min-h-screen bg-[#090f0c] text-foreground p-3 sm:p-6 max-w-6xl mx-auto space-y-5 pb-16">
      {/* App Navigation Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel rounded-2xl p-4 border border-emerald-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg font-black text-black text-xl">
            🏏
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Village Cricket Scorer
              <span className="text-[10px] font-bold uppercase bg-emerald-500 text-black px-2 py-0.5 rounded-full">
                Tablet Ready PWA
              </span>
            </h1>
            <p className="text-xs text-emerald-400">Touch Field Scoring • Stroke Analytics • 3D Simulation</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPlayCricketImporter(true)}
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Shield className="w-4 h-4" />
            Play-Cricket Sync
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-black/40 p-1.5 rounded-2xl border border-emerald-900/30">
        <button
          onClick={() => setActiveTab('scoring')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'scoring'
              ? 'bg-emerald-500 text-black shadow-lg scale-[1.02]'
              : 'text-gray-400 hover:text-white hover:bg-emerald-950/40'
          }`}
        >
          <Activity className="w-4 h-4" />
          Live Scoring
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'analytics'
              ? 'bg-emerald-500 text-black shadow-lg scale-[1.02]'
              : 'text-gray-400 hover:text-white hover:bg-emerald-950/40'
          }`}
        >
          <Target className="w-4 h-4" />
          Batsman Stroke Location
        </button>

        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'simulation'
              ? 'bg-emerald-500 text-black shadow-lg scale-[1.02]'
              : 'text-gray-400 hover:text-white hover:bg-emerald-950/40'
          }`}
        >
          <Box className="w-4 h-4" />
          3D Innings Simulation
        </button>

        <button
          onClick={() => setActiveTab('teams')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'teams'
              ? 'bg-emerald-500 text-black shadow-lg scale-[1.02]'
              : 'text-gray-400 hover:text-white hover:bg-emerald-950/40'
          }`}
        >
          <Users className="w-4 h-4" />
          Teams & Squads
        </button>

        <button
          onClick={() => setActiveTab('persistence')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            activeTab === 'persistence'
              ? 'bg-emerald-500 text-black shadow-lg scale-[1.02]'
              : 'text-gray-400 hover:text-white hover:bg-emerald-950/40'
          }`}
        >
          <Database className="w-4 h-4" />
          Offline Data
        </button>
      </div>

      {/* Tab 1: Live Match Touch Scoring */}
      {activeTab === 'scoring' && (
        <div className="space-y-4">
          <LiveHeader
            match={match}
            onSwapStrike={swapStrike}
            onOpenBowlerChange={() => setShowBowlerModal(true)}
            onOpenBatterChange={() => setShowStrikerModal(true)}
          />

          <QuickKeypad
            onRecordBall={recordBall}
            onUndoLastBall={undoLastBall}
            onOpenWicketModal={() => setShowWicketModal(true)}
            strikerStance={striker?.battingHand || 'RHB'}
          />
        </div>
      )}

      {/* Tab 2: Batsman Innings Stroke Location Analysis */}
      {activeTab === 'analytics' && (
        <BatsmanInningsView innings={inn} players={battingTeam.players} />
      )}

      {/* Tab 3: 3D WebGL Trajectory Simulation */}
      {activeTab === 'simulation' && (
        <Innings3DCanvas innings={inn} players={battingTeam.players} />
      )}

      {/* Tab 4: Teams & Squads Management */}
      {activeTab === 'teams' && (
        <TeamManager
          homeTeam={match.homeTeam}
          awayTeam={match.awayTeam}
          onUpdateTeams={(home, away) => {
            setMatch({ ...match, homeTeam: home, awayTeam: away });
          }}
          onOpenPlayCricketImporter={() => setShowPlayCricketImporter(true)}
        />
      )}

      {/* Tab 5: Data Persistence & History */}
      {activeTab === 'persistence' && (
        <MatchHistory
          currentMatch={match}
          savedMatches={savedMatches}
          onLoadSampleMatch={loadSampleMatch}
          onExportJson={exportMatchJson}
          onImportJson={importMatchJson}
          onSaveToHistory={saveCurrentMatchToHistory}
        />
      )}

      {/* Modals */}
      <BatterBowlerSelector
        isOpen={showBowlerModal}
        onClose={() => setShowBowlerModal(false)}
        title="Select Bowler for Next Over"
        players={bowlingTeam.players}
        activeId={inn.activeBowlerId}
        onSelectPlayer={setBowler}
      />

      <BatterBowlerSelector
        isOpen={showStrikerModal}
        onClose={() => setShowStrikerModal(false)}
        title="Nominate Striker"
        players={availableBatters}
        activeId={inn.activeStrikerId}
        onSelectPlayer={setStriker}
      />

      <WicketModal
        isOpen={showWicketModal}
        onClose={() => setShowWicketModal(false)}
        striker={striker}
        nonStriker={nonStriker}
        fieldingPlayers={bowlingTeam.players}
        availableBatters={availableBatters}
        onConfirmWicket={(wicketInfo, newBatterId) => {
          recordBall(0, undefined, wicketInfo);
          if (newBatterId) setStriker(newBatterId);
        }}
      />

      <PlayCricketImporter
        isOpen={showPlayCricketImporter}
        onClose={() => setShowPlayCricketImporter(false)}
        pcConfig={pcConfig}
        onImportFixture={(summary, players) => {
          const updatedHome = { ...match.homeTeam, name: summary.home_club_name, players };
          const updatedAway = { ...match.awayTeam, name: summary.away_club_name };
          setMatch({ ...match, homeTeam: updatedHome, awayTeam: updatedAway, title: summary.league_name });
        }}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        pcConfig={pcConfig}
        onSaveConfig={updatePlayCricketConfig}
      />
    </main>
  );
}
