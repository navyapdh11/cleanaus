'use client';

import { useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GlassCard } from '@/components/ui/glass-card';
import {
  Camera,
  Ruler,
  Scan,
  Home,
  ClipboardList,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Grid3X3,
  Eye,
  Play,
  Pause,
} from 'lucide-react';

// ===== 3D AR SCENE COMPONENTS =====
function RoomBox({ position, size, color, label, selected }: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
  selected?: boolean;
}) {
  return (
    <group position={position}>
      <Box args={size}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={selected ? 0.4 : 0.15}
          wireframe={!selected}
        />
      </Box>
      {selected && (
        <Html center>
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap backdrop-blur-sm border border-white/20">
            {label}: {(size[0] * size[2]).toFixed(1)}m²
          </div>
        </Html>
      )}
    </group>
  );
}

function GridFloor({ size }: { size: number }) {
  return (
    <gridHelper args={[size, size / 0.5, 0x3b82f6, 0x1e3a5f]} position={[0, -0.01, 0]} />
  );
}

function MeasurementLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const length = Math.sqrt(
    (end[0] - start[0]) ** 2 +
    (end[1] - start[1]) ** 2 +
    (end[2] - start[2]) ** 2
  );

  return (
    <group>
      <line>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            args={[new Float32Array([...start, ...end]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#06b6d4" linewidth={2} />
      </line>
      <Html position={[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2]} center>
        <div className="bg-cyan-500/90 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
          {length.toFixed(2)}m
        </div>
      </Html>
    </group>
  );
}

function DirtySpot({ position, type }: { position: [number, number, number]; type: 'clean' | 'attention' | 'stain' }) {
  const colors = { clean: '#10b981', attention: '#f59e0b', stain: '#ef4444' };
  return (
    <Sphere args={[0.08, 16, 16]} position={position}>
      <meshStandardMaterial color={colors[type]} emissive={colors[type]} emissiveIntensity={0.5} />
    </Sphere>
  );
}

function ARScene({ mode, selectedRoom }: { mode: string; selectedRoom: string | null }) {
  const groupRef = useRef<THREE.Group>(null);

  const rooms = [
    { id: 'living', position: [0, 1.5, 0] as [number, number, number], size: [6, 3, 5] as [number, number, number], color: '#3b82f6', label: 'Living Room' },
    { id: 'kitchen', position: [4, 1.5, 0] as [number, number, number], size: [3, 3, 4] as [number, number, number], color: '#8b5cf6', label: 'Kitchen' },
    { id: 'bedroom', position: [-4, 1.5, 0] as [number, number, number], size: [4, 3, 4] as [number, number, number], color: '#10b981', label: 'Bedroom' },
    { id: 'bathroom', position: [0, 1.5, 4] as [number, number, number], size: [2.5, 3, 2.5] as [number, number, number], color: '#f59e0b', label: 'Bathroom' },
  ];

  const dirtySpots = [
    { position: [1, 0.05, 1] as [number, number, number], type: 'stain' as const },
    { position: [-2, 0.05, -1] as [number, number, number], type: 'attention' as const },
    { position: [3, 0.05, 2] as [number, number, number], type: 'clean' as const },
    { position: [-1, 0.05, 3] as [number, number, number], type: 'attention' as const },
  ];

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#8b5cf6" />

      <GridFloor size={20} />

      {rooms.map((room) => (
        <RoomBox
          key={room.id}
          position={room.position}
          size={room.size}
          color={room.color}
          label={room.label}
          selected={selectedRoom === room.id}
        />
      ))}

      {mode === 'measure' && (
        <>
          <MeasurementLine start={[-3, 0, -2.5]} end={[3, 0, -2.5]} />
          <MeasurementLine start={[-3, 0, -2.5]} end={[-3, 3, -2.5]} />
          <MeasurementLine start={[2.5, 0, -2]} end={[5.5, 0, -2]} />
        </>
      )}

      {mode === 'inspect' && dirtySpots.map((spot, i) => (
        <DirtySpot key={i} position={spot.position} type={spot.type} />
      ))}
    </group>
  );
}

// ===== QUOTE GENERATOR =====
function generateQuote(rooms: string[]): { total: number; breakdown: { room: string; price: number; area: number }[] } {
  const prices: Record<string, { base: number; perSqm: number }> = {
    living: { base: 80, perSqm: 8 },
    kitchen: { base: 120, perSqm: 12 },
    bedroom: { base: 60, perSqm: 7 },
    bathroom: { base: 90, perSqm: 15 },
  };

  const breakdown = rooms.map((id) => {
    const area = id === 'living' ? 30 : id === 'kitchen' ? 12 : id === 'bedroom' ? 16 : 6.25;
    const price = prices[id]?.base + area * (prices[id]?.perSqm || 8);
    return { room: id, price: Math.round(price), area };
  });

  return {
    total: breakdown.reduce((sum, b) => sum + b.price, 0),
    breakdown,
  };
}

// ===== MAIN PAGE =====
export default function ARScannerPage() {
  const [mode, setMode] = useState<'scan' | 'measure' | 'inspect'>('scan');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [quote, setQuote] = useState<ReturnType<typeof generateQuote> | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(['living', 'kitchen', 'bedroom', 'bathroom']);

  const scanInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScan = useCallback(() => {
    setScanning(true);
    setScanProgress(0);
    scanInterval.current = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          if (scanInterval.current) clearInterval(scanInterval.current);
          setScanning(false);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
  }, []);

  const toggleRoom = useCallback((id: string) => {
    setSelectedRooms((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }, []);

  const generateQuoteHandler = useCallback(() => {
    setQuote(generateQuote(selectedRooms));
  }, [selectedRooms]);

  const modes = [
    { id: 'scan' as const, icon: Scan, label: '3D Scan' },
    { id: 'measure' as const, icon: Ruler, label: 'Measure' },
    { id: 'inspect' as const, icon: Eye, label: 'Inspect' },
  ];

  const roomLabels: Record<string, string> = {
    living: 'Living Room',
    kitchen: 'Kitchen',
    bedroom: 'Bedroom',
    bathroom: 'Bathroom',
  };

  return (
    <div className="min-h-screen bg-bg pt-16">
      {/* Header */}
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">AR Property Scanner</h1>
            <p className="text-white/50 text-sm">Scan, measure &amp; quote in real-time</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 3D Canvas */}
          <div className="lg:col-span-2">
            <div className="glass-strong rounded-3xl overflow-hidden" style={{ height: '500px' }}>
              <Canvas camera={{ position: [8, 8, 8], fov: 50 }}>
                <ARScene mode={mode} selectedRoom={selectedRoom} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
              </Canvas>

              {/* Mode Selector Overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium backdrop-blur-md transition-all ${
                      mode === m.id
                        ? 'bg-blue-500/80 text-white'
                        : 'bg-black/40 text-white/60 hover:bg-black/60'
                    }`}
                  >
                    <m.icon className="h-3.5 w-3.5" />
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Scan Progress */}
              {scanning && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-md rounded-xl p-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-white/80">Scanning property...</span>
                      <span className="text-blue-400 font-mono">{scanProgress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-100"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Scan Controls */}
            <GlassCard className="!hover:transform-none">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Scan className="h-4 w-4 text-blue-400" />
                Property Scan
              </h3>
              <button
                type="button"
                onClick={scanning ? () => { if (scanInterval.current) clearInterval(scanInterval.current); setScanning(false); } : startScan}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  scanning
                    ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
                }`}
              >
                {scanning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {scanning ? 'Pause Scan' : 'Start AR Scan'}
              </button>
            </GlassCard>

            {/* Room Selection */}
            <GlassCard className="!hover:transform-none">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Grid3X3 className="h-4 w-4 text-purple-400" />
                Rooms
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(roomLabels).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setSelectedRoom(id); toggleRoom(id); }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      selectedRooms.includes(id)
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <CheckCircle2 className={`h-3.5 w-3.5 ${selectedRooms.includes(id) ? 'opacity-100' : 'opacity-30'}`} />
                    {label}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Quote Generator */}
            <GlassCard className="!hover:transform-none">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                Instant Quote
              </h3>
              <button
                type="button"
                onClick={generateQuoteHandler}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all"
              >
                <ClipboardList className="h-4 w-4" />
                Generate Quote
              </button>

              {quote && (
                <div className="mt-4 space-y-3">
                  {quote.breakdown.map((b) => (
                    <div key={b.room} className="flex items-center justify-between text-sm">
                      <span className="text-white/70">{roomLabels[b.room]}</span>
                      <span className="font-semibold">${b.price} <span className="text-white/40 text-xs">({b.area}m²)</span></span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="font-semibold">Total (incl. GST)</span>
                    <span className="text-xl font-bold text-gradient-primary">${quote.total}</span>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Inspection Legend */}
            {mode === 'inspect' && (
              <GlassCard className="!hover:transform-none">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  Inspection Legend
                </h3>
                <div className="space-y-3">
                  {[
                    { color: 'bg-green-500', label: 'Clean', desc: 'No attention needed' },
                    { color: 'bg-amber-500', label: 'Attention', desc: 'Extra cleaning required' },
                    { color: 'bg-red-500', label: 'Stain', desc: 'Deep cleaning needed' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-white/40">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
