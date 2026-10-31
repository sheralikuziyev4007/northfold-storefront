/** Journal articles. Kept as typed data so pages can be statically generated without a CMS. */
export type JournalTopic = 'Making' | 'Care guides' | 'Field notes';

export type Block = { type: 'p'; text: string } | { type: 'h2'; text: string };

import type { Photo } from './photos';

export type Article = {
  slug: string;
  /** Cover photo, credited on the article page. */
  cover: Photo;
  title: string;
  topic: JournalTopic;
  date: string;
  readingMinutes: number;
  excerpt: string;
  tone: string;
  body: Block[];
  productHandles: string[];
};

export const TOPICS: JournalTopic[] = ['Making', 'Care guides', 'Field notes'];

export const ARTICLES: Article[] = [
  {
    slug: 'what-fabric-weight-tells-you',
    cover: {
      src: '/images/journal/what-fabric-weight-tells-you.webp',
      remote: 'https://images.unsplash.com/photo-1640747669771-b82a6e40f534',
      alt: 'Stack of folded fabric in muted colours with a cotton boll on top',
      credit: {
        name: 'Moonstarious Project',
        url: 'https://unsplash.com/photos/a-stack-of-folded-cloths-with-a-cotton-ball-on-top-wl2TODALiAY',
      },
    },
    title: 'What fabric weight actually tells you',
    topic: 'Care guides',
    date: '2026-10-12',
    readingMinutes: 6,
    excerpt:
      'Grams per square metre is printed on every Northfold label. Here is what the number means for warmth, drape and how long a piece will last.',
    tone: '#A89F8E',
    body: [
      {
        type: 'p',
        text: 'Every Northfold label lists a number followed by gsm. It stands for grams per square metre: cut a one-metre square of the fabric, weigh it, and that is the figure. It is the quickest way to compare two garments without touching them.',
      },
      { type: 'h2', text: 'Light, mid and heavy' },
      {
        type: 'p',
        text: 'For T-shirts, anything under roughly 150 gsm reads as light and a little sheer. Around 180 to 200 gsm is a solid everyday tee. Above that, the fabric starts to hold its own shape instead of following yours.',
      },
      {
        type: 'p',
        text: 'Sweatshirt fleece sits higher. Our heavyweight hoodie is 480 gsm, which is why it stands up on a hanger and keeps its hood upright.',
      },
      { type: 'h2', text: 'Heavier is not always warmer' },
      {
        type: 'p',
        text: 'Weight tells you how much fibre there is, not how it is knitted. A brushed fleece traps air and feels warmer than a flat knit of the same weight. Read gsm next to the fabric type on the label, never on its own.',
      },
      { type: 'h2', text: 'How it changes care' },
      {
        type: 'p',
        text: 'Heavier cotton holds more water, so it takes longer to dry and is more likely to shrink in a hot dryer. Wash it cold, reshape it while damp, and hang it to dry.',
      },
    ],
    productHandles: ['heavyweight-hoodie', 'boxy-pocket-tee', 'loopback-sweatpants'],
  },
  {
    slug: 'why-we-sew-in-small-runs',
    cover: {
      src: '/images/journal/why-we-sew-in-small-runs.webp',
      remote: 'https://images.unsplash.com/photo-1497997092403-f091fcf5b6c4',
      alt: 'Sewing machine presser foot stitching thread into dark fabric',
      credit: {
        name: 'Alexander Andrews',
        url: 'https://unsplash.com/photos/photo-of-gray-sewing-machine-foot-lock-with-thread-on-black-cloth-jNKv4QohAk0',
      },
    },
    title: 'Why we sew in small runs',
    topic: 'Making',
    date: '2026-10-01',
    readingMinutes: 4,
    excerpt:
      'Small production runs mean fewer leftovers, closer checks on every seam and colours we can change quickly.',
    tone: '#C9CFD6',
    body: [
      {
        type: 'p',
        text: 'Each Northfold style is cut in batches of a few hundred pieces. When a run sells through, we look at what came back for repair before we cut the next one.',
      },
      { type: 'h2', text: 'Fewer leftovers' },
      {
        type: 'p',
        text: 'Large runs push brands into end-of-season sales to clear stock. Small runs let us make roughly what we sell, so prices stay the same all year.',
      },
      { type: 'h2', text: 'Faster fixes' },
      {
        type: 'p',
        text: 'If a cuff stretches out or a pocket sits too low, the next batch is only weeks away. Changes reach the product quickly instead of waiting for next year.',
      },
    ],
    productHandles: ['canvas-chore-jacket', 'brushed-crewneck'],
  },
  {
    slug: 'fixing-a-torn-seam-at-home',
    cover: {
      src: '/images/journal/fixing-a-torn-seam-at-home.webp',
      remote: 'https://images.unsplash.com/photo-1772291320136-7bfb40006088',
      alt: 'Hands sewing a patch onto light fabric with a needle and thread',
      credit: {
        name: 'Erwin Bosman',
        url: 'https://unsplash.com/photos/hands-carefully-sewing-a-patch-onto-fabric-nnlbnAAA6M8',
      },
    },
    title: 'Fixing a torn seam at home',
    topic: 'Care guides',
    date: '2026-09-18',
    readingMinutes: 5,
    excerpt:
      'A split seam is the easiest repair there is. You need a needle, matching thread and ten minutes.',
    tone: '#D7D3C8',
    body: [
      {
        type: 'p',
        text: 'Most seams split because a single stitch broke and the rest unravelled behind it. The fabric itself is usually fine, which makes this a quick job.',
      },
      { type: 'h2', text: 'What you need' },
      {
        type: 'p',
        text: 'A sharp needle, polyester or cotton thread close to the garment colour, and a few pins. Turn the garment inside out so the repair stays hidden.',
      },
      { type: 'h2', text: 'The stitch' },
      {
        type: 'p',
        text: 'Start a centimetre before the gap, inside the old stitching, and sew small backstitches along the original line until you are a centimetre past it. Knot twice and trim.',
      },
      {
        type: 'p',
        text: 'If the tear runs into the fabric, or the zip has failed, send it to us instead. Repairs are free on Northfold outerwear.',
      },
    ],
    productHandles: ['canvas-chore-jacket'],
  },
  {
    slug: 'washing-heavyweight-cotton',
    cover: {
      src: '/images/journal/washing-heavyweight-cotton.webp',
      remote: 'https://images.unsplash.com/photo-1716749188938-e66263f36728',
      alt: 'Laundry drying on a line in front of a building',
      credit: {
        name: 'Gabriella Clare Marino',
        url: 'https://unsplash.com/photos/clothes-hanging-out-to-dry-on-a-clothes-line-in-front-of-a-building-P6ICe9mEYbQ',
      },
    },
    title: 'Washing a heavyweight hoodie without shrinking it',
    topic: 'Care guides',
    date: '2026-09-05',
    readingMinutes: 3,
    excerpt:
      'Cold water, inside out, and never the tumble dryer. Three habits that keep heavy fleece the size you bought.',
    tone: '#B9C2B5',
    body: [
      {
        type: 'p',
        text: 'Cotton fleece shrinks when heat and movement act on wet fibres at the same time. Remove one of the two and it barely moves.',
      },
      { type: 'h2', text: 'Three habits' },
      {
        type: 'p',
        text: 'Wash at 30°C or below, turn it inside out to protect the brushed face, and dry it flat or on a wide hanger. Skip fabric softener, which flattens the loops inside the fleece.',
      },
    ],
    productHandles: ['heavyweight-hoodie', 'brushed-crewneck'],
  },
  {
    slug: 'from-cotton-bale-to-fleece',
    cover: {
      src: '/images/journal/from-cotton-bale-to-fleece.webp',
      remote: 'https://images.unsplash.com/photo-1616431101491-554c0932ea40',
      alt: 'Stem of white cotton bolls against a plain background',
      credit: {
        name: 'Ranurte',
        url: 'https://unsplash.com/photos/cotton-stem-with-white-bolls-kSdi_gqbGGs',
      },
    },
    title: 'From cotton bale to finished fleece',
    topic: 'Making',
    date: '2026-08-22',
    readingMinutes: 8,
    excerpt:
      'Spinning, knitting, dyeing and brushing: the four steps behind our fleece, and why each one matters.',
    tone: '#2F3533',
    body: [
      {
        type: 'p',
        text: 'Fleece starts as raw cotton that is cleaned, combed and spun into yarn. The yarn is knitted on circular machines into a tube of loopback fabric.',
      },
      { type: 'h2', text: 'Dyeing and brushing' },
      {
        type: 'p',
        text: 'The fabric is dyed as a whole piece, then the loops on the inside are brushed to raise a soft surface that traps warm air. Brushing is what turns loopback into fleece.',
      },
      {
        type: 'p',
        text: 'Finally the fabric is washed and dried before cutting, so most of the shrinkage happens at the mill and not in your machine.',
      },
    ],
    productHandles: ['heavyweight-hoodie', 'loopback-sweatpants'],
  },
  {
    slug: 'packing-light-for-the-hills',
    cover: {
      src: '/images/journal/packing-light-for-the-hills.webp',
      remote: 'https://images.unsplash.com/photo-1476979735039-2fdea9e9e407',
      alt: 'Two hiking backpacks resting on rocks beside a forest trail',
      credit: {
        name: 'Andrew Ly',
        url: 'https://unsplash.com/photos/two-gray-and-orange-backpacks-on-gray-rocks-at-daytime-bQl2kRQyUE8',
      },
    },
    title: 'Packing light for a week in the hills',
    topic: 'Field notes',
    date: '2026-08-08',
    readingMinutes: 6,
    excerpt: 'Seven days, one small bag. What we took, what we wore every day and what stayed packed.',
    tone: '#5A615E',
    body: [
      {
        type: 'p',
        text: 'The rule was simple: everything had to fit in a 30 litre bag and every piece had to work with every other piece.',
      },
      { type: 'h2', text: 'What earned its place' },
      {
        type: 'p',
        text: 'A wool overshirt for cold mornings, two tees, the liner jacket for evenings and merino socks that could be washed in a sink and dried overnight.',
      },
      {
        type: 'p',
        text: 'The canvas tote stayed folded at the bottom of the bag until the last day, when it carried everything we bought at the market.',
      },
    ],
    productHandles: ['wool-overshirt', 'quilted-liner-jacket', 'merino-socks', 'canvas-tote'],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
