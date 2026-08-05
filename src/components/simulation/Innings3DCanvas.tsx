'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Innings, Player, Ball } from '@/types/cricket';
import { computeBatsmanStats } from '@/utils/cricketCalculations';
import { Play, Pause, RotateCcw, Camera, Eye, Filter } from 'lucide-react';

interface Innings3DCanvasProps {
  innings: Innings;
  players: Player[];
}

export function Innings3DCanvas({ innings, players }: Innings3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(players[0]?.id || '');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'all' | 'boundaries' | 'wickets'>('all');
  const [cameraPreset, setCameraPreset] = useState<'orbit' | 'bowler' | 'overhead' | 'batter'>('orbit');

  const stats = computeBatsmanStats(innings, selectedPlayerId, players);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060f0a);
    scene.fog = new THREE.FogExp2(0x060f0a, 0.008);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 35, 65);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go below ground

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
    dirLight.position.set(40, 60, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // 6. Ground Oval Mesh
    const groundGeo = new THREE.CylinderGeometry(55, 55, 0.5, 64);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x143e1c, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.25;
    ground.receiveShadow = true;
    scene.add(ground);

    // Boundary Rope Ring
    const ropeGeo = new THREE.TorusGeometry(50, 0.6, 16, 100);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.rotation.x = Math.PI / 2;
    rope.position.y = 0.1;
    scene.add(rope);

    // 30-Yard Infield Ring
    const ringGeo = new THREE.TorusGeometry(28, 0.15, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.05;
    scene.add(ring);

    // Pitch Mesh (rect in center)
    const pitchGeo = new THREE.BoxGeometry(4, 0.1, 20);
    const pitchMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.9 });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.position.set(0, 0.05, 0);
    pitch.receiveShadow = true;
    scene.add(pitch);

    // Stumps & Bails (Batting end z = -9, Bowler end z = +9)
    const createStumps = (zPos: number) => {
      const group = new THREE.Group();
      const woodMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
      [-0.4, 0, 0.4].forEach(x => {
        const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12), woodMat);
        stump.position.set(x, 0.7, zPos);
        stump.castShadow = true;
        group.add(stump);
      });
      // Bail
      const bail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8), woodMat);
      bail.rotation.z = Math.PI / 2;
      bail.position.set(0, 1.42, zPos);
      group.add(bail);
      return group;
    };

    scene.add(createStumps(-9)); // Batter end
    scene.add(createStumps(9));  // Bowler end

    // 7. Trajectories & Animated Balls
    const trajectoryCurves: { curve: THREE.CatmullRomCurve3; runs: number; ballMesh: THREE.Mesh }[] = [];

    // Collect balls faced by selected batsman
    const batsmanBalls: Ball[] = [];
    innings.overs.forEach(o => {
      o.balls.forEach(b => {
        if (b.strikerId === selectedPlayerId) batsmanBalls.push(b);
      });
    });

    const ballMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2, metalness: 0.1 });
    const ballGeo = new THREE.SphereGeometry(0.5, 16, 16);

    batsmanBalls.forEach(b => {
      if (filterType === 'boundaries' && b.runs < 4) return;
      if (filterType === 'wickets' && !b.wicket) return;

      const px = b.pitchLocation ? (b.pitchLocation.px - 0.5) * 3 : 0;
      const pz = b.pitchLocation ? (b.pitchLocation.py - 0.5) * 16 : 3;

      let endX = b.shotLocation ? b.shotLocation.x * 48 : 0;
      let endZ = b.shotLocation ? b.shotLocation.y * 48 : -20;
      let endY = (b.shotLocation?.elevationDeg || 5) > 20 ? 12 : 0.5;

      const p0 = new THREE.Vector3(0, 1.8, 9); // Bowler release
      const p1 = new THREE.Vector3(px, 0.05, pz); // Pitch bounce
      const p2 = new THREE.Vector3(0, 0.8, -9); // Bat contact
      const p3 = new THREE.Vector3(endX * 0.5, endY, (endZ - 9) * 0.5); // Arc peak
      const p4 = new THREE.Vector3(endX, 0.4, endZ); // Boundary drop

      const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4]);

      let color = 0x3b82f6; // 1-3 runs
      if (b.runs >= 4) color = 0xef4444; // 4/6 boundary
      if (b.wicket) color = 0xa855f7; // Wicket
      if (b.runs === 0 && !b.wicket) color = 0x6b7280; // Dot

      const tubeGeo = new THREE.TubeGeometry(curve, 40, 0.12, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color, opacity: 0.8, transparent: true });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      // Animated Ball Mesh
      const animatedBall = new THREE.Mesh(ballGeo, ballMat);
      animatedBall.position.copy(p0);
      scene.add(animatedBall);

      trajectoryCurves.push({ curve, runs: b.runs, ballMesh: animatedBall });
    });

    // Camera preset updates
    if (cameraPreset === 'bowler') {
      camera.position.set(0, 6, 25);
      controls.target.set(0, 1, -9);
    } else if (cameraPreset === 'overhead') {
      camera.position.set(0, 80, 0.1);
      controls.target.set(0, 0, 0);
    } else if (cameraPreset === 'batter') {
      camera.position.set(0, 2.5, -12);
      controls.target.set(0, 2, 10);
    } else {
      camera.position.set(0, 35, 65);
      controls.target.set(0, 0, 0);
    }
    controls.update();

    // 8. Animation Loop
    let animId: number;
    let progress = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();

      if (isPlaying && trajectoryCurves.length > 0) {
        progress += 0.005;
        if (progress > 1) progress = 0;

        trajectoryCurves.forEach(item => {
          const pt = item.curve.getPoint(progress);
          item.ballMesh.position.copy(pt);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [selectedPlayerId, isPlaying, filterType, cameraPreset, innings]);

  return (
    <div className="w-full glass-panel rounded-2xl p-5 border border-emerald-900/40 shadow-xl space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-emerald-900/30 pb-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Eye className="w-6 h-6 text-emerald-400" />
            3D WebGL Innings Simulation
          </h2>
          <p className="text-xs text-emerald-400">360-degree interactive 3D shot trajectory playback</p>
        </div>

        {/* Player Selector */}
        <div className="w-full sm:w-64">
          <select
            value={selectedPlayerId}
            onChange={e => setSelectedPlayerId(e.target.value)}
            className="w-full bg-emerald-950/80 border border-emerald-700/50 rounded-xl p-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-400"
          >
            {players.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.battingHand})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Control Bar: Camera Presets & Play/Pause */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-black/40 p-2.5 rounded-xl border border-emerald-900/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play 3D'}
          </button>
        </div>

        {/* Camera Angles */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 font-semibold mr-1">Camera:</span>
          {(['orbit', 'bowler', 'overhead', 'batter'] as const).map(preset => (
            <button
              key={preset}
              onClick={() => setCameraPreset(preset)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                cameraPreset === preset
                  ? 'bg-amber-500 text-black border border-amber-300'
                  : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/60'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Shot Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 font-semibold mr-1">Filter:</span>
          {(['all', 'boundaries', 'wickets'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-2 py-1 rounded text-[11px] font-bold uppercase transition-all ${
                filterType === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-[450px] bg-gradient-to-b from-gray-950 via-[#060f0a] to-gray-950 rounded-2xl overflow-hidden relative border border-emerald-800/40 shadow-inner"
      >
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-emerald-300 pointer-events-none">
          {stats.name}: {stats.runs} runs ({stats.shots.length} 3D trajectory arcs)
        </div>
      </div>
    </div>
  );
}
