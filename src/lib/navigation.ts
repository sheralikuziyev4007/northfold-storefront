export type NavLink = { href: string; label: string };

const NEW_IN: NavLink = { href: '/collections/all', label: 'New in' };
const JOURNAL: NavLink = { href: '/journal', label: 'Journal' };

/** Collections that never belong in the menu: Shopify's homepage collection and the virtual "all". */
const HIDDEN_COLLECTIONS = new Set(['frontpage', 'all']);

/** Turns the store's collections into menu links, so the menu always matches the connected catalog. */
export function collectionLinks(collections: { handle: string; title: string }[], limit = 4): NavLink[] {
  return collections
    .filter((c) => !HIDDEN_COLLECTIONS.has(c.handle))
    .slice(0, limit)
    .map((c) => ({ href: `/collections/${c.handle}`, label: c.title }));
}

export function mainNav(collections: NavLink[]): NavLink[] {
  return [NEW_IN, ...collections, JOURNAL];
}

export function footerNav(collections: NavLink[]): { title: string; links: NavLink[] }[] {
  return [
    { title: 'Shop', links: [NEW_IN, ...collections] },
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
      links: [JOURNAL, { href: '/journal/why-we-sew-in-small-runs', label: 'How we make clothes' }],
    },
  ];
}
