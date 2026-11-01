/**
 * Renders the browser and home-screen icons from src/app/icon.svg.
 * Run with `npm run images:icons` after changing the SVG.
 */
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = await readFile('src/app/icon.svg');
const BG = '#3D5A4B';

// Tab-sized icons drop the dashed stitch, which turns to noise at 16-32 px, and use a larger N.
const simple = Buffer.from(
  svg
    .toString()
    .replace(/<rect x="8"[^>]*\/>/, '')
    .replace(/(<path[^>]*\/>)/, '<g transform="translate(32 32) scale(1.4) translate(-32 -32)">$1</g>'),
);

const png = (size: number, source = svg) =>
  sharp(source, { density: 72 * (size / 64) * 2 })
    .resize(size, size)
    .png()
    .toBuffer();

/** Full-bleed square for iOS (it rounds the corners itself) and maskable Android icons. */
async function squarePng(size: number, inset: number) {
  const inner = Math.round(size * inset);
  const art = await sharp(svg, { density: 72 * (inner / 64) * 2 })
    .resize(inner, inner)
    .png()
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: art, gravity: 'center' }])
    .png()
    .toBuffer();
}

/** ICO container holding PNG images (supported by every current browser). */
function ico(images: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const sizes = [16, 32, 48];
await writeFile(
  'src/app/favicon.ico',
  ico(
    await Promise.all(
      sizes.map(async (size) => ({ size, data: await png(size, size <= 32 ? simple : svg) })),
    ),
  ),
);
await writeFile('src/app/apple-icon.png', await squarePng(180, 1));
await writeFile('public/icons/icon-192.png', await png(192));
await writeFile('public/icons/icon-512.png', await png(512));
await writeFile('public/icons/maskable-512.png', await squarePng(512, 0.8));
console.log('icons written');
