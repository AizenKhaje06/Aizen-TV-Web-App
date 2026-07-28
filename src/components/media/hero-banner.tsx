'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { heroBannerVariants, fadeInUpVariants } from '@/styles/animations';
import { Button } from '@/components/ui/button';
import { RatingBadge } from './rating-badge';
import { Focusable } from '@/components/navigation/focusable';
import { useNavigator } from '@/lib/navigation';
import { useResponsivePadding } from '@/hooks/use-responsive-padding';
import { ZONES } from '@/lib/navigation/zones';
import { cn } from '@/lib/cn';

interface HeroBannerProps {
  title: string;
  overview: string;
  backdropPath: string;
  logoPath?: string | null;
  voteAverage?: number;
  releaseDate?: string;
  genres?: string[];
  onPlay?: () => void;
  onMoreInfo?: () => void;
}

export function HeroBanner({
  title,
  overview,
  backdropPath,
  logoPath,
  voteAverage,
  releaseDate,
  genres = [],
  onPlay,
  onMoreInfo,
}: HeroBannerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [hasAutoFocused, setHasAutoFocused] = useState(false);
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const navigator = useNavigator();
  const padding = useResponsivePadding();

  // Auto-focus Play button ONLY on initial mount, not on hero rotation
  useEffect(() => {
    if (!navigator || hasAutoFocused) return;
    
    const timer = setTimeout(() => {
      // Only focus if user hasn't scrolled away from the top
      if (window.scrollY < 100) {
        navigator.focusById('hero-play-button');
        setHasAutoFocused(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [navigator, hasAutoFocused]);

  return (
    <motion.div
      variants={heroBannerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] max-h-[900px] overflow-hidden"
    >
      {/* Background Image - Optimized to prevent overstretching */}
      <div className="absolute inset-0 bg-black">
        <Image
          src={backdropPath}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content - Dynamic padding based on screen size */}
      <div 
        className="relative z-10 h-full flex items-center overflow-hidden"
        style={{
          paddingLeft: padding.left,
          paddingRight: padding.right,
        }}
      >
        <motion.div
          variants={fadeInUpVariants}
          className="max-w-2xl space-y-4 md:space-y-6"
        >
          {/* Title or Logo */}
          {logoPath ? (
            <div className="relative w-full max-w-lg h-32 md:h-40 lg:h-48">
              <Image
                src={logoPath}
                alt={title}
                fill
                priority
                quality={100}
                className="object-contain object-left"
                sizes="(max-width: 768px) 400px, (max-width: 1024px) 500px, 600px"
              />
            </div>
          ) : (
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight break-words">
              {title}
            </h1>
          )}

          {/* Metadata: Rating + Year + Quality Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {voteAverage && <RatingBadge rating={voteAverage} />}
            {year && (
              <span className="text-gray-300 text-sm md:text-base font-medium">
                {year}
              </span>
            )}
            {/* 4K Badge */}
            <span className="px-2.5 py-1 text-xs md:text-sm font-bold text-gray-300 border-2 border-gray-600/80 rounded">
              4K
            </span>
            {/* HDR Badge */}
            <span className="px-2.5 py-1 text-xs md:text-sm font-bold text-gray-300 border-2 border-gray-600/80 rounded">
              HDR
            </span>
          </div>

          {/* Genres - Yellow badges */}
          {genres.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {genres.slice(0, 4).map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-xs md:text-sm font-semibold text-black bg-yellow-400 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          <p className="text-sm md:text-base lg:text-lg text-gray-200 line-clamp-3 md:line-clamp-4 max-w-xl break-words">
            {overview}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Focusable
              id="hero-play-button"
              zoneId={ZONES.HERO}
              zonePriority={100}
              navigationRules={{
                right: 'hero-more-info-button',
                down: ZONES.CONTINUE_WATCHING, // Allow down navigation
              }}
              className="inline-block"
            >
              <Button
                size="lg"
                onClick={onPlay}
                className="gap-2 text-base md:text-lg px-6 md:px-8"
              >
                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                Play
              </Button>
            </Focusable>
            
            <Focusable
              id="hero-more-info-button"
              zoneId={ZONES.HERO}
              zonePriority=90}
              navigationRules={{
                left: 'hero-play-button',
                right: 'hero-mute-button',
                down: ZONES.CONTINUE_WATCHING, // Allow down navigation
              }}
              className="inline-block"
            >
              <Button
                size="lg"
                variant="secondary"
                onClick={onMoreInfo}
                className="gap-2 text-base md:text-lg px-6 md:px-8 bg-gray-600/80 hover:bg-gray-600"
              >
                <Info className="w-5 h-5 md:w-6 md:h-6" />
                More Info
              </Button>
            </Focusable>
          </div>
        </motion.div>
      </div>

      {/* Mute Button */}
      <Focusable
        id="hero-mute-button"
        zoneId={ZONES.HERO_MUTE}
        zonePriority={80}
        navigationRules={{
          left: 'hero-more-info-button',
          down: ZONES.CONTINUE_WATCHING, // Allow down navigation
        }}
        className="absolute bottom-8 right-8 z-20"
      >
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={cn(
            'w-10 h-10 md:w-12 md:h-12',
            'flex items-center justify-center',
            'rounded-full border-2 border-white/60',
            'bg-black/40 hover:bg-black/60',
            'transition-all duration-200'
          )}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
          )}
        </button>
      </Focusable>
    </motion.div>
  );
}
