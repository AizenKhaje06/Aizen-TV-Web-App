/**
 * MyStream Design System
 * Netflix-style theme configuration
 */

export const theme = {
  colors: {
    // Base colors
    background: '#050505',
    foreground: '#FFFFFF',
    
    // Brand colors
    primary: '#E50914',
    primaryHover: '#F40612',
    primaryActive: '#B20710',
    
    // Gray scale
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    
    // Semantic colors
    secondary: '#B3B3B3',
    muted: '#808080',
    border: '#2A2A2A',
    
    // Status colors
    success: '#46D369',
    warning: '#FFA726',
    error: '#F44336',
    info: '#29B6F6',
  },
  
  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
      mono: 'ui-monospace, monospace',
    },
    
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
    },
    
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    },
    
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },
  
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
    
    // Netflix-style glow
    glow: '0 0 20px rgba(229, 9, 20, 0.5)',
    glowLg: '0 0 40px rgba(229, 9, 20, 0.6)',
  },
  
  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    tv: '1920px',
  },
  
  // Netflix-specific sizes
  card: {
    poster: {
      mobile: {
        width: '150px',
        height: '225px',
      },
      tablet: {
        width: '180px',
        height: '270px',
      },
      desktop: {
        width: '200px',
        height: '300px',
      },
      tv: {
        width: '280px',
        height: '420px',
      },
    },
    landscape: {
      mobile: {
        width: '250px',
        height: '141px',
      },
      tablet: {
        width: '300px',
        height: '169px',
      },
      desktop: {
        width: '350px',
        height: '197px',
      },
      tv: {
        width: '500px',
        height: '281px',
      },
    },
  },
  
  // Focus styles for TV
  focus: {
    ring: '4px',
    offset: '2px',
    scale: '1.05',
    scaleLarge: '1.1',
  },
} as const;

export type Theme = typeof theme;
