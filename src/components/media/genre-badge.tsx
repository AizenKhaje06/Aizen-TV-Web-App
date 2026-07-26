'use client';

import { cn } from '@/lib/cn';

interface GenreBadgeProps {
  genre: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined';
  className?: string;
}

export function GenreBadge({
  genre,
  size = 'md',
  variant = 'default',
  className,
}: GenreBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const variantClasses = {
    default: 'bg-gray-800/80 text-gray-200',
    outlined: 'border border-gray-600 text-gray-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {genre}
    </span>
  );
}
