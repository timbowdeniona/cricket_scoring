'use client';

import React, { useState } from 'react';
import { MalpasFixture, MalpasTeamId } from '@/types/malpas';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { SocialShareButtons } from '@/components/scoring/SocialShareButtons';

interface FixturesResultsViewProps {
  fixtures: MalpasFixture[];
  selectedTeamId: MalpasTeamId;
}

export function FixturesResultsView({ fixtures, selectedTeamId }: FixturesResultsViewProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed'>('all');

  const teamFixtures = fixtures.filter(f => {
    if (f.teamId !== selectedTeamId) return false;
    if (filterStatus === 'upcoming') return f.status === 'upcoming';
    if (filterStatus === 'completed') return f.status === 'completed';
    return true;
  });

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-malpas-blue/40 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-malpas-blue/30 pb-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-400" />
            Fixtures & Completed Match Results
          </h2>
          <p className="text-xs text-gray-300">Cheshire League & Cup scorecards for Malpas CC</p>
        </div>

        {/* Filter Status Buttons */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-malpas-blue/30">
          {(['all', 'upcoming', 'completed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                filterStatus === st
                  ? 'bg-malpas-blue text-white border border-blue-400 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Fixtures List */}
      <div className="space-y-3">
        {teamFixtures.length === 0 ? (
          <div className="py-10 text-center text-sm font-semibold text-gray-400">
            No match fixtures matching selected filter.
          </div>
        ) : (
          teamFixtures.map(f => (
            <div
              key={f.id}
              className="bg-malpas-navy/80 hover:bg-malpas-dark p-4 rounded-xl border border-malpas-blue/30 shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-malpas-blue/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase bg-malpas-blue/60 text-blue-200 px-2 py-0.5 rounded border border-blue-400/30">
                    {f.competition}
                  </span>
                  <span className="text-xs font-semibold text-gray-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {f.date} at {f.time}
                  </span>
                </div>
                <span
                  className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    f.status === 'completed'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {f.status}
                </span>
              </div>

              {/* Match Opponents & Score */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div>
                  <div className="text-base font-bold text-white">
                    Malpas CC vs <span className="text-amber-300">{f.opponent}</span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {f.venue === 'Home' ? 'Home ground' : 'Away'} • {f.ground}
                  </div>
                </div>

                {f.status === 'completed' && (
                  <div className="text-right bg-black/40 px-3 py-2 rounded-xl border border-emerald-500/30">
                    <div className="text-xs font-bold text-emerald-400">{f.resultText}</div>
                    <div className="text-sm font-mono font-bold text-white mt-0.5">
                      {f.malpasScore} • {f.opponentScore}
                    </div>
                  </div>
                )}
              </div>

              {/* 1-Click Social Media Share for Scorecard */}
              <div className="pt-2 border-t border-malpas-blue/20 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-gray-400">Share Scorecard</span>
                <SocialShareButtons
                  matchTitle={f.competition}
                  battingTeamName="Malpas CC"
                  bowlingTeamName={f.opponent}
                  totalRuns={f.malpasScore ? parseInt(f.malpasScore.split('-')[0]) || 0 : 0}
                  wickets={f.malpasScore && f.malpasScore.includes('-') ? parseInt(f.malpasScore.split('-')[1]) || 0 : 0}
                  oversCompleted={40}
                  ballsInCurrentOver={0}
                  venue={f.ground}
                  customText={`🏏 *Malpas CC Match Result* 🏏\n🏆 ${f.competition}\n⚔️ Malpas CC vs ${f.opponent}\n📊 Score: ${f.malpasScore || 'N/A'} vs ${f.opponentScore || 'N/A'}\n✨ Result: ${f.resultText || f.status}\n📍 ${f.ground}\n\nView scorecard on Malpas CC Portal: https://malpas.play-cricket.com`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
