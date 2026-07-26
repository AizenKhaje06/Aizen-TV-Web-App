/**
 * Navigation Zone Configurations
 * Defines all navigation zones and their connections
 */

import { ZoneConfig } from './types';

export const ZONES = {
  SIDEBAR: 'sidebar',
  HERO: 'hero-buttons',
  HERO_MUTE: 'hero-mute',
  CONTINUE_WATCHING: 'continue-watching',
  TRENDING: 'trending-right-now',
  STUDIOS: 'studios-platforms',
  NEW_MOVIES: 'new-movies',
  POPULAR_TV: 'popular-tv-shows',
  ACTION: 'action',
  COMEDY: 'comedy',
  DRAMA: 'drama',
  HORROR: 'horror',
  SCI_FI: 'sci-fi',
  THRILLER: 'thriller',
  ROMANCE: 'romance',
  ANIMATION: 'animation',
  CRIME: 'crime',
  DOCUMENTARY: 'documentary',
  TRENDING_ANIME: 'trending-anime',
} as const;

/**
 * Zone configurations with entry points and exit rules
 */
export const zoneConfigs: ZoneConfig[] = [
  // Sidebar Zone
  {
    id: ZONES.SIDEBAR,
    priority: 100,
    entryPoint: 'sidebar-home', // First nav item
    exitRules: {
      right: ZONES.HERO, // Exit to hero buttons
      left: null, // Block left (edge of screen)
      up: null, // Handled by sidebar internally
      down: null, // Handled by sidebar internally
    },
  },

  // Hero Banner Zone
  {
    id: ZONES.HERO,
    priority: 90,
    entryPoint: 'hero-play-button',
    exitRules: {
      left: ZONES.SIDEBAR,
      right: ZONES.HERO_MUTE,
      down: ZONES.CONTINUE_WATCHING,
      up: null, // Block up (top of page)
    },
  },

  // Hero Mute Button Zone
  {
    id: ZONES.HERO_MUTE,
    priority: 85,
    exitRules: {
      left: ZONES.HERO,
      down: ZONES.CONTINUE_WATCHING,
      right: null, // Block right (edge)
      up: null,
    },
  },

  // Content Section Zones (in order of appearance)
  {
    id: ZONES.CONTINUE_WATCHING,
    priority: 80,
    exitRules: {
      up: ZONES.HERO,
      down: ZONES.TRENDING,
      left: ZONES.SIDEBAR, // From first card
    },
  },

  {
    id: ZONES.TRENDING,
    priority: 75,
    exitRules: {
      up: ZONES.CONTINUE_WATCHING,
      down: ZONES.STUDIOS,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.STUDIOS,
    priority: 70,
    exitRules: {
      up: ZONES.TRENDING,
      down: ZONES.NEW_MOVIES,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.NEW_MOVIES,
    priority: 65,
    exitRules: {
      up: ZONES.STUDIOS,
      down: ZONES.POPULAR_TV,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.POPULAR_TV,
    priority: 60,
    exitRules: {
      up: ZONES.NEW_MOVIES,
      down: ZONES.ACTION,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.ACTION,
    priority: 55,
    exitRules: {
      up: ZONES.POPULAR_TV,
      down: ZONES.COMEDY,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.COMEDY,
    priority: 50,
    exitRules: {
      up: ZONES.ACTION,
      down: ZONES.DRAMA,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.DRAMA,
    priority: 45,
    exitRules: {
      up: ZONES.COMEDY,
      down: ZONES.HORROR,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.HORROR,
    priority: 40,
    exitRules: {
      up: ZONES.DRAMA,
      down: ZONES.SCI_FI,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.SCI_FI,
    priority: 35,
    exitRules: {
      up: ZONES.HORROR,
      down: ZONES.THRILLER,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.THRILLER,
    priority: 30,
    exitRules: {
      up: ZONES.SCI_FI,
      down: ZONES.ROMANCE,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.ROMANCE,
    priority: 25,
    exitRules: {
      up: ZONES.THRILLER,
      down: ZONES.ANIMATION,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.ANIMATION,
    priority: 20,
    exitRules: {
      up: ZONES.ROMANCE,
      down: ZONES.CRIME,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.CRIME,
    priority: 15,
    exitRules: {
      up: ZONES.ANIMATION,
      down: ZONES.DOCUMENTARY,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.DOCUMENTARY,
    priority: 10,
    exitRules: {
      up: ZONES.CRIME,
      down: ZONES.TRENDING_ANIME,
      left: ZONES.SIDEBAR,
    },
  },

  {
    id: ZONES.TRENDING_ANIME,
    priority: 5,
    exitRules: {
      up: ZONES.DOCUMENTARY,
      down: null, // Last section, block down or wrap to top
      left: ZONES.SIDEBAR,
    },
  },
];

/**
 * Helper to get zone config by ID
 */
export function getZoneConfig(zoneId: string): ZoneConfig | undefined {
  return zoneConfigs.find((zone) => zone.id === zoneId);
}

/**
 * Initialize all zones in the navigator
 */
export function initializeZones(navigator: any): void {
  zoneConfigs.forEach((zone) => {
    navigator.registerZone(zone);
  });
}
