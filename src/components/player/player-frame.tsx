'use client';

import { useEffect, useRef, useState } from 'react';
import { VideoSource } from '@/services/player/types';
import { getIframeSandbox, getIframeAllow, getPlayerConfig } from '@/services/player/player-builder';
import { LoadingIndicator } from './loading-indicator';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlayerFrameProps {
  source: VideoSource;
  onLoad?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function PlayerFrame({ source, onLoad, onError, className = '' }: PlayerFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const onErrorRef = useRef(onError);
  const onLoadRef = useRef(onLoad);

  // Update refs when props change
  useEffect(() => {
    onErrorRef.current = onError;
    onLoadRef.current = onLoad;
  }, [onError, onLoad]);

  const config = getPlayerConfig();

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

    // Auto-hide loading after a short delay (iframe onLoad is unreliable with external sources)
    const timeout = setTimeout(() => {
      setIsLoading(false);
      // Don't set error automatically - let actual errors trigger it
    }, 3000); // Just hide loading spinner after 3 seconds

    return () => clearTimeout(timeout);
  }, [source.url]); // Only depend on source.url

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (onLoadRef.current) {
      onLoadRef.current();
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('Failed to load player');
    if (onErrorRef.current) {
      onErrorRef.current('Failed to load iframe');
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
    
    // Force iframe reload
    if (iframeRef.current) {
      iframeRef.current.src = source.url;
    }
  };

  return (
    <div className={`relative w-full h-full bg-black ${className}`}>
      {/* Loading State */}
      {isLoading && <LoadingIndicator message="Loading video..." />}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-white text-lg mb-2">Unable to load video</p>
          <p className="text-gray-400 text-sm mb-6">{errorMessage}</p>
          <Button onClick={handleRetry}>Try Again</Button>
        </div>
      )}

      {/* Player Iframe */}
      <iframe
        ref={iframeRef}
        src={source.url}
        className="w-full h-full border-0"
        allow={getIframeAllow(config)}
        sandbox={getIframeSandbox()}
        allowFullScreen={config.allowFullscreen}
        referrerPolicy="origin"
        onLoad={handleLoad}
        onError={handleError}
        title={`Playing ${source.title}`}
        style={{ display: hasError ? 'none' : 'block' }}
      />
    </div>
  );
}
