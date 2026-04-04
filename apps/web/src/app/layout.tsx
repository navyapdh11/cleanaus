import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: {
    default: 'CleanAUS | Professional Cleaning Services Australia',
    template: '%s | CleanAUS',
  },
  description: 'Enterprise-grade cleaning services across Australia. Residential, commercial, and strata cleaning in NSW, VIC, QLD, WA, SA, TAS, ACT, NT.',
  keywords: ['cleaning services', 'Australia', 'residential cleaning', 'commercial cleaning', 'strata cleaning', 'end of lease cleaning'],
  authors: [{ name: 'CleanAUS Pty Ltd' }],
  creator: 'CleanAUS',
  publisher: 'CleanAUS Pty Ltd',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cleanaus.com.au'),
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://cleanaus.com.au',
    title: 'CleanAUS | Professional Cleaning Services Australia',
    description: 'Enterprise-grade cleaning services across all Australian regions',
    siteName: 'CleanAUS',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CleanAUS - Professional Cleaning Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CleanAUS | Professional Cleaning Services Australia',
    description: 'Enterprise-grade cleaning services across all Australian regions',
    images: ['/twitter-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
