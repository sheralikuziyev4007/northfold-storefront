/**
 * Sample catalog for the fictional Northfold brand. Used when SHOPIFY_DATA_SOURCE=fixtures
 * (tests, CI, offline development). Shapes mirror the Storefront API so the rest of the
 * app cannot tell the difference.
 */
import type { RawCollection, RawProduct, RawVariant } from '../raw-types';
import type { Money } from '../types';
import { slugify } from '@/lib/utils';

export type Silhouette =
  'tee' | 'hoodie' | 'sweatshirt' | 'jacket' | 'pants' | 'beanie' | 'cap' | 'socks' | 'tote';

export type ColorSpec = { name: string; swatch: string; tone: string };

export const COLORS = {
  Loden: { name: 'Loden', swatch: '#3D5A4B', tone: '#B9C2B5' },
  Charcoal: { name: 'Charcoal', swatch: '#2F3533', tone: '#5A615E' },
  Oat: { name: 'Oat', swatch: '#D7D3C8', tone: '#D7D3C8' },
  'Slate blue': { name: 'Slate blue', swatch: '#6E7F92', tone: '#C9CFD6' },
  White: { name: 'White', swatch: '#FFFFFF', tone: '#E6E6E1' },
  Khaki: { name: 'Khaki', swatch: '#8A7F6A', tone: '#A89F8E' },
} satisfies Record<string, ColorSpec>;

type ColorName = keyof typeof COLORS;

type ProductSpec = {
  handle: string;
  title: string;
  productType: string;
  collection: 'outerwear' | 'essentials' | 'accessories';
  priceUsd: number;
  compareAtUsd?: number;
  colors: ColorName[];
  sizes: string[] | null;
  /** "Color/Size" pairs that are sold out. Use "*" as a wildcard. */
  soldOut?: string[];
  createdAt: string;
  silhouette: Silhouette;
  description: string;
  label: {
    composition: string;
    fabricWeight: string;
    origin: string;
    fibreSource: string;
    care: string;
    fit: string;
  };
  tags: string[];
};

