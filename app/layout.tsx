import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'CircleUp - Professional Coffee Connections',
  description: 'Serendipitous professional connections, brewed over virtual coffee.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="min-h-screen bg-[hsl(210,35%,95%)]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
