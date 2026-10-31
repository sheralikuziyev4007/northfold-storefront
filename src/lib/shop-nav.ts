import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import { cache } from 'react';
import { collectionLinks, type NavLink } from '@/lib/navigation';
import { getCollections } from '@/lib/shopify';

/** Menu links for the connected catalog. A failed request leaves the menu with New in and Journal only. */
export const getCollectionLinks = cache(async (): Promise<NavLink[]> => {
  try {
    return collectionLinks(await getCollections());
  } catch (error) {
    unstable_rethrow(error);
    console.error(error);
    return [];
  }
});
