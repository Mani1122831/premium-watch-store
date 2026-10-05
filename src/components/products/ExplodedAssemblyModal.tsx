import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types/product';
import { getWatchArchitecture } from '../../data/watchArchitectures';
import { isOwnedProductAsset } from '../../data/productMedia';
import Watch3DViewer from './Watch3DViewer';

interface ExplodedAssemblyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function ExplodedAssemblyModal({ isOpen, onClose, product }: ExplodedAssemblyModalProps) {
  // separation: 0 = fully assembled (100%), 100 = fully exploded (0%)
  const [separation, setSeparation] = useState<number>(75);
  // mode: 'idle' | 'assembling' | 'exploding' | 'cycle'
  const [mode, setMode] = useState<'idle' | 'assembling' | 'exploding' | 'cycle'>('idle');
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [isAssemblyComplete, setIsAssemblyComplete] = useState<boolean>(false);

  // A GLB is eligible only when the manifest binds it to this exact product.
  // There is intentionally no shared/default model fallback.
  const modelUrl =
    (product.media?.productId === product.id && isOwnedProductAsset(product.id, product.media.model3d) ? product.media.model3d : null) ||
    (product.model3d && isOwnedProductAsset(product.id, product.model3d) ? product.model3d : null) ||
    (product.id === 'p006' ? '/products/p006/model.glb' : null);
  const has3DModel = Boolean(modelUrl);
  const [viewMode, setViewMode] = useState<'3d' | 'blueprint'>('3d');

  // Reset viewMode and animation state when modal opens or product changes
  useEffect(() => {
    if (isOpen) {
      setViewMode(has3DModel ? '3d' : 'blueprint');
      setSeparation(75);
      setMode('idle');
      setIsAssemblyComplete(false);
      setActiveComponent(null);
    }
  }, [has3DModel, isOpen, product.id]);

  const separationRef = useRef<number>(75);
  const animRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const cycleDirectionRef = useRef<number>(-0.45); // negative = assembling towards 0, positive = exploding towards 85

  // Sync ref with separation state
  useEffect(() => {
    separationRef.current = separation;
  }, [separation]);

  // Resolve authentic model architecture
  const arch = getWatchArchitecture(product.slug || product.id);
  const layers = arch.layers;
  const { dialColor, modelType, primaryMetal } = arch;

  // Assembly Progress percentage (0% to 100%)
  const assemblyProgress = Math.max(0, Math.min(100, Math.round(100 - separation)));

  // Resolve finished watch front hero photo
  const finishedWatchImage = product.media?.productId === product.id &&
    isOwnedProductAsset(product.id, product.media.front)
    ? product.media.front
    : null;