const APPAREL = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const PRODUCT_SPECS: ProductSpec[] = [
  {
    handle: 'heavyweight-hoodie',
    title: 'Heavyweight hoodie',
    productType: 'Hoodies',
    collection: 'essentials',
    priceUsd: 98,
    colors: ['Loden', 'Charcoal', 'Oat'],
    sizes: APPAREL.slice(1),
    soldOut: ['*/XL'],
    createdAt: '2026-10-20T09:00:00Z',
    silhouette: 'hoodie',
    description:
      'A 480 gsm brushed-back fleece hoodie with a double-layer hood, ribbed cuffs and a kangaroo pocket. Cut relaxed with dropped shoulders.',
    label: {
      composition: '100% organic cotton',
      fabricWeight: '480 gsm',
      origin: 'Porto, Portugal',
      fibreSource: 'Organic cotton, Aegean region',
      care: 'Wash cold inside out. Do not bleach. Hang to dry.',
      fit: 'Relaxed fit with dropped shoulders. The model is 185 cm and wears size L.',
    },
    tags: ['fleece', 'hoodie', 'new'],
  },
  {
    handle: 'loopback-sweatpants',
    title: 'Loopback sweatpants',
    productType: 'Sweatpants',
    collection: 'essentials',
    priceUsd: 84,
    colors: ['Charcoal', 'Oat'],
    sizes: APPAREL.slice(0, 5),
    createdAt: '2026-10-18T09:00:00Z',
    silhouette: 'pants',
    description:
      'Midweight loopback cotton with a tapered leg, drawcord waist and two deep side pockets. Unbrushed inside, so it breathes.',
    label: {
      composition: '100% organic cotton',
      fabricWeight: '400 gsm',
      origin: 'Porto, Portugal',
      fibreSource: 'Organic cotton, Aegean region',
      care: 'Wash cold. Do not tumble dry.',
      fit: 'Regular through the hip, tapered from the knee. Take your usual size.',
    },
    tags: ['sweatpants', 'new'],
  },
  {
    handle: 'boxy-pocket-tee',
    title: 'Boxy pocket tee',
    productType: 'T-shirts',
    collection: 'essentials',
    priceUsd: 42,
    colors: ['White', 'Charcoal', 'Slate blue', 'Oat'],
    sizes: APPAREL.slice(1),
    soldOut: ['White/S'],
    createdAt: '2026-10-12T09:00:00Z',
    silhouette: 'tee',
    description:
      'A structured 220 gsm jersey tee with a chest pocket, a boxy body and a slightly cropped length.',
    label: {
      composition: '100% organic cotton',
      fabricWeight: '220 gsm',
      origin: 'Braga, Portugal',
      fibreSource: 'Organic cotton, Aegean region',
      care: 'Wash cold. Hang to dry.',
      fit: 'Boxy and slightly cropped. Size down for a closer fit.',
    },
    tags: ['tee'],
  },
  {
    handle: 'canvas-chore-jacket',
    title: 'Canvas chore jacket',
    productType: 'Jackets',
    collection: 'outerwear',
    priceUsd: 168,
    colors: ['Khaki', 'Charcoal'],
    sizes: APPAREL.slice(1, 5),
    soldOut: ['Charcoal/M'],
    createdAt: '2026-10-08T09:00:00Z',
    silhouette: 'jacket',
    description:
      'A 12 oz cotton canvas work jacket with three patch pockets, corozo buttons and a corduroy-lined collar. Softens with every wear.',
    label: {
      composition: '100% cotton canvas',
      fabricWeight: '12 oz (405 gsm)',
      origin: 'Guimarães, Portugal',
      fibreSource: 'Cotton, Aegean region',
      care: 'Wash cold, inside out. Line dry.',
      fit: 'Straight fit with room for a hoodie underneath.',
    },
    tags: ['jacket', 'canvas'],
  },
  {
    handle: 'brushed-crewneck',
    title: 'Brushed crewneck',
    productType: 'Sweatshirts',
    collection: 'essentials',
    priceUsd: 88,
    colors: ['Charcoal', 'Loden', 'Oat'],
    sizes: APPAREL.slice(0, 5),
    createdAt: '2026-09-30T09:00:00Z',
    silhouette: 'sweatshirt',
    description:
      'The hoodie fleece in a crewneck, with a set-in collar rib that keeps its shape wash after wash.',
    label: {
      composition: '100% organic cotton',
      fabricWeight: '480 gsm',
      origin: 'Porto, Portugal',
      fibreSource: 'Organic cotton, Aegean region',
      care: 'Wash cold inside out. Hang to dry.',
      fit: 'Relaxed fit. Take your usual size.',
    },
    tags: ['fleece', 'sweatshirt'],
  },
  {
    handle: 'wool-overshirt',
    title: 'Wool overshirt',
    productType: 'Overshirts',
    collection: 'outerwear',
    priceUsd: 148,
    colors: ['Loden', 'Slate blue'],
    sizes: APPAREL.slice(1, 5),
    createdAt: '2026-09-24T09:00:00Z',
    silhouette: 'jacket',
    description:
      'A recycled wool overshirt with snap closures and two flap pockets. Warm enough for most autumn days.',
    label: {
      composition: '70% recycled wool, 30% polyamide',
      fabricWeight: '520 gsm',
      origin: 'Biella, Italy',
      fibreSource: 'Recycled wool, Prato',
      care: 'Dry clean or hand wash cold.',
      fit: 'Regular fit. Size up to layer over knitwear.',
    },
    tags: ['wool', 'overshirt'],
  },
  {
    handle: 'quilted-liner-jacket',
    title: 'Quilted liner jacket',
    productType: 'Jackets',
    collection: 'outerwear',
    priceUsd: 158,
    compareAtUsd: 188,
    colors: ['Charcoal', 'Oat'],
    sizes: APPAREL.slice(1, 5),
    createdAt: '2026-09-15T09:00:00Z',
    silhouette: 'jacket',
    description:
      'A diamond-quilted liner filled with recycled insulation. Wear it alone or under the chore jacket.',
    label: {
      composition: 'Shell 100% recycled nylon',
      fabricWeight: '120 g fill',
      origin: 'Guimarães, Portugal',
      fibreSource: 'Recycled nylon',
      care: 'Machine wash cold. Tumble dry low.',
      fit: 'Trim fit, designed to layer.',
    },
    tags: ['jacket', 'sale'],
  },
  {
    handle: 'long-sleeve-tee',
    title: 'Long sleeve tee',
    productType: 'T-shirts',
    collection: 'essentials',
    priceUsd: 54,
    colors: ['White', 'Charcoal'],
    sizes: APPAREL.slice(1, 5),
    createdAt: '2026-09-10T09:00:00Z',
    silhouette: 'sweatshirt',
    description: 'The pocket tee fabric with long sleeves and rib cuffs.',
    label: {
      composition: '100% organic cotton',
      fabricWeight: '220 gsm',
      origin: 'Braga, Portugal',
      fibreSource: 'Organic cotton, Aegean region',
      care: 'Wash cold. Hang to dry.',
      fit: 'Regular fit.',
    },
    tags: ['tee'],
  },
  {
    handle: 'ribbed-beanie',
    title: 'Ribbed beanie',
    productType: 'Hats',
    collection: 'accessories',
    priceUsd: 32,
    colors: ['Loden', 'Charcoal', 'Oat'],
    sizes: null,
    createdAt: '2026-10-02T09:00:00Z',
    silhouette: 'beanie',
    description: 'A deep-cuff beanie knitted from recycled wool.',
    label: {
      composition: '80% recycled wool, 20% nylon',
      fabricWeight: 'Fine rib knit',
      origin: 'Biella, Italy',
      fibreSource: 'Recycled wool, Prato',
      care: 'Hand wash cold. Dry flat.',
      fit: 'One size.',
    },
    tags: ['hat', 'wool'],
  },
  {
    handle: 'twill-cap',
    title: 'Twill cap',
    productType: 'Hats',
    collection: 'accessories',
    priceUsd: 36,
    colors: ['Oat', 'Charcoal'],
    sizes: null,
    createdAt: '2026-08-28T09:00:00Z',
    silhouette: 'cap',
    description: 'A six-panel cotton twill cap with a brass buckle strap.',
    label: {
      composition: '100% cotton twill',
      fabricWeight: '280 gsm',
      origin: 'Braga, Portugal',
      fibreSource: 'Cotton, Aegean region',
      care: 'Spot clean.',
      fit: 'Adjustable.',
    },
    tags: ['hat'],
  },
  {
    handle: 'merino-socks',
    title: 'Merino socks',
    productType: 'Socks',
    collection: 'accessories',
    priceUsd: 24,
    colors: ['Charcoal', 'Oat'],
    sizes: ['S/M', 'L/XL'],
    createdAt: '2026-08-20T09:00:00Z',
    silhouette: 'socks',
    description: 'Cushioned merino crew socks with a reinforced heel and toe.',
    label: {
      composition: '70% merino wool, 28% nylon, 2% elastane',
      fabricWeight: 'Mid cushion',
      origin: 'Porto, Portugal',
      fibreSource: 'Merino wool',
      care: 'Wash warm. Do not tumble dry.',
      fit: 'S/M fits EU 36–41. L/XL fits EU 42–46.',
    },
    tags: ['socks', 'wool'],
  },
  {
    handle: 'canvas-tote',
    title: 'Canvas tote',
    productType: 'Bags',
    collection: 'accessories',
    priceUsd: 46,
    colors: ['Oat'],
    sizes: null,
    createdAt: '2026-08-12T09:00:00Z',
    silhouette: 'tote',
    description: 'A heavy canvas tote with an inside pocket and long handles that sit on the shoulder.',
    label: {
      composition: '100% cotton canvas',
      fabricWeight: '16 oz (540 gsm)',
      origin: 'Guimarães, Portugal',
      fibreSource: 'Cotton, Aegean region',
      care: 'Spot clean.',
      fit: '40 × 38 cm, 60 cm handles.',
    },
    tags: ['bag'],
  },
];

