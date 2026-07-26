'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { useSettingsStore } from '@/store/settings-store';
import { useHistoryStore } from '@/store/history-store';
import { User, Tv, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [showClearConfirm, setShowClearConfirm] = useState<'history' | null>(null);
  
  const isTVMode = useSettingsStore((state) => state.isTVMode);
  const setTVMode = useSettingsStore((state) => state.setTVMode);
  
  const historyCount = useHistoryStore((state) => state.history.length);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  const handleClearHistory = () => {
    clearHistory();
    setShowClearConfirm(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 max-w-4xl">
          {/* Page Header */}
          <div className="flex items-center space-x-3 mb-8">
            <User className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Profile & Settings
              </h1>
              <p className="text-gray-400">
                Manage your preferences and data
              </p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* TV Mode Setting */}
            <div className="bg-gray-900/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Tv className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-white">
                  Display Mode
                </h2>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">
                  Choose how MyStream should display. TV Mode is optimized for large screens and remote control navigation.
                </p>
                
                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
                  <div>
                    <p className="text-white font-medium">TV Mode</p>
                    <p className="text-gray-400 text-sm">
                      Currently: {isTVMode ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <Button
                    onClick={() => setTVMode(!isTVMode)}
                    variant={isTVMode ? 'default' : 'outline'}
                    className="min-w-[100px]"
                  >
                    {isTVMode ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-gray-900/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                <h2 className="text-xl font-semibold text-white">
                  Data Management
                </h2>
              </div>

              {/* Clear History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
                  <div>
                    <p className="text-white font-medium">Watch History</p>
                    <p className="text-gray-400 text-sm">
                      {historyCount} {historyCount === 1 ? 'item' : 'items'} stored
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowClearConfirm('history')}
                    variant="destructive"
                    disabled={historyCount === 0}
                    className="min-w-[100px]"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>

                {showClearConfirm === 'history' && (
                  <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 space-y-3">
                    <p className="text-red-200 text-sm font-medium">
                      Are you sure you want to clear all watch history?
                    </p>
                    <p className="text-red-300/70 text-xs">
                      This action cannot be undone. All viewing progress will be lost.
                    </p>
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleClearHistory}
                        variant="destructive"
                        size="sm"
                      >
                        Yes, Clear History
                      </Button>
                      <Button
                        onClick={() => setShowClearConfirm(null)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* App Info */}
            <div className="bg-gray-900/50 rounded-lg p-6">
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="text-white font-medium">MyStream</span> v1.2.0
                </p>
                <p className="text-gray-500">
                  Built with Next.js 15, TypeScript, and Modern Web Technologies
                </p>
                <p className="text-gray-500 text-xs">
                  Content data provided by TMDB
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
