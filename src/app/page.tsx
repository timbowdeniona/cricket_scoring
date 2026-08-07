'use client';

import React, { useState, useEffect } from 'react';
import { useMatchEngine } from '@/store/matchStore';
import { MalpasTeamId, MalpasFixture, MalpasPlayerStats } from '@/types/malpas';
import { MalpasScraperClient } from '@/services/malpasScraper';
import { MALPAS_FIXTURES, MALPAS_PLAYER_STATS } from '@/services/malpasData';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

import { MalpasHeroBanner } from '@/components/portal/MalpasHeroBanner';
import { FixturesResultsView } from '@/components/portal/FixturesResultsView';
import { PlayerStatsView } from '@/components/portal/PlayerStatsView';
import { ClubHistoryView } from '@/components/portal/ClubHistoryView';

import { LiveHeader } from '@/components/scoring/LiveHeader';
import { QuickKeypad } from '@/components/scoring/QuickKeypad';
import { BatterBowlerSelector } from '@/components/scoring/BatterBowlerSelector';
import { WicketModal } from '@/components/scoring/WicketModal';
import { BatsmanInningsView } from '@/components/analytics/BatsmanInningsView';
import { MatchReportingView } from '@/components/analytics/MatchReportingView';
import { Innings3DCanvas } from '@/components/simulation/Innings3DCanvas';
import { TeamManager } from '@/components/teams/TeamManager';
import { PlayCricketImporter } from '@/components/teams/PlayCricketImporter';
import { SettingsModal } from '@/components/settings/SettingsModal';

import {
  Activity,
  Calendar,
  BarChart3,
  Trophy,
  Users,
  Box,
  FileSpreadsheet,
} from 'lucide-react';

export default function Home() {
  const {
    match,
    setMatch,
    pcConfig,
    updatePlayCricketConfig,
    recordBall,
    undoLastBall,
    swapStrike,
    setStriker,
    setBowler,
  } = useMatchEngine();

  const [selectedTeamId, setSelectedTeamId] = useState<MalpasTeamId>('1st_xi');
  const [activeTab, setActiveTab] = useState<'fixtures' | 'stats' | 'history' | 'scoring' | 'reports' | 'teams' | 'simulation'>('fixtures');

  const [fixtures, setFixtures] = useState<MalpasFixture[]>(MALPAS_FIXTURES);
  const [stats, setStats] = useState<MalpasPlayerStats[]>(MALPAS_PLAYER_STATS);

  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showStrikerModal, setShowStrikerModal] = useState(false);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showPlayCricketImporter, setShowPlayCricketImporter] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Fetch fixtures & stats via Malpas scraper client
  useEffect(() => {
    const client = new MalpasScraperClient();
    client.getFixtures(selectedTeamId).then(data => setFixtures(data));
    client.getPlayerStats(selectedTeamId).then(data => setStats(data));
  }, [selectedTeamId]);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    trackEvent('tab_view', { tab_name: tab, team_id: selectedTeamId });
  };

  const handleTeamChange = (teamId: MalpasTeamId) => {
    setSelectedTeamId(teamId);
    trackEvent('team_select', { team_id: teamId });
  };

  if (!match) {
    return (
      <div className="min-h-screen bg-malpas-navy text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <Activity className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-300">Loading Malpas CC Portal...</p>
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
    <main className="min-h-screen bg-malpas-navy text-foreground p-3 sm:p-6 max-w-6xl mx-auto space-y-5 pb-16">
      {/* Malpas CC Hero Header */}
      <MalpasHeroBanner selectedTeamId={selectedTeamId} onSelectTeam={handleTeamChange} />

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-black/40 p-1.5 rounded-2xl border border-malpas-blue/30">
        <button
          onClick={() => handleTabChange('fixtures')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 ${
            activeTab === 'fixtures'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          Fixtures & Results
        </button>

        <button
          onClick={() => handleTabChange('stats')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 ${
            activeTab === 'stats'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-400" />
          Player Stats
        </button>

        <button
          onClick={() => handleTabChange('history')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 ${
            activeTab === 'history'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          Club History
        </button>

        <button
          onClick={() => handleTabChange('scoring')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 ${
            activeTab === 'scoring'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          Live Scoring
        </button>

        <button
          onClick={() => handleTabChange('reports')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 ${
            activeTab === 'reports'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          Reports
        </button>

        <button
          onClick={() => handleTabChange('simulation')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 ${
            activeTab === 'simulation'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30'
          }`}
        >
          <Box className="w-4 h-4 text-blue-400" />
          3D Innings
        </button>

        <button
          onClick={() => handleTabChange('teams')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 ${
            activeTab === 'teams'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30'
          }`}
        >
          <Users className="w-4 h-4 text-purple-400" />
          Squads
        </button>
      </div>

      {/* Tab 1: Fixtures & Scorecards */}
      {activeTab === 'fixtures' && (
        <FixturesResultsView fixtures={fixtures} selectedTeamId={selectedTeamId} />
      )}

      {/* Tab 2: Player Statistics */}
      {activeTab === 'stats' && (
        <PlayerStatsView stats={stats} selectedTeamId={selectedTeamId} />
      )}

      {/* Tab 3: Club History & Honors */}
      {activeTab === 'history' && (
        <ClubHistoryView />
      )}

      {/* Tab 4: Live Scoring */}
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

          <BatsmanInningsView innings={inn} players={battingTeam.players} />
        </div>
      )}

      {/* Tab 5: Reports & CSV Export */}
      {activeTab === 'reports' && (
        <MatchReportingView innings={inn} players={battingTeam.players} />
      )}

      {/* Tab 6: 3D Innings Simulation */}
      {activeTab === 'simulation' && (
        <Innings3DCanvas innings={inn} players={battingTeam.players} />
      )}

      {/* Tab 7: Squad Manager */}
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