export const COLLECTION_SPECS: { handle: RawCollection['handle']; title: string; description: string }[] = [
  { handle: 'outerwear', title: 'Outerwear', description: 'Chore jackets, overshirts and liners.' },
  { handle: 'essentials', title: 'Essentials', description: 'Tees, hoodies and sweatpants.' },
  { handle: 'accessories', title: 'Accessories', description: 'Caps, beanies, socks and bags.' },
];

/* Demo price lists per market. A real store would set these in Shopify Markets. */
const PRICE_LISTS: Record<string, (usd: number) => number> = {
  USD: (usd) => usd,
  GBP: (usd) => Math.round(usd * 0.8),
  EUR: (usd) => Math.round(usd * 0.92),
  CAD: (usd) => Math.round(usd * 1.36),
  JPY: (usd) => Math.round((usd * 150) / 100) * 100,
};

export function priceIn(usd: number, currency: string): Money {
  const convert = PRICE_LISTS[currency] ?? PRICE_LISTS.USD!;
  const amount = convert(usd);
  return { amount: currency === 'JPY' ? amount.toFixed(0) : amount.toFixed(2), currencyCode: currency };
}

export function fixtureImageUrl(handle: string, color: string, view: number) {
  return `/fixtures/img/${handle}/${slugify(color)}/${view}`;
}

