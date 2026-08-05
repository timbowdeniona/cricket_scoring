import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Village Cricket Scorer',
  description: 'Interactive 2D field scoring, stroke analytics, and 3D WebGL innings simulation for village cricket',
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
        <meta name="theme-color" content="#10b981" />
      </head>
      <body className="min-h-screen bg-[#090f0c] text-foreground antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
