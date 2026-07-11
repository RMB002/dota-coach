import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Dota 2 Analytica - AI Performance Coach',
  description: 'Track and analyze your Dota 2 matches using STRATZ and Gemini AI coaching.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

