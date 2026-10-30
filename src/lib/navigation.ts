export const MAIN_NAV = [
  { href: '/collections/all', label: 'New in' },
  { href: '/collections/outerwear', label: 'Outerwear' },
  { href: '/collections/essentials', label: 'Essentials' },
  { href: '/collections/accessories', label: 'Accessories' },
  { href: '/journal', label: 'Journal' },
] as const;

export const FOOTER_NAV = [
  {
    title: 'Shop',
    links: [
      { href: '/collections/all', label: 'New in' },
      { href: '/collections/outerwear', label: 'Outerwear' },
      { href: '/collections/essentials', label: 'Essentials' },
      { href: '/collections/accessories', label: 'Accessories' },
    ],
  },
  {
    title: 'Help',
    links: [
      { href: '/journal/fixing-a-torn-seam-at-home', label: 'Repairs' },
      { href: '/journal/washing-heavyweight-cotton', label: 'Care guide' },
      { href: '/wishlist', label: 'Wishlist' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/journal', label: 'Journal' },
      { href: '/journal/why-we-sew-in-small-runs', label: 'How we make clothes' },
    ],
  },
] as const;
