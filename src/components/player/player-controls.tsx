'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize, Minimize } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePlayerStoreV2 } from '@/store/player-store-v2';
import { useSettingsStore } from '@/store/settings-store';
import { cn } from '@/lib/cn';

interface PlayerControlsProps {
  show: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

export function PlayerControls({ show, onToggleFullscreen, className = '' }: PlayerControlsProps) {
  const router = useRouter();
  const { isFullscreen, currentTitle } = usePlayerStoreV2();
  const isTVMode = useSettingsStore((state) => state.isTVMode);

  const handleBack = () => {
    router.back();
  };

  const handleToggleFullscreen = () => {
    onToggleFullscreen?.();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'absolute inset-0 z-40 pointer-events-none',
            className
          )}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6 pointer-events-auto">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className={cn(
                  'flex items-center gap-2 text-white hover:text-gray-300 transition-colors',
                  isTVMode && 'focus:ring-4 focus:ring-primary rounded-lg p-2'
                )}
                aria-label="Go back"
              >
                <X className="w-6 h-6 md:w-8 md:h-8" />
                <span className="text-sm md:text-base font-medium">Back</span>
              </button>

              {/* Title */}
              {currentTitle && (
                <h1 className="text-white text-lg md:text-xl font-semibold truncate max-w-md">
                  {currentTitle}
                </h1>
              )}

              {/* Fullscreen Toggle */}
              <button
                onClick={handleToggleFullscreen}
                className={cn(
                  'flex items-center gap-2 text-white hover:text-gray-300 transition-colors',
                  isTVMode && 'focus:ring-4 focus:ring-primary rounded-lg p-2'
                )}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="w-6 h-6 md:w-8 md:h-8" />
                ) : (
                  <Maximize className="w-6 h-6 md:w-8 md:h-8" />
                )}
              </button>
            </div>
          </div>

          {/* Bottom Bar - Can be extended with more controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 pointer-events-auto">
            {/* Future: Add play/pause, progress bar, volume controls here if needed */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