  // Cleanup timers on unmount or close
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  // Main Smooth Animation Loop
  useEffect(() => {
    if (!isOpen) return;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 16.6, 2.0);
      lastTime = currentTime;

      if (mode === 'assembling') {
        const prev = separationRef.current;
        const step = Math.max(0.35, prev * 0.055) * delta;
        const next = Math.max(0, prev - step);
        separationRef.current = next;
        setSeparation(next);

        if (next <= 0.1) {
          separationRef.current = 0;
          setSeparation(0);
          setIsAssemblyComplete(true);
          setMode('idle');
          return;
        }
      } else if (mode === 'exploding') {
        const prev = separationRef.current;
        const step = Math.max(0.4, (85 - prev) * 0.06) * delta;
        const next = Math.min(85, prev + step);
        separationRef.current = next;
        setSeparation(next);

        if (next >= 84.8) {
          separationRef.current = 85;
          setSeparation(85);
          setIsAssemblyComplete(false);
          setMode('idle');
          return;
        }
      } else if (mode === 'cycle') {
        const prev = separationRef.current;
        const dir = cycleDirectionRef.current;
        const step = (dir < 0 ? Math.max(0.35, prev * 0.045) : Math.max(0.35, (85 - prev) * 0.045)) * delta;
        const next = dir < 0 ? Math.max(0, prev - step) : Math.min(85, prev + step);
        separationRef.current = next;
        setSeparation(next);

        if (dir < 0 && next <= 0.1) {
          separationRef.current = 0;
          setSeparation(0);
          setIsAssemblyComplete(true);
          cycleDirectionRef.current = 0.45;
          if (animRef.current) cancelAnimationFrame(animRef.current);

          holdTimerRef.current = window.setTimeout(() => {
            setIsAssemblyComplete(false);
            lastTime = performance.now();
            animRef.current = requestAnimationFrame(animate);
          }, 3500);
          return;
        } else if (dir > 0 && next >= 84.8) {
          separationRef.current = 85;
          setSeparation(85);
          setIsAssemblyComplete(false);
          cycleDirectionRef.current = -0.45;
          if (animRef.current) cancelAnimationFrame(animRef.current);

          holdTimerRef.current = window.setTimeout(() => {
            lastTime = performance.now();
            animRef.current = requestAnimationFrame(animate);
          }, 2000);
          return;
        }
      }

      if (mode !== 'idle') {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    if (mode !== 'idle') {
      animRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isOpen, mode]);

  if (!isOpen) return null;

  // Trigger Dedicated Assemble Animation
  const handleStartAssembly = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (separationRef.current <= 1) {
      // Replay assembly from exploded state
      separationRef.current = 85;
      setSeparation(85);
      setIsAssemblyComplete(false);
      setTimeout(() => setMode('assembling'), 50);
    } else {
      setIsAssemblyComplete(false);
      setMode('assembling');
    }
  };

