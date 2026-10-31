/**
 * Site photography. Files live in /public/images as WebP and are downloaded from Unsplash
 * with `npm run images:photos` (photos are used under the Unsplash License).
 */
export type Photo = {
  /** Path of the local WebP file under /public. */
  src: string;
  /** Unsplash CDN source the local file is downloaded from. */
  remote: string;
  alt: string;
  credit: { name: string; url: string };
};

export const HERO_PHOTO: Photo = {
  src: '/images/hero.webp',
  remote: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77',
  alt: 'A white hoodie and light blue jeans hanging on a rope',
  credit: {
    name: 'Mediamodifier',
    url: 'https://unsplash.com/photos/white-hoodie-and-distressed-jeans-kJXGTOY1wLQ',
  },
};
