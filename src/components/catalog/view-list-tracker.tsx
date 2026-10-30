'use client';

import { useEffect } from 'react';
import { track, type AnalyticsItem } from '@/lib/analytics';

export function ViewListTracker({ listName, items }: { listName: string; items: AnalyticsItem[] }) {
  const key = items.map((i) => i.item_id).join(',');
  useEffect(() => {
    track({ name: 'view_item_list', item_list_name: listName, items });
    // Re-run only when the visible result set changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listName, key]);
  return null;
}
