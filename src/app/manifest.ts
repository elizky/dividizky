import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dividizky',
    short_name: 'Dividizky',
    description: 'Easily and fairly calculate how to divide expenses between a group of people with Dividizky',
    start_url: '/',
    display: 'standalone',
    background_color: '#0d0b0a',
    theme_color: '#0d0b0a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
