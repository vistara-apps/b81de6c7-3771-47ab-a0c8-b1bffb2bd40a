import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'CircleUp - Professional Coffee Connections',
  description: 'Serendipitous professional connections, brewed over virtual coffee.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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
          <main className="min-h-screen bg-bg">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
