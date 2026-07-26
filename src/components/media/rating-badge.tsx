'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

interface RatingBadgeProps {
  rating: number;
  maxRating?: number;
  showStar?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RatingBadge({
  rating,
  maxRating = 10,
  showStar = true,
  size = 'md',
  className,
}: RatingBadgeProps) {
  const percentage = (rating / maxRating) * 100;
  
  const getColor = () => {
    if (percentage >= 75) return 'bg-green-600';
    if (percentage >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-semibold text-white',
        getColor(),
        sizeClasses[size],
        className
      )}
    >
      {showStar && <Star className={cn('fill-current', iconSizes[size])} />}
      <span>{rating.toFixed(1)}</span>
    </div>
  );
}
