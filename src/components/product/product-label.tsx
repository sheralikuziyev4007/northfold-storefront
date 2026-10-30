import { CareLabel } from '@/components/ui/care-label';
import { HangDryIcon, NoBleachIcon, WashColdIcon } from '@/components/ui/icons';
import { hasLabel } from '@/lib/shopify/normalize';
import type { ProductLabel as Label } from '@/lib/shopify/types';

/** Garment label facts from product metafields. Hidden when the store has not filled them in. */
export function ProductLabel({ label }: { label: Label }) {
  if (!hasLabel(label)) return null;
  const rows = [
    ['Composition', label.composition],
    ['Fabric weight', label.fabricWeight],
    ['Sewn in', label.origin],
    ['Fibre source', label.fibreSource],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <CareLabel innerClassName="flex flex-col gap-3.5 px-4.5 py-5">
      <h2 className="text-[15px] font-bold">From the label</h2>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {rows.map(([term, value]) => (
          <div key={term} className="flex flex-col gap-0.5">
            <dt className="text-muted">{term}</dt>
            <dd className="font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      {label.care ? (
        <div className="border-line-soft flex items-center gap-3 border-t pt-3 text-sm">
          <span className="flex gap-2" aria-hidden="true">
            <WashColdIcon size={24} />
            <NoBleachIcon size={24} />
            <HangDryIcon size={24} />
          </span>
          <span className="text-muted">{label.care}</span>
        </div>
      ) : null}
    </CareLabel>
  );
}