  // Trigger Explode Animation
  const handleStartExplode = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    setIsAssemblyComplete(false);
    setMode('exploding');
  };

  // Toggle Auto Cycle
  const handleToggleCycle = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (mode === 'cycle') {
      setMode('idle');
    } else {
      cycleDirectionRef.current = separation < 20 ? 0.45 : -0.45;
      setMode('cycle');
    }
  };

  // Compute dynamic phase indicator
  const currentPhase = separation > 65
    ? 'Phase 1: Exploded Architecture'
    : separation > 30
    ? 'Phase 2: Axial Component Alignment'
    : separation > 4
    ? 'Phase 3: Calibre Convergence'
    : 'Phase 4: Calibre Fully Locked & Verified';

  // Smooth angle interpolation: tilts from isometric (50deg/ -26deg) towards face-on (0deg/ 0deg) as it locks
  const tiltProgress = Math.pow((100 - separation) / 100, 2);
  const rotX = Math.round(50 * (1 - tiltProgress * 0.88));
  const rotZ = Math.round(-26 * (1 - tiltProgress * 0.92));

  // Hero image and layers crossfade smoothly between separation 12 and 0
  const heroOpacity = Math.max(0, Math.min(1, (12 - separation) / 12));
  const layersOpacity = Math.max(0, Math.min(1, separation / 8));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[820px] bg-gradient-to-b from-[#14151a] via-[#0d0e12] to-[#08080a] border border-gold-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0e12]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.25em] text-gold-400 uppercase font-semibold block">
                  Atelier 3D Engineering
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white/70 font-mono uppercase tracking-wider">
                  {modelType}
                </span>
              </div>
              <h3 className="font-serif text-lg text-white font-medium">
                {product.name} • Exploded View Assembly
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-colors ${
              isAssemblyComplete || separation === 0
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                : 'bg-gold-500/10 border border-gold-500/20 text-gold-400'
            }`}>
              <Sparkles className="w-3 h-3" />
              {currentPhase}
            </span>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Close exploded view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Stage & Component Inspector Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* 3D Axial Exploded View Canvas */}
          <div className="lg:col-span-8 relative flex items-center justify-center p-6 overflow-hidden bg-radial from-[#1e2029]/40 via-transparent to-transparent">
            
            {/* View Mode Switcher (if 3D GLB model exists) */}
            {has3DModel && (
              <div className="absolute top-4 left-6 z-30 flex items-center bg-black/70 backdrop-blur-md rounded-lg p-0.5 border border-white/10 shadow-lg">
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase transition-all cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-gold-500 text-charcoal-950 font-bold shadow'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  3D WebGL Calibre
                </button>
                <button
                  onClick={() => setViewMode('blueprint')}
                  className={`px-3 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase transition-all cursor-pointer ${
                    viewMode === 'blueprint'
                      ? 'bg-gold-500 text-charcoal-950 font-bold shadow'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Axial Blueprint
                </button>
              </div>
            )}

            {viewMode === '3d' && has3DModel ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <Watch3DViewer
                  modelUrl={modelUrl!}
                  separation={separation}
                  isAssemblyComplete={isAssemblyComplete || separation === 0}
                  activeComponent={activeComponent}
                  onComponentClick={(compId) => setActiveComponent(activeComponent === compId ? null : compId)}
                  className="w-full h-full min-h-[460px]"
                />

                {/* Assembled Indicator Badge (Locked and verified) */}
                {(isAssemblyComplete || separation === 0) && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold tracking-widest uppercase animate-slide-up shadow-[0_0_30px_rgba(16,185,129,0.35)] backdrop-blur-md pointer-events-none z-30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Calibre Fully Locked • Assembly Complete</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Axial Alignment Guide Line */}
                <div 
                  className={`absolute top-12 bottom-12 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-500/40 to-transparent pointer-events-none transition-opacity duration-300 ${
                    separation === 0 ? 'opacity-0' : 'opacity-100'
                  }`} 
                />

                {/* Central Axis Assembly Stage */}
                <div className="relative w-80 h-[480px] flex items-center justify-center perspective-[1200px]">
              
              {/* Finished Watch Front Hero View (Crossfades seamlessly when assembled) */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center z-40 transition-all duration-300 pointer-events-none"
                style={{
                  opacity: heroOpacity,
                  transform: `scale(${separation === 0 ? 1 : 0.92})`,
                  pointerEvents: separation === 0 ? 'auto' : 'none',
                }}
              >
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-700 ${
                    separation === 0 ? 'bg-gold-500/20 opacity-100 animate-pulse' : 'bg-transparent opacity-0'
                  }`} />
                  {finishedWatchImage && (
                    <img
                      src={finishedWatchImage}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] filter brightness-105"
                    />
                  )}
                </div>
              </div>

              {/* Exploded 3D Axial Layers Stack */}
              <div 
                className="relative w-full h-full flex items-center justify-center transition-all duration-150"
                style={{
                  opacity: layersOpacity,
                  pointerEvents: separation === 0 ? 'none' : 'auto',
                }}
              >
                {layers.map((layer) => {
                  const effectiveOffset = (layer.explodedOffset * (separation / 100));
                  const isSelected = activeComponent === layer.id;

                  return (
                    <div
                      key={layer.id}
                      onClick={() => setActiveComponent(isSelected ? null : layer.id)}
                      style={{
                        transform: `translate3d(0, ${effectiveOffset}px, 0) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${isSelected ? 1.08 : 1})`,
                        transition: 'transform 0.1s ease-out, box-shadow 0.2s',
                      }}
                      className={`absolute w-56 h-56 rounded-full cursor-pointer flex items-center justify-center transition-all group ${
                        isSelected
                          ? 'ring-2 ring-gold-400 shadow-[0_0_35px_rgba(212,160,23,0.6)] z-30'
                          : 'hover:ring-1 hover:ring-gold-400/60 shadow-lg z-10'
                      }`}
                    >
                      {/* Bespoke Horological Component Visuals */}
                      {layer.id === 'crystal' && (
                        <div className="w-full h-full rounded-full border border-cyan-400/40 bg-gradient-to-tr from-cyan-400/10 via-white/5 to-cyan-300/20 backdrop-blur-[2px] shadow-[inset_0_0_15px_rgba(136,204,255,0.3)] relative flex items-center justify-center overflow-hidden">
                          <div className="absolute top-2 left-6 right-6 h-8 rounded-full border-t-2 border-white/50 blur-[0.5px]" />
                          <div className="absolute inset-4 rounded-full border border-cyan-400/20" />
                          <span className="text-[9px] font-mono tracking-widest text-cyan-200 uppercase font-semibold drop-shadow">
                            SAPPHIRE LENS
                          </span>
                        </div>
                      )}

                      {layer.id === 'bezel' && (
                        <div 
                          className="w-full h-full rounded-full border-4 border-slate-300 shadow-[inset_0_0_15px_rgba(255,255,255,0.4),0_0_20px_rgba(0,0,0,0.5)] relative flex items-center justify-center"
                          style={{
                            background: `radial-gradient(circle, transparent 62%, ${primaryMetal} 63%, #ffffff 82%, ${primaryMetal} 100%)`,
                          }}
                        >
                          <div className="absolute inset-3 rounded-full border border-slate-400/60" />
                          <div className="w-36 h-36 rounded-full border border-dashed border-white/40" />
                          <span className="absolute text-[9px] font-mono tracking-widest text-slate-200 uppercase font-bold drop-shadow">
                            316L BEZEL
                          </span>
                        </div>
                      )}

                      {layer.id === 'hands' && (
                        <div className="w-full h-full rounded-full relative flex items-center justify-center">
                          {/* Outer phantom boundary */}
                          <div className="absolute inset-0 rounded-full border border-white/10" />
                          {/* Hour Hand */}
                          <div className="absolute w-2 h-14 bg-gradient-to-t from-slate-200 via-white to-slate-400 rounded-full top-14 left-1/2 -translate-x-1/2 shadow-md origin-bottom transform rotate-[45deg]" />
                          {/* Minute Hand */}
                          <div className="absolute w-1.5 h-20 bg-gradient-to-t from-slate-200 via-white to-slate-400 rounded-full top-8 left-1/2 -translate-x-1/2 shadow-md origin-bottom transform -rotate-[60deg]" />
                          {/* Blued Steel Seconds Hand */}
                          <div className="absolute w-0.5 h-24 bg-gradient-to-t from-blue-700 via-blue-500 to-blue-400 top-4 left-1/2 -translate-x-1/2 shadow-lg origin-bottom transform rotate-[130deg]" />
                          {/* Central Center Pinion Jewel */}
                          <div className="relative w-4 h-4 rounded-full bg-slate-100 border-2 border-slate-400 shadow-md flex items-center justify-center z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          </div>
                        </div>
                      )}

                      {layer.id === 'seconds_hand' && (
                        <div className="w-full h-full rounded-full relative flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border border-white/10" />
                          <div className="absolute w-0.5 h-24 bg-gradient-to-t from-cyan-400 via-blue-500 to-indigo-600 top-4 left-1/2 -translate-x-1/2 shadow-lg origin-bottom transform rotate-[130deg]" />
                          <div className="relative w-3.5 h-3.5 rounded-full bg-slate-100 border border-slate-400 shadow-md flex items-center justify-center z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          </div>
                          <span className="absolute bottom-14 text-[8px] font-mono tracking-widest text-cyan-300 uppercase font-bold drop-shadow">
                            SECONDS SWEEP
                          </span>
                        </div>
                      )}

                      {layer.id === 'minute_hand' && (
                        <div className="w-full h-full rounded-full relative flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border border-white/10" />
                          <div className="absolute w-1.5 h-20 bg-gradient-to-t from-slate-200 via-white to-slate-400 rounded-full top-8 left-1/2 -translate-x-1/2 shadow-md origin-bottom transform -rotate-[60deg]" />
                          <div className="relative w-4 h-4 rounded-full bg-slate-100 border-2 border-slate-400 shadow-md flex items-center justify-center z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                          </div>
                          <span className="absolute bottom-14 text-[8px] font-mono tracking-widest text-slate-300 uppercase font-bold drop-shadow">
                            MINUTE HAND
                          </span>
                        </div>
                      )}

                      {layer.id === 'hour_hand' && (
                        <div className="w-full h-full rounded-full relative flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border border-white/10" />
                          <div className="absolute w-2 h-14 bg-gradient-to-t from-slate-200 via-white to-slate-400 rounded-full top-14 left-1/2 -translate-x-1/2 shadow-md origin-bottom transform rotate-[45deg]" />
                          <div className="relative w-4 h-4 rounded-full bg-slate-100 border-2 border-slate-400 shadow-md flex items-center justify-center z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                          </div>
                          <span className="absolute bottom-14 text-[8px] font-mono tracking-widest text-slate-300 uppercase font-bold drop-shadow">
                            HOUR HAND
                          </span>
                        </div>
                      )}

                      {layer.id === 'dial' && (
                        <div 
                          className="w-full h-full rounded-full border-2 border-white/30 shadow-[inset_0_0_25px_rgba(212,160,23,0.2),0_8px_25px_rgba(0,0,0,0.6)] relative flex items-center justify-center overflow-hidden"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${dialColor} 65%, #d8d8e0 100%)`,
                          }}
                        >
                          {/* 12 Diamond Hour Markers */}
                          {[...Array(12)].map((_, i) => {
                            const angle = (i * 30 * Math.PI) / 180;
                            const r = 94; // radius
                            const x = Math.sin(angle) * r;
                            const y = -Math.cos(angle) * r;
                            return (
                              <div
                                key={i}
                                className="absolute w-2 h-2 rotate-45 bg-gradient-to-tr from-white via-cyan-100 to-white border border-slate-400 shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                                style={{ transform: `translate(${x}px, ${y}px) rotate(45deg)` }}
                              />
                            );
                          })}
                          {/* Brand Crest */}
                          <div className="text-center pt-2">
                            <span className="text-[10px] font-serif tracking-[0.25em] text-slate-800 font-bold block">
                              TITANOVA
                            </span>
                            <span className="text-[6px] tracking-[0.2em] text-slate-500 font-mono block mt-0.5">
                              SWISS CALIBRE
                            </span>
                          </div>
                        </div>
                      )}

                      {layer.id === 'movement' && (
                        <div className="w-full h-full rounded-full border-2 border-amber-500/40 bg-gradient-to-b from-[#2a2b36] via-[#1a1b24] to-[#12131a] shadow-[inset_0_0_20px_rgba(212,160,23,0.3)] relative flex items-center justify-center overflow-hidden">
                          {/* Geneva Stripes (Côtes de Genève) */}
                          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(90deg,#fff,#fff_2px,transparent_2px,transparent_8px)]" />
                          {/* Gold Gilded Gear Balance Wheel */}
                          <div className="absolute w-20 h-20 rounded-full border-2 border-gold-400/60 border-dashed animate-spin [animation-duration:12s]" />
                          {/* Ruby Pivot Jewels */}
                          <div className="absolute top-10 left-16 w-3 h-3 rounded-full bg-rose-600 border border-gold-300 shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
                          <div className="absolute bottom-12 right-14 w-2.5 h-2.5 rounded-full bg-rose-600 border border-gold-300 shadow-[0_0_6px_rgba(225,29,72,0.8)]" />
                          <div className="text-center z-10">
                            <span className="text-[9px] font-mono tracking-widest text-gold-400 font-bold block">
                              CAL. 316 PRECISION
                            </span>
                            <span className="text-[7px] font-mono text-white/50 block">
                              JEWELED ESCAPEMENT
                            </span>
                          </div>
                        </div>
                      )}

                      {layer.id === 'case' && (
                        <div 
                          className="w-full h-full rounded-full border-4 border-slate-300 shadow-[0_12px_30px_rgba(0,0,0,0.8)] relative flex items-center justify-center"
                          style={{
                            background: `radial-gradient(circle, transparent 70%, ${primaryMetal} 71%, #ffffff 88%, ${primaryMetal} 100%)`,
                          }}
                        >
                          {/* Top & Bottom Integrated Lugs */}
                          <div className="absolute -top-3 w-16 h-4 bg-gradient-to-b from-slate-200 to-slate-400 rounded-t-md border-t border-white/60 shadow" />
                          <div className="absolute -bottom-3 w-16 h-4 bg-gradient-to-t from-slate-200 to-slate-400 rounded-b-md border-b border-white/60 shadow" />
                          {/* Fluted Crown at 3 o'clock */}
                          <div className="absolute -right-3.5 w-4 h-6 bg-gradient-to-r from-slate-300 via-white to-slate-400 rounded-r border-y border-r border-slate-500 shadow-md flex items-center justify-center">
                            <div className="w-1 h-3 border-y border-slate-600" />
                          </div>
                          <span className="text-[9px] font-mono tracking-widest text-slate-300 font-bold uppercase drop-shadow">
                            316L FOUNDATION
                          </span>
                        </div>
                      )}

                      {layer.id === 'caseback' && (
                        <div className="w-full h-full rounded-full border-4 border-slate-400 bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative flex items-center justify-center">
                          {/* Exhibition Sapphire Center Port */}
                          <div className="w-24 h-24 rounded-full border border-cyan-400/40 bg-cyan-900/20 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border border-gold-400/50" />
                          </div>
                          <span className="absolute bottom-6 text-[7px] font-mono tracking-widest text-slate-400 uppercase">
                            TITANOVA • 30M WATER RESISTANT
                          </span>
                        </div>
                      )}

                      {layer.id === 'strap' && (
                        <div className="w-full h-full rounded-full border-2 border-slate-400/40 relative flex items-center justify-center">
                          {/* Top Milanese Mesh Band */}
                          <div 
                            className="absolute -top-12 w-28 h-14 rounded-t-lg border-x border-t border-slate-300 shadow-lg"
                            style={{
                              background: 'repeating-linear-gradient(45deg, #c8c8d0, #c8c8d0 2px, #e4e4ec 2px, #e4e4ec 4px)',
                            }}
                          />
                          {/* Bottom Milanese Mesh Band */}
                          <div 
                            className="absolute -bottom-12 w-28 h-14 rounded-b-lg border-x border-b border-slate-300 shadow-lg"
                            style={{
                              background: 'repeating-linear-gradient(45deg, #c8c8d0, #c8c8d0 2px, #e4e4ec 2px, #e4e4ec 4px)',
                            }}
                          />
                          <div className="relative px-3 py-1 rounded bg-black/70 border border-slate-400/50 z-10">
                            <span className="text-[9px] font-mono tracking-widest text-slate-200 uppercase font-bold">
                              MILANESE MESH
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Fallback for other generic layers */}
                      {!['crystal', 'bezel', 'hands', 'seconds_hand', 'minute_hand', 'hour_hand', 'dial', 'movement', 'case', 'caseback', 'strap'].includes(layer.id) && (
                        <div 
                          className="w-full h-full rounded-full flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm border-2 border-white/20"
                          style={{
                            backgroundColor: `${layer.color}33`,
                            boxShadow: `inset 0 0 20px ${layer.color}44`,
                          }}
                        >
                          <span className="text-[10px] font-mono tracking-widest text-white/90 uppercase font-bold text-center px-2 drop-shadow">
                            {layer.name}
                          </span>
                        </div>
                      )}

                      {/* Axial Callout Tag */}
                      <div className="absolute left-full ml-4 whitespace-nowrap hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        <div className="w-4 h-px bg-gold-400" />
                        <span className="text-[11px] font-mono tracking-wider text-gold-400 uppercase bg-black/90 px-2.5 py-1 rounded border border-gold-400/40 shadow-xl">
                          {layer.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assembled Indicator Badge (Locked and verified) */}
            {(isAssemblyComplete || separation === 0) && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-semibold tracking-widest uppercase animate-slide-up shadow-[0_0_30px_rgba(16,185,129,0.35)] backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Calibre Fully Locked • Assembly Complete</span>
              </div>
            )}
              </>
            )}
          </div>

          {/* Component Inspection Side Panel */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/10 p-5 flex flex-col justify-between bg-[#0a0b0e]/60 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/40 block">
                  Component Architecture ({layers.length} Parts)
                </span>
                <span className="text-[10px] font-mono text-gold-400/80">
                  {arch.modelType.toUpperCase()}
                </span>
              </div>

              {/* Progress Summary Pill */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider block">
                    Assembly State
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {assemblyProgress}% Locked
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                    isAssemblyComplete || separation === 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-gold-500/10 text-gold-400 border border-gold-500/30'
                  }`}>
                    {isAssemblyComplete || separation === 0 ? 'COMPLETE' : 'IN PROGRESS'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
                {layers.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveComponent(activeComponent === l.id ? null : l.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      activeComponent === l.id
                        ? 'border-gold-500 bg-gold-500/10 text-gold-400 font-medium'
                        : 'border-white/5 hover:border-white/20 bg-white/5 text-white/80'
                    }`}
                  >
                    <span className="truncate pr-2">{l.name}</span>
                    <span className="text-[10px] text-white/40 font-mono shrink-0">{l.id.toUpperCase()}</span>
                  </button>
                ))}
              </div>

              {/* Active Component Details Card */}
              {activeComponent && (
                <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 animate-fade-in space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-wider text-gold-400 uppercase font-bold">
                      {layers.find(l => l.id === activeComponent)?.stage}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-white">
                    {layers.find(l => l.id === activeComponent)?.name}
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed font-light">
                    {layers.find(l => l.id === activeComponent)?.description}
                  </p>
                </div>
              )}
            </div>

            {/* Brand Signature */}
            <div className="pt-4 border-t border-white/10 text-center">
              <span className="font-serif text-sm tracking-[0.25em] text-gold-400 block font-bold">
                TITANOVA
              </span>
              <span className="text-[9px] tracking-[0.2em] text-white/40 uppercase">
                SWISS WATCHMAKING ATELIER
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Control Deck */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0c0d10] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* Controls: Assemble / Explode / Cycle */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Primary Assemble Button */}
            <button
              onClick={handleStartAssembly}
              disabled={mode === 'assembling'}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                mode === 'assembling'
                  ? 'bg-gold-600 text-charcoal-950 opacity-80 cursor-wait'
                  : isAssemblyComplete || separation === 0
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : 'bg-gold-500 hover:bg-gold-400 text-charcoal-950 shadow-[0_0_20px_rgba(212,160,23,0.35)]'
              }`}
            >
              {mode === 'assembling' ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin" />
                  <span>Assembling ({assemblyProgress}%)</span>
                </>
              ) : isAssemblyComplete || separation === 0 ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Assembly</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Assemble Watch</span>
                </>
              )}
            </button>

            {/* Explode / Separate Button */}
            <button
              onClick={handleStartExplode}
              disabled={mode === 'exploding' || separation >= 85}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 hover:border-white/50 text-white hover:bg-white/5 text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Separate into exploded components"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Explode View</span>
            </button>

            {/* Auto Cycle Button */}
            <button
              onClick={handleToggleCycle}
              className={`inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer ${
                mode === 'cycle'
                  ? 'border-gold-500/80 bg-gold-500/20 text-gold-400'
                  : 'border-white/10 hover:border-white/30 text-white/70 hover:text-white'
              }`}
              title="Continuous exploded assembly cycle"
            >
              {mode === 'cycle' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{mode === 'cycle' ? 'Pause Cycle' : 'Auto Cycle'}</span>
            </button>
          </div>

          {/* Assembly Progress Scrub Bar */}
          <div className="flex items-center gap-3 w-full sm:w-80">
            <span className="text-[10px] tracking-wider text-white/60 uppercase font-mono whitespace-nowrap">
              Assembly: {assemblyProgress}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={assemblyProgress}
              onChange={(e) => {
                if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
                setMode('idle');
                const val = Number(e.target.value);
                const newSep = 100 - val;
                separationRef.current = newSep;
                setSeparation(newSep);
                setIsAssemblyComplete(newSep <= 1);
              }}
              className="w-full accent-gold-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] tracking-wider text-gold-400 font-mono w-16 text-right">
              {separation === 0 ? 'LOCKED' : separation >= 80 ? 'EXPLODED' : 'ALIGNING'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
