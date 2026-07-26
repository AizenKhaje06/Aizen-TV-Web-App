/**
 * Adaptive Action Buttons
 * 
 * Automatically switches between standard buttons and TV action buttons
 * based on TV mode detection.
 */

'use client';

import { Play, Plus, Share2, Check } from 'lucide-react';
import { useTVMode } from '@/hooks/use-tv-mode';
import { Button } from '@/components/ui/button';
import { TVActionButtons } from '@/components/tv/media/tv-action-buttons';

interface AdaptiveActionButtonsProps {
  onPlay: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  onShare?: () => void;
}

export function AdaptiveActionButtons({
  onPlay,
  onToggleFavorite,
  isFavorite,
  onShare,
}: AdaptiveActionButtonsProps) {
  const { isTVMode } = useTVMode();

  // In TV mode, use TV action buttons
  if (isTVMode) {
    return (
      <TVActionButtons
        onPlay={onPlay}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
        onShare={onShare}
      />
    );
  }

  // Standard web mode buttons
  return (
    <div className="flex flex-wrap gap-3">
      <Button size="lg" onClick={onPlay} className="gap-2 text-lg px-8">
        <Play className="w-6 h-6 fill-current" />
        Play
      </Button>
      
      <Button
        size="lg"
        variant="outline"
        onClick={onToggleFavorite}
        className="gap-2 text-lg"
      >
        {isFavorite ? (
          <>
            <Check className="w-6 h-6" />
            In My List
          </>
        ) : (
          <>
            <Plus className="w-6 h-6" />
            Add to List
          </>
        )}
      </Button>
      
      {onShare && (
        <Button size="lg" variant="ghost" className="gap-2" onClick={onShare}>
          <Share2 className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}
