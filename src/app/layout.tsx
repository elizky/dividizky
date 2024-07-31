import type { Metadata } from 'next';
import { Jura } from 'next/font/google';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/lib/theme-provider';

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
      <script
        async
        defer
        src='https://cloud.umami.is/script.js'
        data-website-id='b555fbdb-ec1e-4630-805d-7ea68d4266e9'
      ></script>
      <body className={jura.className}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
