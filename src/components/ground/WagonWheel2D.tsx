'use client';

import React, { useRef } from 'react';
import { ShotLocation, BattingHand } from '@/types/cricket';
import { calculateShotZone } from '@/utils/cricketCalculations';

interface WagonWheel2DProps {
  stance?: BattingHand;
  shots?: ShotLocation[];
  onSelectLocation?: (location: ShotLocation) => void;
  interactive?: boolean;
  selectedLocation?: ShotLocation | null;
  className?: string;
}

export function WagonWheel2D({
  stance = 'RHB',
  shots = [],
  onSelectLocation,
  interactive = true,
  selectedLocation = null,
  className = '',
}: WagonWheel2DProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleClick = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!interactive || !onSelectLocation || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const svgX = clientX - rect.left;
    const svgY = clientY - rect.top;

    // SVG viewbox is 400x400, center is (200, 200), radius is 180
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9;

    // Normalized x, y between -1 and +1
    let nx = (clientX - rect.left - centerX) / radius;
    let ny = (clientY - rect.top - centerY) / radius;

    // Clamp to boundary circle (distance <= 1)
    const dist = Math.sqrt(nx * nx + ny * ny);
    if (dist > 1) {
      nx = nx / dist;
      ny = ny / dist;
    }

    const clampedDist = Math.min(dist, 1);
    const zone = calculateShotZone(nx, ny, stance);

    let rad = Math.atan2(nx, -ny);
    let deg = (rad * 180) / Math.PI;
    if (deg < 0) deg += 360;

    onSelectLocation({
      x: Number(nx.toFixed(2)),
      y: Number(ny.toFixed(2)),
      angleDeg: Math.round(deg),
      distance: Number(clampedDist.toFixed(2)),
      zone,
      elevationDeg: clampedDist > 0.8 ? 25 : 5,
    });
  };

  const isLHB = stance === 'LHB';

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Off-Side / Leg-Side stance labels */}
      <div className="absolute top-2 left-3 right-3 flex justify-between text-xs font-bold uppercase tracking-wider text-emerald-400 pointer-events-none z-10">
        <span>{isLHB ? 'Leg Side (Leg)' : 'Off Side (Off)'}</span>
        <span>{isLHB ? 'Off Side (Off)' : 'Leg Side (Leg)'}</span>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="w-full max-w-[360px] h-auto cursor-pointer touch-none select-none rounded-full shadow-2xl transition-transform active:scale-[0.99]"
        onClick={handleClick}
        onTouchStart={handleClick}
      >
        <defs>
          {/* Grass radial gradient */}
          <radialGradient id="grassGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e4620" />
            <stop offset="70%" stopColor="#0d3115" />
            <stop offset="100%" stopColor="#071e0c" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outfield Grass Circle */}
        <circle cx="200" cy="200" r="190" fill="url(#grassGrad)" stroke="#10b981" strokeWidth="3" />

        {/* Boundary Rope */}
        <circle cx="200" cy="200" r="180" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6,4" opacity="0.85" />

        {/* 30-Yard Infield Circle */}
        <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4,4" />

        {/* Pitch Rectangle in Center */}
        <rect x="193" y="170" width="14" height="60" fill="#d4a373" rx="2" opacity="0.9" />
        {/* Creases */}
        <line x1="190" y1="180" x2="210" y2="180" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="190" y1="220" x2="210" y2="220" stroke="#ffffff" strokeWidth="1.5" />

        {/* Zone dividing radial spokes (subtle) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 200 + Math.sin(rad) * 180;
          const y2 = 200 - Math.cos(rad) * 180;
          return (
            <line
              key={angle}
              x1="200"
              y1="200"
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}

        {/* Zone Text Labels */}
        <text x="200" y="32" fill="#9ca3af" fontSize="10" textAnchor="middle">Long On / Off</text>
        <text x="365" y="204" fill="#9ca3af" fontSize="10" textAnchor="end">{isLHB ? 'Cover' : 'Square Leg'}</text>
        <text x="35" y="204" fill="#9ca3af" fontSize="10" textAnchor="start">{isLHB ? 'Square Leg' : 'Cover'}</text>
        <text x="200" y="380" fill="#9ca3af" fontSize="10" textAnchor="middle">Third Man / Fine Leg</text>

        {/* Render Saved Ball Shots */}
        {shots.map((shot, idx) => {
          const cx = 200 + shot.x * 180;
          const cy = 200 + shot.y * 180;
          let strokeColor = '#3b82f6'; // default 1-3 runs
          if (shot.distance >= 0.85) strokeColor = '#ef4444'; // Boundary 4/6
          if (shot.distance < 0.25) strokeColor = '#9ca3af'; // Dot ball

          return (
            <g key={idx}>
              {/* Line from pitch to shot location */}
              <line
                x1="200"
                y1="200"
                x2={cx}
                y2={cy}
                stroke={strokeColor}
                strokeWidth="2.5"
                opacity="0.8"
              />
              {/* Dot at shot end */}
              <circle cx={cx} cy={cy} r="4" fill={strokeColor} stroke="#ffffff" strokeWidth="1" />
            </g>
          );
        })}

        {/* Currently Selected Target Point */}
        {selectedLocation && (
          <g filter="url(#glow)">
            <line
              x1="200"
              y1="200"
              x2={200 + selectedLocation.x * 180}
              y2={200 + selectedLocation.y * 180}
              stroke="#10b981"
              strokeWidth="3.5"
            />
            <circle
              cx={200 + selectedLocation.x * 180}
              cy={200 + selectedLocation.y * 180}
              r="7"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {/* Selected location feedback text */}
      {selectedLocation && (
        <div className="mt-2 text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
          Shot Direction: <span className="text-white font-bold">{selectedLocation.zone}</span>
        </div>
      )}
    </div>
  );
}
