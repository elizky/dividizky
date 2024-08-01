import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  const t = useTranslations('Welcome');

  return (
    <footer className='p-2 flex items-center justify-center'>
      <p className='font-mono text-xs'>
        {t('createdBy')} {' '}
        <Link href='https://www.izky.dev/' target='_blank' className='hover:underline'>
          {t('izky')}
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
