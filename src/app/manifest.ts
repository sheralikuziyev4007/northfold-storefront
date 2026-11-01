import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Northfold',
    short_name: 'Northfold',
    description: 'Small-run clothing in heavyweight natural fabrics.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ECECE7',
    theme_color: '#ECECE7',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
