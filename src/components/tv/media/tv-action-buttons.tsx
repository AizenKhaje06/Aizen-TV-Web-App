/**
 * TV Action Buttons
 * 
 * TV-optimized action buttons for detail pages.
 * Features focus management and TV-friendly sizing.
 */

'use client';

import { Play, Plus, Share2, Check } from 'lucide-react';
import { TVFocusGroup } from '../focus/tv-focus-group';
import { TVFocusable } from '../focus/tv-focusable';

interface TVActionButtonsProps {
  onPlay: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  onShare?: () => void;
}

export function TVActionButtons({
  onPlay,
  onToggleFavorite,
  isFavorite,
  onShare,
}: TVActionButtonsProps) {
  return (
    <TVFocusGroup groupId="actions" className="flex flex-wrap gap-4">
      {/* Play Button - Primary */}
      <TVFocusable
        onSelect={onPlay}
        className="flex items-center gap-3 px-10 py-4 bg-white text-black rounded-lg font-semibold text-xl hover:bg-gray-200 transition-colors"
      >
        <Play className="w-7 h-7 fill-current" />
        Play
      </TVFocusable>

      {/* Add to List Button */}
      <TVFocusable
        onSelect={onToggleFavorite}
        className="flex items-center gap-3 px-8 py-4 bg-gray-700/80 text-white rounded-lg font-semibold text-xl hover:bg-gray-600/80 transition-colors border-2 border-gray-600"
      >
        {isFavorite ? (
          <>
            <Check className="w-7 h-7" />
            In My List
          </>
        ) : (
          <>
            <Plus className="w-7 h-7" />
            Add to List
          </>
        )}
      </TVFocusable>

      {/* Share Button (optional) */}
      {onShare && (
        <TVFocusable
          onSelect={onShare}
          className="flex items-center gap-3 px-8 py-4 bg-gray-700/80 text-white rounded-lg font-semibold text-xl hover:bg-gray-600/80 transition-colors border-2 border-gray-600"
        >
          <Share2 className="w-7 h-7" />
          Share
        </TVFocusable>
      )}
    </TVFocusGroup>
  );
}
