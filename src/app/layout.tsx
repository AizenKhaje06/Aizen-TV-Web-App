import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { siteConfig } from '@/config/site.config';
import { PWAInstallPrompt, PWAUpdateToast, NetworkStatus } from '@/components/pwa';
import { PerformanceMonitor } from '@/components/common/performance-monitor';
import { SplashProvider } from '@/components/common/splash-provider';
import { TVLayoutProvider } from '@/components/tv/tv-layout-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['streaming', 'movies', 'tv shows', 'netflix', 'watch online'],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: siteConfig.name,
    startupImage: [
      {
        url: '/Logo.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
  icons: {
    icon: '/Logo.png',
    apple: '/Logo.png',
    shortcut: '/Logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.theme.background,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MyStream" />
        <link rel="apple-touch-icon" href="/Logo.png" />
        <link rel="icon" type="image/png" href="/Logo.png" />
        <link rel="shortcut icon" href="/Logo.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <SplashProvider>
            <TVLayoutProvider>
              <PerformanceMonitor />
              <NetworkStatus />
              <PWAInstallPrompt variant="banner" />
              {children}
              <PWAUpdateToast />
            </TVLayoutProvider>
          </SplashProvider>
        </Providers>
      </body>
    </html>
  );
}
