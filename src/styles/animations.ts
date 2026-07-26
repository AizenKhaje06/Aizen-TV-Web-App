/**
 * Animation presets for Framer Motion
 * Optimized for smooth performance on Android TV
 */

import { Variants, Transition } from 'framer-motion';

// Transition presets
export const transitions = {
  fast: {
    duration: 0.15,
    ease: 'easeOut',
  } as Transition,
  
  base: {
    duration: 0.2,
    ease: 'easeOut',
  } as Transition,
  
  slow: {
    duration: 0.3,
    ease: 'easeInOut',
  } as Transition,
  
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  } as Transition,
  
  springBouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
  } as Transition,
};

// Fade animations
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.base,
  },
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base,
  },
};

export const fadeInDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base,
  },
};

// Scale animations
export const scaleVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: transitions.fast },
  tap: { scale: 0.98, transition: transitions.fast },
};

export const scaleFadeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.base,
  },
};

// Card animations (Netflix-style)
export const cardVariants: Variants = {
  initial: {
    scale: 1,
    zIndex: 0,
  },
  hover: {
    scale: 1.05,
    zIndex: 10,
    transition: transitions.fast,
  },
  tap: {
    scale: 1.02,
    zIndex: 10,
    transition: transitions.fast,
  },
  focused: {
    scale: 1.1,
    zIndex: 10,
    transition: transitions.fast,
  },
};

export const cardLargeVariants: Variants = {
  initial: {
    scale: 1,
    zIndex: 0,
  },
  hover: {
    scale: 1.08,
    zIndex: 10,
    transition: transitions.fast,
  },
  tap: {
    scale: 1.05,
    zIndex: 10,
    transition: transitions.fast,
  },
  focused: {
    scale: 1.15,
    zIndex: 10,
    transition: transitions.springBouncy,
  },
};

// Slide animations
export const slideInLeftVariants: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: transitions.base,
  },
};

export const slideInRightVariants: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: transitions.base,
  },
};

// Hero banner animation
export const heroBannerVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Modal animations
export const modalOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.base,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.base,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: transitions.fast,
  },
};

// Carousel animations
export const carouselVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

// Stagger children animation
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.base,
  },
};

// Page transitions
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Focus ring animation (TV)
export const focusRingVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 0,
  },
  focused: {
    scale: 1.05,
    opacity: 1,
    transition: transitions.fast,
  },
  blur: {
    scale: 1,
    opacity: 0,
    transition: transitions.fast,
  },
};

// Skeleton pulse animation
export const skeletonVariants: Variants = {
  initial: {
    opacity: 0.6,
  },
  animate: {
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

// Navbar animation
export const navbarVariants: Variants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.base,
  },
  scrolled: {
    backgroundColor: 'rgba(5, 5, 5, 0.95)',
    backdropFilter: 'blur(10px)',
    transition: transitions.base,
  },
};

// Button animations
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.95,
    transition: transitions.fast,
  },
  focused: {
    scale: 1.08,
    transition: transitions.fast,
  },
};
