import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://dividizky.vercel.app/'),
  title: {
    default: 'Dividizky',
    template: '%s | Dividizky',
  },
  description:
    'App to easily and fairly calculate how to divide expenses between a group of people',
  applicationName: 'Dividizky',
  authors: [{ name: 'Izky', url: 'https://izky.dev/' }],
  keywords: ['Calculadora de Gastos', 'División de Gastos', 'Calculadora Justa'],
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Dividizky',
    description:
      'App to easily and fairly calculate how to divide expenses between a group of people',
    url: 'https://dividizky.vercel.app/',
    siteName: 'Dividizky',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'public/izky.png',
        width: 800,
        height: 600,
        alt: 'Imagen de izky',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
