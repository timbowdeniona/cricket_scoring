import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Malpas Cricket Club (Cheshire) • M.D.S.C.',
  description: 'Official digital portal, fixtures, player statistics, live 2D scoring, and 3D WebGL innings simulation for Malpas Cricket Club (Cheshire)',
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
      </head>
      <body className="min-h-screen bg-malpas-navy text-foreground antialiased selection:bg-malpas-blue selection:text-white">
        {children}
      </body>
    </html>
  );
}
