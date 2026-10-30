/* Draws the sample catalog's product shots as SVG, so the repository ships no stock photos. */
import { COLORS, type Silhouette } from './catalog';

const SHAPES: Record<Silhouette, string[]> = {
  tee: [
    'M30 15 L42 10 Q50 18 58 10 L70 15 L88 30 L78 42 L70 37 L70 90 L30 90 L30 37 L22 42 L12 30 Z',
    'M58 30 h8 v8 h-8 z',
  ],
  hoodie: [
    'M30 15 L40 9 Q50 3 60 9 L70 15 L88 32 L80 44 L70 38 L70 90 L30 90 L30 38 L20 44 L12 32 Z',
    'M40 9 Q50 26 60 9',
    'M38 66 H62 L58 78 H42 Z',
  ],
  sweatshirt: [
    'M30 15 L42 10 Q50 17 58 10 L70 15 L92 62 L84 66 L70 40 L70 90 L30 90 L30 40 L16 66 L8 62 Z',
    'M30 86 H70',
  ],
  jacket: [
    'M30 14 L42 10 L50 20 L58 10 L70 14 L90 62 L82 66 L70 42 L70 92 L30 92 L30 42 L18 66 L10 62 Z',
    'M50 20 V92',
    'M34 56 h11 v12 h-11 z M55 56 h11 v12 h-11 z',
  ],
  pants: ['M32 10 H68 L74 92 H56 L50 40 L44 92 H26 Z', 'M32 16 H68'],
  beanie: ['M28 70 Q28 26 50 26 Q72 26 72 70 Z', 'M26 60 H74 V76 H26 Z'],
  cap: ['M24 60 Q26 34 50 34 Q74 34 76 60 Z', 'M60 60 Q84 60 92 66 Q76 70 56 64', 'M50 34 V60'],
  socks: ['M40 12 H58 V58 L74 72 Q80 80 72 86 L58 88 Q40 88 40 70 Z', 'M40 20 H58'],
  tote: ['M24 34 H76 L72 90 H28 Z', 'M38 34 Q38 14 50 14 Q62 14 62 34'],
};

function luminance(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

const VIEWS = [
  { scale: 0.62, x: 0.5, y: 0.52 },
  { scale: 1.35, x: 0.38, y: 0.4 },
  { scale: 0.48, x: 0.5, y: 0.5 },
];

export function productSvg(silhouette: Silhouette, colorSlug: string, view: number): string {
  const color =
    Object.values(COLORS).find((c) => c.name.toLowerCase().replace(/\s+/g, '-') === colorSlug) ?? COLORS.Oat;
  const dark = luminance(color.tone) < 0.45;
  const stroke = dark ? 'rgba(255,255,255,0.42)' : 'rgba(30,36,34,0.32)';
  const fill = dark ? 'rgba(255,255,255,0.06)' : 'rgba(30,36,34,0.05)';
  const v = VIEWS[(view - 1) % VIEWS.length]!;
  const size = 1200 * v.scale;
  const tx = 1200 * v.x - size / 2;
  const ty = 1500 * v.y - size / 2;
  const paths = SHAPES[silhouette]
    .map(
      (d, i) => `<path d="${d}" fill="${i === 0 ? fill : 'none'}" stroke="${stroke}" stroke-width="0.7" />`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500"><rect width="1200" height="1500" fill="${color.tone}"/><g transform="translate(${tx} ${ty}) scale(${size / 100})" stroke-linejoin="round">${paths}</g></svg>`;
}

const COLLECTION_ART: Record<string, { tone: string; shapes: Silhouette[] }> = {
  outerwear: { tone: '#2F3533', shapes: ['jacket'] },
  essentials: { tone: '#D7D3C8', shapes: ['hoodie'] },
  accessories: { tone: '#C9CFD6', shapes: ['beanie'] },
  hero: { tone: '#B9C2B5', shapes: ['hoodie'] },
};

export function collectionSvg(handle: string): string {
  const art = COLLECTION_ART[handle] ?? COLLECTION_ART.essentials!;
  const dark = luminance(art.tone) < 0.45;
  const stroke = dark ? 'rgba(255,255,255,0.35)' : 'rgba(30,36,34,0.3)';
  const paths = art.shapes
    .flatMap((s) => SHAPES[s])
    .map((d) => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="0.6" />`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500"><rect width="1200" height="1500" fill="${art.tone}"/><g transform="translate(180 330) scale(8.4)" stroke-linejoin="round">${paths}</g></svg>`;
}
