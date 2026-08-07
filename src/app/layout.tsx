import type { Metadata } from 'next';
import './globals.css';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { JsonLd } from '@/components/seo/JsonLd';
import { WebVitalsReporter } from '@/components/analytics/WebVitalsReporter';

export const metadata: Metadata = {
  title: 'Malpas Cricket Club (Cheshire) • M.D.S.C. Official Portal',
  description: 'Official digital portal for Malpas Cricket Club (Cheshire). Featuring 1st XI, 2nd XI & Sunday XI fixtures, player statistics, 2D touch scoring, and 3D WebGL innings simulation.',
  keywords: [
    'Malpas Cricket Club',
    'Malpas CC',
    'Cheshire Cricket League',
    'Village Cricket Scoring',
    'Cricket Scoring App',
    '3D Cricket Simulation',
    '2D Wagon Wheel',
    'Cheshire Cricket',
  ],
  authors: [{ name: 'Malpas Cricket Club', url: 'https://malpas.play-cricket.com' }],
  creator: 'Malpas Cricket Club',
  publisher: 'Malpas Cricket Club',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://malpas.play-cricket.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Malpas Cricket Club (Cheshire) • M.D.S.C.',
    description: 'Official portal for Malpas CC. Live 2D scoring, 3D WebGL innings simulation, fixtures, and player statistics.',
    url: 'https://malpas.play-cricket.com',
    siteName: 'Malpas Cricket Club',
    images: [
      {
        url: '/badge.jpg',
        width: 800,
        height: 800,
        alt: 'Malpas CC Crest M.D.S.C.',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Malpas Cricket Club (Cheshire) • M.D.S.C.',
    description: 'Official digital portal & live 3D scoring app for Malpas Cricket Club.',
    images: ['/badge.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050b18" />
        <link rel="icon" href="/badge.jpg" />
        <JsonLd />
      </head>
      <body className="min-h-screen bg-malpas-navy text-foreground antialiased selection:bg-malpas-blue selection:text-white">
        <GoogleAnalytics />
        <WebVitalsReporter />
        {children}
      </body>
    </html>
  );
}
