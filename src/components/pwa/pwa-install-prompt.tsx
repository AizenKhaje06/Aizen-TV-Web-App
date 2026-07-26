'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/use-install-prompt';
import { cn } from '@/lib/cn';

interface PWAInstallPromptProps {
  variant?: 'banner' | 'button';
  className?: string;
}

export function PWAInstallPrompt({ variant = 'banner', className }: PWAInstallPromptProps) {
  const { isInstallable, promptInstall, dismissPrompt } = useInstallPrompt();
  const [isVisible, setIsVisible] = useState(true);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    dismissPrompt();
    setIsVisible(false);
  };

  if (!isInstallable || !isVisible) {
    return null;
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleInstall}
        className={cn(
          'flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors',
          className
        )}
      >
        <Download className="w-4 h-4" />
        <span>Install App</span>
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-primary text-white shadow-lg',
          className
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm md:text-base">
                  Install MyStream
                </p>
                <p className="text-xs md:text-sm text-white/80">
                  Get a faster, app-like experience
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-white text-primary font-semibold rounded hover:bg-white/90 transition-colors text-sm md:text-base whitespace-nowrap"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