function isSoldOut(spec: ProductSpec, color: string, size: string | null) {
  return (spec.soldOut ?? []).some((rule) => {
    const [c, s] = rule.split('/');
    return (c === '*' || c === color) && (s === '*' || s === size);
  });
}

const IMAGE_SIZE = { width: 1200, height: 1500 };

export function buildRawProduct(spec: ProductSpec, currency: string): RawProduct {
  const gid = `gid://shopify/Product/${spec.handle}`;
  const images = spec.colors.flatMap((color) =>
    [1, 2, 3].map((view) => ({
      url: fixtureImageUrl(spec.handle, color, view),
      altText: `${spec.title} in ${color}, ${['front', 'detail', 'flat lay'][view - 1]}`,
      ...IMAGE_SIZE,
    })),
  );

  const hasColorOption = spec.colors.length > 1 || spec.sizes !== null;
  const variants: RawVariant[] = [];
  for (const color of spec.colors) {
    for (const size of spec.sizes ?? [null]) {
      const selectedOptions = hasColorOption
        ? [{ name: 'Color', value: color }, ...(size ? [{ name: 'Size', value: size }] : [])]
        : [{ name: 'Title', value: 'Default Title' }];
      variants.push({
        id: `gid://shopify/ProductVariant/${spec.handle}--${slugify(color)}${size ? `--${slugify(size)}` : ''}`,
        title: hasColorOption ? [color, size].filter(Boolean).join(' / ') : 'Default Title',
        availableForSale: !isSoldOut(spec, color, size),
        selectedOptions,
        price: priceIn(spec.priceUsd, currency),
        compareAtPrice: spec.compareAtUsd ? priceIn(spec.compareAtUsd, currency) : null,
        image: images.find((img) => img.url === fixtureImageUrl(spec.handle, color, 1)) ?? null,
      });
    }
  }

  const options = hasColorOption
    ? [
        { id: `${gid}/color`, name: 'Color', optionValues: spec.colors.map((name) => ({ name })) },
        ...(spec.sizes
          ? [{ id: `${gid}/size`, name: 'Size', optionValues: spec.sizes.map((name) => ({ name })) }]
          : []),
      ]
    : [{ id: `${gid}/title`, name: 'Title', optionValues: [{ name: 'Default Title' }] }];

  const price = priceIn(spec.priceUsd, currency);
  return {
    id: gid,
    handle: spec.handle,
    title: spec.title,
    description: spec.description,
    productType: spec.productType,
    vendor: 'Northfold',
    tags: spec.tags,
    createdAt: spec.createdAt,
    availableForSale: variants.some((v) => v.availableForSale),
    featuredImage: images[0] ?? null,
    images: { nodes: images },
    options,
    variants: { nodes: variants },
    priceRange: { minVariantPrice: price, maxVariantPrice: price },
    metafields: [
      { key: 'composition', value: spec.label.composition },
      { key: 'fabric_weight', value: spec.label.fabricWeight },
      { key: 'origin', value: spec.label.origin },
      { key: 'fibre_source', value: spec.label.fibreSource },
      { key: 'care', value: spec.label.care },
      { key: 'fit', value: spec.label.fit },
    ],
    seo: { title: null, description: null },
  };
}

export function buildRawCollection(handle: string): RawCollection | null {
  const spec = COLLECTION_SPECS.find((c) => c.handle === handle);
  if (!spec) return null;
  return {
    id: `gid://shopify/Collection/${spec.handle}`,
    handle: spec.handle,
    title: spec.title,
    description: spec.description,
    image: { url: `/fixtures/img/collection/${spec.handle}/1`, altText: spec.title, ...IMAGE_SIZE },
  };
}
