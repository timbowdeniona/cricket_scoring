'use client';

import React, { useRef } from 'react';
import { PitchLocation, PitchLength, PitchLine } from '@/types/cricket';

interface PitchMap2DProps {
  selectedLocation?: PitchLocation | null;
  onSelectPitchLocation?: (loc: PitchLocation) => void;
  className?: string;
}

export function PitchMap2D({
  selectedLocation,
  onSelectPitchLocation,
  className = '',
}: PitchMap2DProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleClick = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!onSelectPitchLocation || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const touches = 'touches' in e && e.touches.length > 0 ? e.touches : ('changedTouches' in e && e.changedTouches.length > 0 ? e.changedTouches : null);
    const clientX = touches && touches.length > 0 ? touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = touches && touches.length > 0 ? touches[0].clientY : (e as React.MouseEvent).clientY;

    const px = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const py = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);

    // Determine Length (py: 0 = Yorker at stumps, 1 = Bouncer near bowler)
    let length: PitchLength = 'Good';
    if (py < 0.2) length = 'Yorker';
    else if (py < 0.45) length = 'Full';
    else if (py < 0.7) length = 'Good';
    else if (py < 0.88) length = 'Short';
    else length = 'Bouncer';

    // Determine Line (px: 0 = Outside Off, 0.5 = Middle, 1 = Outside Leg)
    let line: PitchLine = 'Middle';
    if (px < 0.3) line = 'Outside Off';
    else if (px < 0.45) line = 'Off';
    else if (px < 0.55) line = 'Middle';
    else if (px < 0.7) line = 'Leg';
    else line = 'Outside Leg';

    onSelectPitchLocation({
      length,
      line,
      px: Number(px.toFixed(2)),
      py: Number(py.toFixed(2)),
    });
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="text-xs font-semibold text-gray-400 mb-1">Pitch Map (Pitching Spot)</div>
      <svg
        ref={svgRef}
        viewBox="0 0 160 300"
        className="w-36 h-auto cursor-pointer touch-none bg-[#c89968] border-2 border-amber-900/60 rounded shadow-md"
        onClick={handleClick}
        onTouchStart={handleClick}
      >
        {/* Pitch Creases */}
        <line x1="10" y1="40" x2="150" y2="40" stroke="#ffffff" strokeWidth="2" />
        <line x1="10" y1="260" x2="150" y2="260" stroke="#ffffff" strokeWidth="2" />

        {/* Stumps (Batting end at top, Bowler end at bottom) */}
        <g stroke="#f59e0b" strokeWidth="2.5">
          <line x1="72" y1="36" x2="72" y2="40" />
          <line x1="80" y1="36" x2="80" y2="40" />
          <line x1="88" y1="36" x2="88" y2="40" />
        </g>

        {/* Pitch Length Guide Lines */}
        <line x1="10" y1="80" x2="150" y2="80" stroke="rgba(255,255,255,0.25)" strokeDasharray="3,3" />
        <line x1="10" y1="150" x2="150" y2="150" stroke="rgba(255,255,255,0.25)" strokeDasharray="3,3" />
        <line x1="10" y1="210" x2="150" y2="210" stroke="rgba(255,255,255,0.25)" strokeDasharray="3,3" />

        <text x="14" y="65" fill="rgba(255,255,255,0.5)" fontSize="9">Full</text>
        <text x="14" y="120" fill="rgba(255,255,255,0.5)" fontSize="9">Good</text>
        <text x="14" y="180" fill="rgba(255,255,255,0.5)" fontSize="9">Short</text>

        {/* Selected Pitch Spot */}
        {selectedLocation && (
          <circle
            cx={selectedLocation.px * 160}
            cy={selectedLocation.py * 300}
            r="6"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="2"
          />
        )}
      </svg>
    </div>
  );
}
