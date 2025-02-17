import type { Metadata } from 'next';
import { Jura } from 'next/font/google';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/lib/theme-provider';
import Footer from '@/components/Footer';
import Script from 'next/script';

const jura = Jura({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://dividizky.app'),
  title: {
    default: 'Dividizky',
    template: '%s | Dividizky',
  },
  description:
    'App to easily and fairly calculate how to divide expenses between a group of people',
  applicationName: 'Dividizky',
  authors: [{ name: 'Izky', url: 'https://izky.dev/' }],
  keywords: [
    'Expense Splitter',
    'Fair Expense Calculator',
    'Group Expense Management',
    'Shared Expenses Calculator',
    'Cost Splitting Tool',
    'Expense Sharing App',
    'Expense Division App',
  ],
  openGraph: {
    title: 'Dividizky',
    description:
      'App to easily and fairly calculate how to divide expenses between a group of people',
    url: 'https://dividizky.app',
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
  console.log('locale', locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <Script
        async
        defer
        src='https://cloud.umami.is/script.js'
        data-website-id='b555fbdb-ec1e-4630-805d-7ea68d4266e9'
      />
      <Script
        async
        src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7762587940973595'
        crossOrigin='anonymous'
      />
      <body className={jura.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            {children}
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
