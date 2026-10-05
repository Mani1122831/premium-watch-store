import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Film, ChevronLeft, ChevronRight, Eye, Sparkles, Layers } from 'lucide-react';
import { Product, ProductImages, ProductMedia } from '../../types/product';
import { isOwnedProductAsset } from '../../data/productMedia';
import ExplodedAssemblyModal from './ExplodedAssemblyModal';

interface ProductGalleryProps {
  media?: ProductMedia;
  images?: ProductImages | string[];
  productName: string;
  product?: Product;
}

interface MediaItem {
  id: 'front' | 'back' | 'side' | 'top' | 'video';
  type: 'image' | 'video';
  label: string;
  sublabel: string;
  src: string | null;
}

export default function ProductGallery({ media, images: _images, productName, product }: ProductGalleryProps) {
  const productId = product?.id || media?.productId || '';
  const ownsMedia = media?.productId === productId;
  const safeAsset = (src: string | null | undefined) =>
    ownsMedia && isOwnedProductAsset(productId, src) ? src : null;

  // Never read a positional image array or a legacy path: both can silently
  // introduce another watch when a product is incomplete.
  const frontImg = safeAsset(media?.front);
  const backImg = safeAsset(media?.back);
  const sideImg = safeAsset(media?.side);
  const topImg = safeAsset(media?.top);
  const videoSrc = safeAsset(media?.assemblyVideo);
  const modelSrc = safeAsset(media?.model3d);
  const [failedAssets, setFailedAssets] = useState<Record<string, boolean>>({});

  const mediaList: MediaItem[] = [
    { id: 'front', type: 'image', label: 'Front', sublabel: 'Direct View', src: failedAssets.front ? null : frontImg },
    { id: 'back', type: 'image', label: 'Back', sublabel: 'Caseback', src: failedAssets.back ? null : backImg },
    { id: 'side', type: 'image', label: 'Side', sublabel: 'Profile', src: failedAssets.side ? null : sideImg },
    { id: 'top', type: 'image', label: 'Top', sublabel: 'Angled View', src: failedAssets.top ? null : topImg },
    { id: 'video', type: 'video', label: 'Assembly Video', sublabel: 'Exploded View', src: videoSrc },
  ];

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);
  const [explodedModalOpen, setExplodedModalOpen] = useState<boolean>(false);

  const effectiveProduct: Product = product || {
    id: 'current',
    name: productName,
    category: 'Luxury',
    gender: 'unisex',
    price: 0,
    originalPrice: 0,
    discount: 0,
    rating: 5,
    reviews: 0,
    images: Array.isArray(_images) ? _images : [],
    description: '',
    features: [],
    material: 'Stainless Steel',
    strap: 'Leather',
    movement: 'Swiss Automatic',
    waterResistance: '50m',
    warranty: '2 years',
    stock: 10,
    colors: ['#d4a017'],
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeMedia = mediaList[activeIndex];

  // Pause video and reset errors if user switches away from the video tab
  useEffect(() => {
    setVideoError(false);
    setIsVideoLoading(false);
    if (activeMedia.type !== 'video' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [activeIndex, activeMedia.type]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = Number(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? mediaList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === mediaList.length - 1 ? 0 : prev + 1));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-4 select-none">
      {/* Primary Display Area */}
      <div className="relative aspect-square sm:aspect-[4/5] bg-gradient-to-b from-[#18191f] via-[#121317] to-[#0a0a0d] border border-charcoal-200/50 flex items-center justify-center p-4 sm:p-6 overflow-hidden rounded-xl shadow-lg group">
        
        {/* Ambient Gold Radial Flare */}
        <div className="absolute inset-0 bg-radial from-gold-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* View Badge (Top-Left) */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#0c0d10]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-md shadow-sm">
          {activeMedia.type === 'video' ? (
            <>
              <Film className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-gold-400 uppercase">
                WATCHMAKING ATELIER • ASSEMBLY
              </span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                {activeMedia.label} View ({activeIndex + 1}/5)
              </span>
            </>
          )}
        </div>

        {/* 3D Exploded View Trigger Badge (Top-Right) */}
        <button
          onClick={() => modelSrc && setExplodedModalOpen(true)}
          disabled={!modelSrc}
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#0c0d10]/90 enabled:hover:bg-gold-500 enabled:hover:text-charcoal-950 backdrop-blur-md border border-gold-500/40 text-gold-400 px-3 py-1.5 rounded-md shadow-sm transition-all enabled:cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed group/exp"
          title={modelSrc ? 'Inspect this product\'s 3D exploded assembly' : 'Product-specific 3D model coming soon'}
        >
          <Layers className="w-3.5 h-3.5 group-hover/exp:scale-110 transition-transform" />
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase">
            3D Exploded View
          </span>
        </button>

        {/* Navigation Chevrons */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-gold-500 hover:text-black text-white/80 border border-white/10 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Previous view"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-gold-500 hover:text-black text-white/80 border border-white/10 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Next view"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Media Content Display */}
        {activeMedia.type === 'video' ? (
          (activeMedia.src && !videoError) ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <video
                ref={videoRef}
                src={activeMedia.src}
                poster={frontImg || undefined}
                playsInline
                preload="metadata"
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onError={() => {
                  setVideoError(true);
                  setIsPlaying(false);
                }}
                onWaiting={() => setIsVideoLoading(true)}
                onCanPlay={() => setIsVideoLoading(false)}
                className="w-full h-full object-contain cursor-pointer rounded-lg drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                onClick={togglePlay}
              />

              {/* Loading Spinner */}
              {isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-12 h-12 rounded-full border-2 border-gold-500/20 border-t-gold-500 animate-spin" />
                </div>
              )}

              {/* Play Overlay if not playing */}
              {!isPlaying && !isVideoLoading && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-charcoal-950/80 border-2 border-gold-400 text-gold-400 hover:scale-110 hover:bg-gold-500 hover:text-charcoal-950 flex items-center justify-center transition-all shadow-2xl cursor-pointer backdrop-blur-sm"
                  aria-label="Play assembly video"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
              )}

              {/* Video Controls Bar */}
              <div className="absolute bottom-3 inset-x-3 bg-[#0c0d10]/90 border border-white/10 p-2 sm:p-2.5 rounded-lg backdrop-blur-md flex flex-col gap-1.5 z-20">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  aria-label="Video scrubber"
                />

                <div className="flex items-center justify-between text-xs text-white/90">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-1 text-gold-400 hover:text-white transition-colors cursor-pointer"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-1 text-white/70 hover:text-gold-400 transition-colors cursor-pointer"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="text-[11px] font-mono text-white/60">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-[10px] tracking-widest uppercase text-gold-400/90 font-medium">
                      Atelier Assembly
                    </span>
                    <button
                      onClick={handleFullscreen}
                      className="p-1 text-white/70 hover:text-gold-400 transition-colors cursor-pointer"
                      aria-label="Fullscreen"
                    >
                      <Maximize className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Product-specific video coming soon state */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#14151a] border border-gold-500/30 flex items-center justify-center mb-5 text-gold-400 shadow-[0_0_30px_rgba(212,160,23,0.15)]">
                <Film className="w-8 h-8 sm:w-10 sm:h-10 text-gold-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-gold-400 uppercase mb-2">
                Watchmaking Atelier
              </span>
              <h4 className="font-serif text-xl sm:text-2xl text-white mb-2">{productName}</h4>
              <p className="text-charcoal-300 text-sm max-w-sm tracking-wide mb-5">
                Product making video coming soon.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {modelSrc && (
                  <button
                    onClick={() => setExplodedModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold-500/50 bg-gold-500/15 hover:bg-gold-500 hover:text-charcoal-950 text-gold-400 text-xs font-semibold tracking-widest uppercase transition-all shadow-lg cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Launch 3D Exploded Assembly</span>
                  </button>
                )}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-[10px] font-semibold tracking-widest text-gold-400 uppercase">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  <span>Atelier In Production</span>
                </div>
              </div>
            </div>
          )
        ) : (
          activeMedia.src ? (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={activeMedia.src}
                alt={`${productName} - ${activeMedia.label} view`}
                className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-110 cursor-crosshair drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
                onError={() => setFailedAssets(current => ({ ...current, [activeMedia.id]: true }))}
              />

              {/* Inspection Tag */}
              <div className="absolute bottom-3 right-3 text-[10px] text-charcoal-400 bg-charcoal-900/80 border border-white/10 px-2.5 py-1 rounded backdrop-blur-sm pointer-events-none tracking-widest uppercase">
                Hover to inspect
              </div>
            </div>
          ) : (
            /* Safe view placeholder when view angle is pending authentic capture */
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#14151a] border border-charcoal-700/60 flex items-center justify-center mb-5 text-gold-400/80 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
                <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-gold-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-gold-400 uppercase mb-2">
                {activeMedia.label} View ({activeMedia.sublabel})
              </span>
              <h4 className="font-serif text-xl sm:text-2xl text-white mb-2">{productName}</h4>
              <p className="text-charcoal-300 text-sm max-w-sm tracking-wide mb-5">
                {activeMedia.label} perspective view coming soon.
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-semibold tracking-widest text-charcoal-300 uppercase">
                <span>Atelier Certified Perspective • In Preparation</span>
              </div>
            </div>
          )
        )}
      </div>

      {/* 5 Interactive Thumbnail Selectors: [FRONT] [BACK] [SIDE] [TOP] [MAKING VIDEO] */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {mediaList.map((item, idx) => {
          const isSelected = activeIndex === idx;
          const hasMedia = Boolean(item.src);

          return (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`group/thumb relative flex flex-col items-center justify-between p-1.5 sm:p-2 rounded-lg border-2 transition-all cursor-pointer bg-[#121317] ${
                isSelected
                  ? 'border-gold-500 scale-[1.03] shadow-md ring-1 ring-gold-500/50'
                  : 'border-charcoal-200/40 opacity-70 hover:opacity-100 hover:border-charcoal-400'
              }`}
              aria-label={`Select ${item.label} view`}
              aria-pressed={isSelected}
            >
              {/* Thumbnail Media Container */}
              <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded bg-[#0c0d10]">
                {item.type === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1c22] to-[#0c0d10]">
                    {frontImg && (
                      <img
                        src={frontImg}
                        alt="Making video thumbnail"
                        className="w-full h-full object-contain opacity-30 blur-[1px]"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform group-hover/thumb:scale-110 ${
                        isSelected ? 'bg-gold-500 text-charcoal-950' : 'bg-charcoal-900/90 text-gold-400 border border-gold-500/50'
                      }`}>
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    {(!hasMedia || videoError) && (
                      <div className="absolute bottom-1 right-1 bg-charcoal-950/90 text-[8px] tracking-widest text-gold-400/90 px-1 py-0.5 rounded border border-gold-500/30 uppercase">
                        Soon
                      </div>
                    )}
                  </div>
                ) : (
                  hasMedia ? (
                    <img
                      src={item.src!}
                      alt={`${item.label} thumbnail`}
                      className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover/thumb:scale-105"
                      onError={() => setFailedAssets(current => ({ ...current, [item.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-[#101115]">
                      <Eye className="w-4 h-4 text-charcoal-500 mb-1" />
                      <span className="text-[8px] font-bold text-charcoal-400 tracking-wider uppercase">
                        Coming Soon
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Label Badge */}
              <div className="mt-1.5 w-full text-center">
                <span className={`block text-[10px] sm:text-xs font-bold tracking-wider uppercase truncate ${
                  isSelected ? 'text-gold-400' : 'text-charcoal-300'
                }`}>
                  {item.label}
                </span>
                <span className="hidden sm:block text-[9px] text-charcoal-500 tracking-tight uppercase truncate">
                  {item.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Assembly Milestone Assurance Notice */}
      <div className="p-3 bg-[#14151a] border border-[#2e281b] rounded-lg flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gold-400">
          <Film className="w-4 h-4 shrink-0 text-gold-500" />
          <span className="font-semibold tracking-wider uppercase text-[10px] sm:text-xs">
            Atelier Quality Certification:
          </span>
        </div>
        <span className="text-charcoal-400 text-[10px] sm:text-xs text-right">
          Hand-inspected 5-point calibration & Swiss casing
        </span>
      </div>

      {/* 3D Exploded Assembly Interactive Modal */}
      <ExplodedAssemblyModal
        isOpen={explodedModalOpen}
        onClose={() => setExplodedModalOpen(false)}
        product={effectiveProduct}
      />
    </div>
  );
}
