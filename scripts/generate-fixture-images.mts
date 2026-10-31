/**
 * Renders the sample catalog's product and collection drawings to WebP in /public/images.
 * Also writes flat placeholders for site photos that have not been downloaded yet, so the
 * site never shows a broken image. Existing photos are never overwritten.
 *
 *   npm run images:fixtures
 */
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { ARTICLES } from '../src/content/journal';
import { HERO_PHOTO } from '../src/content/photos';
import {
  COLLECTION_SPECS,
  IMAGE_SIZE,
  PRODUCT_SPECS,
  collectionImageUrl,
  fixtureImageUrl,
} from '../src/lib/shopify/fixtures/catalog';
import { collectionSvg, productSvg } from '../src/lib/shopify/fixtures/svg';
import { slugify } from '../src/lib/utils';

const PUBLIC = join(process.cwd(), 'public');

async function save(urlPath: string, data: Buffer) {
  const file = join(PUBLIC, urlPath);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, data);
}

function toWebp(svg: string) {
  return sharp(Buffer.from(svg)).resize(IMAGE_SIZE.width, IMAGE_SIZE.height).webp({ quality: 82 }).toBuffer();
}

let count = 0;
for (const spec of PRODUCT_SPECS) {
  for (const color of spec.colors) {
    for (const view of [1, 2, 3]) {
      await save(
        fixtureImageUrl(spec.handle, color, view),
        await toWebp(productSvg(spec.silhouette, slugify(color), view)),
      );
      count++;
    }
  }
}
for (const c of COLLECTION_SPECS) {
  await save(collectionImageUrl(c.handle), await toWebp(collectionSvg(c.handle)));
  count++;
}

let placeholders = 0;
const photos = [
  // The hero falls back to the brand's hoodie drawing until the photo is downloaded.
  { src: HERO_PHOTO.src, svg: collectionSvg('hero'), tone: '#B9C2B5' },
  ...ARTICLES.map((a) => ({ src: a.cover.src, svg: null, tone: a.tone })),
];
for (const photo of photos) {
  if (existsSync(join(PUBLIC, photo.src))) continue;
  const placeholder = photo.svg
    ? await toWebp(photo.svg)
    : await sharp({ create: { width: 1600, height: 1000, channels: 3, background: photo.tone } })
        .webp({ quality: 80 })
        .toBuffer();
  await save(photo.src, placeholder);
  placeholders++;
}

console.log(`Wrote ${count} sample images and ${placeholders} photo placeholders to public/images.`);
if (placeholders)
  console.log('Run `npm run images:photos` to replace the placeholders with the real photos.');
