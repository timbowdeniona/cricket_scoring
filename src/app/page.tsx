'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useMatchEngine } from '@/store/matchStore';
import { MalpasTeamId, MalpasFixture, MalpasPlayerStats } from '@/types/malpas';
import { MalpasScraperClient } from '@/services/malpasScraper';
import { MALPAS_FIXTURES, MALPAS_PLAYER_STATS } from '@/services/malpasData';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';

import { MalpasHeroBanner } from '@/components/portal/MalpasHeroBanner';
import { FixturesResultsView } from '@/components/portal/FixturesResultsView';
import { NewsFeedView } from '@/components/portal/NewsFeedView';
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
  Newspaper,
} from 'lucide-react';

type TabType = 'fixtures' | 'news' | 'stats' | 'history' | 'scoring' | 'reports' | 'teams' | 'simulation';

const VALID_TABS: TabType[] = ['fixtures', 'news', 'stats', 'history', 'scoring', 'reports', 'teams', 'simulation'];

function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tabParam = searchParams.get('tab') as TabType;
    return tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'fixtures';
  });

  const [fixtures, setFixtures] = useState<MalpasFixture[]>(MALPAS_FIXTURES);
  const [stats, setStats] = useState<MalpasPlayerStats[]>(MALPAS_PLAYER_STATS);

  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showStrikerModal, setShowStrikerModal] = useState(false);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showPlayCricketImporter, setShowPlayCricketImporter] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Sync activeTab with URL ?tab= parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && VALID_TABS.includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (!tabParam) {
      setActiveTab('fixtures');
    }
  }, [searchParams]);

  // Fetch fixtures & stats via Malpas scraper client
  useEffect(() => {
    const client = new MalpasScraperClient();
    client.getFixtures(selectedTeamId).then(data => setFixtures(data));
    client.getPlayerStats(selectedTeamId).then(data => setStats(data));
  }, [selectedTeamId]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    trackEvent('tab_view', { tab_name: tab, team_id: selectedTeamId });
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTeamChange = (teamId: MalpasTeamId) => {
    setSelectedTeamId(teamId);
    trackEvent('team_select', { team_id: teamId });
  };

  if (!match || !match.innings || !match.innings[match.currentInningsIndex] || !match.homeTeam || !match.awayTeam) {
    return (
      <div className="min-h-screen bg-malpas-navy text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Activity className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-300">Loading Malpas CC Portal...</p>
        </div>
      </div>
    );
  }

  const inn = match.innings[match.currentInningsIndex];
  const battingTeam = match.homeTeam.id === inn?.battingTeamId ? match.homeTeam : match.awayTeam;
  const bowlingTeam = match.homeTeam.id === inn?.bowlingTeamId ? match.homeTeam : match.awayTeam;

  const striker = battingTeam?.players?.find(p => p.id === inn?.activeStrikerId);
  const nonStriker = battingTeam?.players?.find(p => p.id === inn?.activeNonStrikerId);
  const availableBatters = (battingTeam?.players || []).filter(
    p => p.id !== inn?.activeStrikerId && p.id !== inn?.activeNonStrikerId
  );

  return (
    <main className="min-h-screen bg-malpas-navy text-foreground p-3 sm:p-6 max-w-6xl mx-auto space-y-5 pb-16">
      {/* Malpas CC Hero Header */}
      <MalpasHeroBanner selectedTeamId={selectedTeamId} onSelectTeam={handleTeamChange} />

      {/* Main Tab Navigation Bar */}
      <div className="grid grid-cols-2 xs:grid-cols-4 sm:flex sm:flex-wrap md:flex-nowrap items-center gap-2 bg-black/40 p-2 rounded-2xl border border-malpas-blue/30">
        <button
          onClick={() => handleTabChange('fixtures')}
          className={`min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all w-full sm:w-auto sm:flex-1 ${
            activeTab === 'fixtures'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30 border border-transparent'
          }`}
        >
          <Calendar className="w-4.5 h-4.5 text-amber-400 shrink-0" />
          <span className="whitespace-nowrap">Home & Fixtures</span>
        </button>

        <button
          onClick={() => handleTabChange('news')}
          className={`min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all w-full sm:w-auto sm:flex-1 ${
            activeTab === 'news'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30 border border-transparent'
          }`}
        >
          <Newspaper className="w-4.5 h-4.5 text-amber-400 shrink-0" />
          <span className="whitespace-nowrap">News Feed</span>
        </button>

        <button
          onClick={() => handleTabChange('stats')}
          className={`min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all w-full sm:w-auto sm:flex-1 ${
            activeTab === 'stats'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30 border border-transparent'
          }`}
        >
          <BarChart3 className="w-4.5 h-4.5 text-amber-400 shrink-0" />
          <span className="whitespace-nowrap">Player Stats</span>
        </button>

        <button
          onClick={() => handleTabChange('history')}
          className={`min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all w-full sm:w-auto sm:flex-1 ${
            activeTab === 'history'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30 border border-transparent'
          }`}
        >
          <Trophy className="w-4.5 h-4.5 text-amber-400 shrink-0" />
          <span className="whitespace-nowrap">Club History</span>
        </button>

        <button
          onClick={() => handleTabChange('scoring')}
          className={`min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all w-full sm:w-auto sm:flex-1 ${
            activeTab === 'scoring'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30 border border-transparent'
          }`}
        >
          <Activity className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
          <span className="whitespace-nowrap">Live Scoring</span>
        </button>

        <button
          onClick={() => handleTabChange('reports')}
          className={`min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all w-full sm:w-auto sm:flex-1 ${
            activeTab === 'reports'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30 border border-transparent'
          }`}
        >
          <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
          <span className="whitespace-nowrap">Reports</span>
        </button>

        <button
          onClick={() => handleTabChange('simulation')}
          className={`min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all w-full sm:w-auto sm:flex-1 ${
            activeTab === 'simulation'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30 border border-transparent'
          }`}
        >
          <Box className="w-4.5 h-4.5 text-blue-400 shrink-0" />
          <span className="whitespace-nowrap">3D Innings</span>
        </button>

        <button
          onClick={() => handleTabChange('teams')}
          className={`min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all col-span-2 xs:col-span-1 sm:col-span-auto w-full sm:w-auto sm:flex-1 ${
            activeTab === 'teams'
              ? 'bg-malpas-blue text-white shadow-lg scale-[1.02] border border-blue-400'
              : 'text-gray-300 hover:text-white hover:bg-malpas-blue/30 border border-transparent'
          }`}
        >
          <Users className="w-4.5 h-4.5 text-purple-400 shrink-0" />
          <span className="whitespace-nowrap">Squads</span>
        </button>
      </div>

      {/* Tab 1: Home Landing View (News Feed Stream + Fixtures & Scorecards) */}
      {activeTab === 'fixtures' && (
        <div className="space-y-6">
          <NewsFeedView selectedTeamId={selectedTeamId} />
          <FixturesResultsView fixtures={fixtures} selectedTeamId={selectedTeamId} />
        </div>
      )}

      {/* Standalone News Feed Tab */}
      {activeTab === 'news' && (
        <NewsFeedView selectedTeamId={selectedTeamId} />
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

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-malpas-navy text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Activity className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <p className="text-sm font-bold text-gray-300">Loading Malpas CC Portal...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
