'use client';

import React from 'react';
import { MALPAS_CLUB_RECORDS } from '@/services/malpasData';
import { Trophy, Award, MapPin, Shield, Star } from 'lucide-react';

export function ClubHistoryView() {
  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-malpas-blue/40 shadow-xl space-y-6">
      {/* Title Header */}
      <div className="border-b border-malpas-blue/30 pb-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          Malpas Cricket Club History & All-Time Honors
        </h2>
        <p className="text-xs text-gray-300">Cheshire League record holders, landmark partnerships, and ground records</p>
      </div>

      {/* Grid of All-Time Records */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {MALPAS_CLUB_RECORDS.map((record, i) => (
          <div
            key={i}
            className="bg-malpas-navy/80 p-4 rounded-xl border border-malpas-blue/30 shadow-md relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between border-b border-malpas-blue/20 pb-2 mb-2">
              <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                {record.category}
              </span>
              <span className="text-xs font-mono font-bold text-gray-400">{record.year}</span>
            </div>

            <div>
              <div className="text-2xl font-black font-mono text-white mb-1">{record.value}</div>
              <div className="text-sm font-bold text-blue-300">{record.holder}</div>
              {record.opponent && (
                <div className="text-xs text-gray-400 mt-0.5">vs {record.opponent}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Ground Information Card */}
      <div className="bg-malpas-dark p-5 rounded-xl border border-malpas-blue/40 space-y-2">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-400" />
          The Recreation Ground, Wrexham Road, Malpas
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          Malpas Cricket Club (M.D.S.C.) is situated on Wrexham Road in the historic Cheshire village of Malpas.
          The club operates senior teams competing in the Cheshire Cricket League (1st XI & 2nd XI), Sunday friendly & cup teams,
          and a thriving junior section for all ages.
        </p>
      </div>
    </div>
  );
}
