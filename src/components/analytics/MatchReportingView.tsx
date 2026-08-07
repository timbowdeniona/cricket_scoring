'use client';

import React from 'react';
import { Innings, Player } from '@/types/cricket';
import { FileSpreadsheet, Download, Share2, Printer, BarChart2, PieChart } from 'lucide-react';
import { trackEvent } from './GoogleAnalytics';

interface MatchReportingViewProps {
  innings: Innings;
  players: Player[];
}

export function MatchReportingView({ innings, players }: MatchReportingViewProps) {
  const totalBalls = innings.overs.reduce((acc, o) => acc + o.balls.length, 0);
  const totalFours = innings.overs.flatMap(o => o.balls).filter(b => b.runs === 4).length;
  const totalSixes = innings.overs.flatMap(o => o.balls).filter(b => b.runs === 6).length;
  const dotBalls = innings.overs.flatMap(o => o.balls).filter(b => b.totalRuns === 0).length;

  const handleExportCsv = () => {
    trackEvent('export_match_csv', { total_runs: innings.totalRuns, wickets: innings.wickets });

    const rows = [
      ['Over', 'Ball', 'Striker', 'Bowler', 'Runs', 'Extras', 'Wicket', 'Shot Zone'],
      ...innings.overs.flatMap(o =>
        o.balls.map(b => [
          b.overNumber,
          b.ballNumberInOver,
          players.find(p => p.id === b.strikerId)?.name || b.strikerId,
          b.bowlerId,
          b.runs,
          b.extras?.runs || 0,
          b.wicket ? b.wicket.type : '',
          b.shotLocation?.zone || '',
        ])
      ),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `malpas_cc_innings_${innings.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-malpas-blue/40 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-malpas-blue/30 pb-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-amber-400" />
            Match Analytics & Export Reporting
          </h2>
          <p className="text-xs text-gray-300">Detailed boundary ratios, dot ball percentages, and CSV ball-by-ball export</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => {
              trackEvent('print_match_report');
              window.print();
            }}
            className="px-3.5 py-2 rounded-xl bg-malpas-blue hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all border border-blue-400/40"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-malpas-navy/80 p-3 rounded-xl border border-malpas-blue/30 text-center">
          <div className="text-[10px] font-bold uppercase text-gray-400">Total Score</div>
          <div className="text-xl font-black font-mono text-amber-400">
            {innings.totalRuns} / {innings.wickets}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">{innings.oversCompleted}.{innings.ballsInCurrentOver} overs</div>
        </div>

        <div className="bg-malpas-navy/80 p-3 rounded-xl border border-malpas-blue/30 text-center">
          <div className="text-[10px] font-bold uppercase text-gray-400">Boundaries</div>
          <div className="text-xl font-black font-mono text-emerald-400">
            {totalFours}×4s | {totalSixes}×6s
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {totalFours * 4 + totalSixes * 6} boundary runs
          </div>
        </div>

        <div className="bg-malpas-navy/80 p-3 rounded-xl border border-malpas-blue/30 text-center">
          <div className="text-[10px] font-bold uppercase text-gray-400">Dot Ball Ratio</div>
          <div className="text-xl font-black font-mono text-blue-300">
            {totalBalls > 0 ? Math.round((dotBalls / totalBalls) * 100) : 0}%
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">{dotBalls} of {totalBalls} balls</div>
        </div>

        <div className="bg-malpas-navy/80 p-3 rounded-xl border border-malpas-blue/30 text-center">
          <div className="text-[10px] font-bold uppercase text-gray-400">Run Rate</div>
          <div className="text-xl font-black font-mono text-purple-300">
            {innings.oversCompleted > 0
              ? (innings.totalRuns / (innings.oversCompleted + innings.ballsInCurrentOver / 6)).toFixed(2)
              : '0.00'}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">runs per over</div>
        </div>
      </div>
    </div>
  );
}
