/**
 * Splash Screen Component
 * 
 * Displays intro video when app first loads.
 * Shows once per session, skippable by user.
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const SPLASH_SHOWN_KEY = 'mystream-splash-shown';

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if splash has been shown this session
    const hasShown = sessionStorage.getItem(SPLASH_SHOWN_KEY);
    
    if (!hasShown) {
      setIsVisible(true);
      sessionStorage.setItem(SPLASH_SHOWN_KEY, 'true');
    } else {
      onComplete?.();
    }
  }, [onComplete]);

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    // Auto-close after video ends
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete?.();
    }, 300);
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      >
        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={handleSkip}
          className="absolute top-8 right-8 z-10 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white font-medium transition-colors"
        >
          <span>Skip</span>
          <X className="w-5 h-5" />
        </motion.button>

        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="max-w-full max-h-full object-contain"
        >
          <source src="/intro_video.mp4" type="video/mp4" />
        </video>

        {/* Loading indicator (shows before video loads) */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </motion.div>

        {/* Tap/Click to skip hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoEnded ? 0 : 1 }}
          transition={{ delay: 3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm"
        >
          Tap anywhere to skip
        </motion.div>

        {/* Clickable overlay to skip */}
        <div
          onClick={handleSkip}
          className="absolute inset-0 cursor-pointer"
          style={{ zIndex: -1 }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
