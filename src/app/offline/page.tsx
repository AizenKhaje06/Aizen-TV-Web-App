'use client';

import { WifiOff, RefreshCw, Heart } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>

        {/* Logo */}
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">MyStream</h1>
          <p className="text-sm text-muted-foreground">You&apos;re Offline</p>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">No Internet Connection</h2>
          <p className="text-muted-foreground">
            It looks like you&apos;ve lost your internet connection. Please check your network
            settings and try again.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="block w-full px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Go to Home
          </Link>
        </div>

        {/* Info */}
        <div className="pt-6 space-y-4">
          <div className="p-4 bg-muted rounded-lg text-left">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Available Offline
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your favorites list</li>
              <li>• App settings and preferences</li>
              <li>• Watch history</li>
              <li>• Previously viewed pages</li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            Some features require an internet connection to work properly, including browsing
            new content and streaming videos.
          </p>
        </div>
      </div>
    </div>
  );
}
