'use client';

import React from 'react';
import { MalpasTeamId } from '@/types/malpas';
import { MALPAS_TEAMS } from '@/services/malpasData';
import { MapPin, Shield, Trophy, Users, Calendar } from 'lucide-react';

interface MalpasHeroBannerProps {
  selectedTeamId: MalpasTeamId;
  onSelectTeam: (teamId: MalpasTeamId) => void;
}

export function MalpasHeroBanner({ selectedTeamId, onSelectTeam }: MalpasHeroBannerProps) {
  const currentTeam = MALPAS_TEAMS[selectedTeamId];

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-malpas-blue/40 shadow-2xl relative overflow-hidden tie-stripe-bg">
      {/* Background Stadium Photo */}
      <img
        src="/images/hero_cricket_match.jpg"
        alt="Malpas Cricket Stadium"
        className="absolute inset-0 w-full h-full object-cover opacity-25 rounded-2xl pointer-events-none"
      />

      {/* Background Smooth Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-malpas-navy via-malpas-navy/80 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Left: Crest & Club Branding */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-malpas-navy border-2 border-malpas-blue/60 p-2 shadow-2xl shrink-0 flex items-center justify-center">
            <img
              src="/badge.jpg"
              alt="Malpas CC Crest M.D.S.C."
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider bg-malpas-blue/80 text-white px-2.5 py-0.5 rounded-full border border-blue-400/30">
                Cheshire Cricket League
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-500/90 text-black px-2.5 py-0.5 rounded-full">
                M.D.S.C. 1924
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Malpas Cricket Club
            </h1>
            <p className="text-xs text-gray-300 flex items-center justify-center md:justify-start gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              The Recreation Ground, Wrexham Road, Malpas, Cheshire (SY14 8ER)
            </p>
          </div>
        </div>

        {/* Right: Team Selection Switcher */}
        <div className="w-full md:w-auto bg-black/40 p-1.5 rounded-2xl border border-malpas-blue/30 flex flex-col sm:flex-row gap-1.5">
          {(['1st_xi', '2nd_xi', 'sunday_xi'] as MalpasTeamId[]).map(tId => {
            const team = MALPAS_TEAMS[tId];
            const isSelected = selectedTeamId === tId;
            return (
              <button
                key={tId}
                onClick={() => onSelectTeam(tId)}
                className={`min-h-[48px] px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border ${
                  isSelected
                    ? 'bg-malpas-blue text-white border-blue-400 shadow-lg scale-[1.02]'
                    : 'bg-malpas-navy/60 text-gray-300 border-malpas-blue/20 hover:bg-malpas-blue/30'
                }`}
              >
                <Shield className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-gray-400'}`} />
                {team.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Quick Team Stats Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-malpas-blue/30">
        <div className="bg-malpas-navy/80 p-2.5 rounded-xl border border-malpas-blue/30 text-center">
          <div className="text-[10px] font-bold uppercase text-gray-400">Current Team</div>
          <div className="text-sm font-bold text-white truncate">{currentTeam.name}</div>
        </div>
        <div className="bg-malpas-navy/80 p-2.5 rounded-xl border border-malpas-blue/30 text-center">
          <div className="text-[10px] font-bold uppercase text-gray-400">Division</div>
          <div className="text-sm font-bold text-amber-400 truncate">{currentTeam.division}</div>
        </div>
        <div className="bg-malpas-navy/80 p-2.5 rounded-xl border border-malpas-blue/30 text-center">
          <div className="text-[10px] font-bold uppercase text-gray-400">Captain</div>
          <div className="text-sm font-bold text-white truncate">{currentTeam.captain}</div>
        </div>
        <div className="bg-malpas-navy/80 p-2.5 rounded-xl border border-malpas-blue/30 text-center">
          <div className="text-[10px] font-bold uppercase text-gray-400">Home Ground</div>
          <div className="text-sm font-bold text-emerald-400 truncate">Wrexham Rd, Malpas</div>
        </div>
      </div>
    </div>
  );
}
