'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = 'Loading player...' }: LoadingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-50"
    >
      <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
      <p className="text-white text-lg">{message}</p>
    </motion.div>
  );
}
