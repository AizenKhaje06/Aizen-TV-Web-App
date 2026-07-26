/**
 * Splash Provider
 * 
 * Manages splash screen visibility and app readiness.
 */

'use client';

import { useState, ReactNode } from 'react';
import { SplashScreen } from './splash-screen';

interface SplashProviderProps {
  children: ReactNode;
}

export function SplashProvider({ children }: SplashProviderProps) {
  const [isAppReady, setIsAppReady] = useState(false);

  const handleSplashComplete = () => {
    setIsAppReady(true);
  };

  return (
    <>
      {!isAppReady && <SplashScreen onComplete={handleSplashComplete} />}
      {isAppReady && children}
    </>
  );
}
