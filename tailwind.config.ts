import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        foreground: '#FFFFFF',
        primary: {
          DEFAULT: '#E50914',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#2A2A2A',
          foreground: '#A0A0A0',
        },
        accent: {
          DEFAULT: '#E50914',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#141414',
          foreground: '#FFFFFF',
        },
        border: '#2A2A2A',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'slide-in': 'slide-in 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
