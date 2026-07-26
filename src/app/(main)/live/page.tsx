'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Radio } from 'lucide-react';

export default function LiveTVPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
          {/* Page Header */}
          <div className="flex items-center space-x-3 mb-8">
            <Radio className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Live TV
              </h1>
              <p className="text-gray-400">
                Watch live television channels
              </p>
            </div>
          </div>

          {/* Coming Soon Message */}
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Radio className="w-20 h-20 text-gray-700" />
            <h2 className="text-2xl font-semibold text-gray-400">
              Coming Soon
            </h2>
            <p className="text-gray-500 text-center max-w-md">
              Live TV streaming is currently under development. Check back soon to watch live television channels!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
