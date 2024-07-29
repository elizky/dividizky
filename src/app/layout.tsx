import type { Metadata } from 'next';
import { Jura } from 'next/font/google';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const jura = Jura({ subsets: ['latin'] });

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
    locale: 'es',
    type: 'website',
    images: [
      {
        url: 'opengraph-image.png',
        width: 800,
        height: 600,
        alt: 'opengraph-image.alt.txt',
      },
    ],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <script
        async
        defer
        src='https://cloud.umami.is/script.js'
        data-website-id='b555fbdb-ec1e-4630-805d-7ea68d4266e9'
      ></script>
      <body className={jura.className}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
