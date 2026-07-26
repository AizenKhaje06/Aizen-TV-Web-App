import { env } from './env';

export const siteConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  description: 'Netflix-style streaming platform for movies and TV shows',
  url: env.NEXT_PUBLIC_APP_URL,
  theme: {
    background: '#050505',
    primary: '#E50914',
    secondary: '#1A1A1A',
  },
  navigation: {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Movies', href: '/movies' },
      { name: 'TV Shows', href: '/tv' },
      { name: 'Favorites', href: '/favorites' },
      { name: 'History', href: '/history' },
    ],
  },
  features: {
    enablePWA: true,
    enableTVMode: true,
    enableOffline: true,
  },
} as const;
