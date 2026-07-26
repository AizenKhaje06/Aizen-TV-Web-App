'use client';

import { motion } from 'framer-motion';
import { skeletonVariants } from '@/styles/animations';
import { cn } from '@/lib/cn';

interface SkeletonCardProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'poster' | 'landscape';
  className?: string;
}

export function SkeletonCard({
  size = 'md',
  variant = 'poster',
  className,
}: SkeletonCardProps) {
  const posterSizes = {
    sm: 'w-[150px] h-[225px]',
    md: 'w-[200px] h-[300px]',
    lg: 'w-[280px] h-[420px]',
  };

  const landscapeSizes = {
    sm: 'w-[250px] h-[141px]',
    md: 'w-[350px] h-[197px]',
    lg: 'w-[500px] h-[281px]',
  };

  const sizeClasses = variant === 'poster' ? posterSizes : landscapeSizes;

  return (
    <motion.div
      variants={skeletonVariants}
      initial="initial"
      animate="animate"
      className={cn(
        'rounded-lg bg-gray-800',
        sizeClasses[size],
        className
      )}
    >
      <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
    </motion.div>
  );
}

export function SkeletonRow({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {/* Title skeleton */}
      <div className="h-6 w-48 bg-gray-800 rounded animate-pulse" />
      
      {/* Cards skeleton */}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
