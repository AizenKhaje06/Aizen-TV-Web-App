'use client';

import { Search, Film, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: 'search' | 'film' | 'tv';
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'search',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const Icon = icon === 'search' ? Search : icon === 'film' ? Film : Tv;
  
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gray-800 p-4">
            <Icon className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        
        <h2 className="mb-3 text-2xl font-bold text-white">
          {title}
        </h2>
        
        {description && (
          <p className="mb-6 text-gray-400">
            {description}
          </p>
        )}
        
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
