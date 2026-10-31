/**
 * Downloads the site photography from Unsplash and stores it as WebP in /public/images.
 * Photos are used under the Unsplash License (https://unsplash.com/license).
 *
 *   npm run images:photos
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { ARTICLES } from '../src/content/journal';
import { HERO_PHOTO, type Photo } from '../src/content/photos';

const MAX_WIDTH = 2000;
const photos: Photo[] = [HERO_PHOTO, ...ARTICLES.map((a) => a.cover)];
let failures = 0;

for (const photo of photos) {
  const url = `${photo.remote}?fm=webp&q=82&w=${MAX_WIDTH}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const input = Buffer.from(await res.arrayBuffer());
    // Re-encode locally so every file is WebP with a known width, whatever the CDN returned.
    const output = await sharp(input)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    const meta = await sharp(output).metadata();
    const file = join(process.cwd(), 'public', photo.src);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, output);
    console.log(
      `✓ ${photo.src}  ${meta.width}×${meta.height}  ${Math.round(output.length / 1024)} KB  (${photo.credit.name})`,
    );
  } catch (error) {
    failures++;
    console.log(`✗ ${photo.src}: ${(error as Error).message}`);
  }
}

console.log(
  failures ? `\n${failures} photo(s) failed.` : '\nAll photos saved. Commit the files in public/images.',
);
process.exit(failures ? 1 : 0);
