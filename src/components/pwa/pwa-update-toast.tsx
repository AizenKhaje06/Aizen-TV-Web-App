'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import { useServiceWorkerUpdate } from '@/hooks/use-sw-update';
import { cn } from '@/lib/cn';

interface PWAUpdateToastProps {
  className?: string;
}

export function PWAUpdateToast({ className }: PWAUpdateToastProps) {
  const { isUpdateAvailable, isUpdating, updateServiceWorker, dismissUpdate } =
    useServiceWorkerUpdate();

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={cn(
          'fixed bottom-4 right-4 z-50 bg-background border border-border shadow-2xl rounded-lg overflow-hidden max-w-sm',
          className
        )}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Update Available</p>
                <p className="text-xs text-muted-foreground mt-1">
                  A new version of MyStream is ready
                </p>
              </div>
            </div>
            <button
              onClick={dismissUpdate}
              className="p-1 hover:bg-muted rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={updateServiceWorker}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isUpdating ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                'Update Now'
              )}
            </button>
            <button
              onClick={dismissUpdate}
              className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors text-sm"
            >
              Later
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
