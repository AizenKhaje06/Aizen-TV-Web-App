'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { VideoSource } from '@/services/player/types';
import { PlayerFrame } from './player-frame';
import { PlayerControls } from './player-controls';
import { usePlayerStoreV2 } from '@/store/player-store-v2';
import { useHistoryStore } from '@/store/history-store';
import { cn } from '@/lib/cn';

interface VideoPlayerProps {
  source: VideoSource;
  className?: string;
  onEnded?: () => void;
}

export function VideoPlayer({ source, className = '' }: VideoPlayerProps) {
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<NodeJS.Timeout>();
  
  // Use selectors to get only what we need
  const isPaused = usePlayerStoreV2((state) => state.isPaused);
  const setCurrentMedia = usePlayerStoreV2((state) => state.setCurrentMedia);
  const setLoading = usePlayerStoreV2((state) => state.setLoading);
  const play = usePlayerStoreV2((state) => state.play);
  const setError = usePlayerStoreV2((state) => state.setError);
  const setFullscreen = usePlayerStoreV2((state) => state.setFullscreen);
  
  const historyStore = useHistoryStore();

  // Set current media in store - using useRef to prevent infinite loop
  const hasInitialized = useRef(false);
  
  useEffect(() => {
    if (!hasInitialized.current) {
      setCurrentMedia(
        source.tmdbId,
        source.type,
        source.title,
        source.season,
        source.episode
      );
      setLoading(true);
      hasInitialized.current = true;
    }
    // Note: setCurrentMedia and setLoading are stable Zustand actions, not needed in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.tmdbId, source.type, source.title, source.season, source.episode]);

  // Add to history when player loads
  useEffect(() => {
    historyStore.addToHistory({
      mediaId: source.tmdbId,
      mediaType: source.type,
      title: source.title,
      posterPath: null,
      backdropPath: null,
      season: source.season,
      episode: source.episode,
      progress: 0,
      duration: 0,
      currentTime: 0,
    });
    // Note: historyStore is not in dependencies because it's a stable reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source.tmdbId, source.type, source.title, source.season, source.episode]);

  // Auto-hide controls
  const scheduleHideControls = useCallback(() => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }

    hideControlsTimer.current = setTimeout(() => {
      if (!isPaused) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPaused]);

  // Show controls on mouse move
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    scheduleHideControls();
  }, [scheduleHideControls]);

  // Toggle fullscreen
  const handleToggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      setFullscreen(isNowFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [setFullscreen]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'f':
        case 'F':
          handleToggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            handleToggleFullscreen();
          }
          break;
        case ' ':
          e.preventDefault();
          setShowControls(true);
          scheduleHideControls();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, handleToggleFullscreen, scheduleHideControls]);

  const handlePlayerLoad = () => {
    setLoading(false);
    play();
  };

  const handlePlayerError = (error: string) => {
    setLoading(false);
    setError(error);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full bg-black',
        isFullscreen ? 'h-screen' : 'aspect-video',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Player Frame */}
      <PlayerFrame
        source={source}
        onLoad={handlePlayerLoad}
        onError={handlePlayerError}
      />

      {/* Player Controls Overlay */}
      <PlayerControls
        show={showControls || isPaused}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </div>
  );
}
