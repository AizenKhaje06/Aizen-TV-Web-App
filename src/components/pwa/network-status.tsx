'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/use-online-status';

export function NetworkStatus() {
  const { isOnline, wasOffline } = useOnlineStatus();

  // Show offline banner
  if (!isOnline) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black"
        >
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              <WifiOff className="w-4 h-4" />
              <span>You&apos;re offline. Some features may be unavailable.</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Show reconnection notice briefly
  if (wasOffline) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white"
        >
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              <Wifi className="w-4 h-4" />
              <span>Back online!</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
