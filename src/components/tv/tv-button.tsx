'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { buttonVariants } from '@/styles/animations';
import { cn } from '@/lib/cn';
import { forwardRef } from 'react';

interface TVButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const TVButton = forwardRef<HTMLButtonElement, TVButtonProps>(
  ({ children, variant = 'primary', size = 'md', className, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-primary hover:bg-primary/90 text-white',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
      ghost: 'bg-transparent hover:bg-white/10 text-white border-2 border-white/60',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        whileFocus="focused"
        className={cn(
          'rounded-lg font-semibold transition-all',
          'focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

TVButton.displayName = 'TVButton';
