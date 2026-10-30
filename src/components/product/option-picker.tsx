'use client';

import { swatchFor } from '@/lib/catalog/swatches';
import { isValueAvailable, type Selection } from '@/lib/catalog/variants';
import type { Product, ProductOption } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

export function OptionPicker({
  product,
  option,
  selection,
  onSelect,
  sizeGuideHref,
}: {
  product: Product;
  option: ProductOption;
  selection: Selection;
  onSelect: (name: string, value: string) => void;
  sizeGuideHref?: string;
}) {
  const isColor = /^colou?r$/i.test(option.name);
  const selected = selection[option.name];

  return (
    <fieldset className="m-0 border-0 p-0">
      <div className="mb-3 flex items-baseline justify-between">
        <legend className="float-left p-0 text-[15px]">
          <span className="font-bold">{option.name}</span>
          {isColor && selected ? `: ${selected}` : null}
        </legend>
        {!isColor && sizeGuideHref ? (
          <a href={sizeGuideHref} className="text-sm underline underline-offset-2">
            Size guide
          </a>
        ) : null}
      </div>

      {isColor ? (
        <div className="clear-both flex flex-wrap gap-2.5">
          {option.values.map((value) => {
            const active = value === selected;
            const available = isValueAvailable(product, { [option.name]: value }, option.name, value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => onSelect(option.name, value)}
                aria-pressed={active}
                aria-label={available ? value : `${value}, sold out`}
                title={value}
                className={cn(
                  'relative size-11 rounded-full',
                  active
                    ? 'shadow-[0_0_0_3px_var(--color-stone),0_0_0_5px_var(--color-ink)]'
                    : 'shadow-[inset_0_0_0_1px_rgb(30_36_34/0.25)]',
                )}
                style={{ background: swatchFor(value) }}
              >
                {!available ? (
                  <span
                    aria-hidden="true"
                    className="bg-ink/70 absolute inset-0 m-auto h-px w-[130%] -rotate-45"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="clear-both grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2">
          {option.values.map((value) => {
            const active = value === selected;
            const available = isValueAvailable(product, selection, option.name, value);
            return (
              <button
                key={value}
                type="button"
                disabled={!available}
                onClick={() => onSelect(option.name, value)}
                aria-pressed={active}
                aria-label={available ? `${option.name} ${value}` : `${option.name} ${value}, sold out`}
                className={cn(
                  'h-[52px] rounded border-[1.5px] text-[15px] font-semibold',
                  active ? 'border-ink bg-ink text-paper' : 'border-line bg-paper hover:border-ink',
                  !available && 'hover:border-line cursor-not-allowed text-[#8A918D] line-through',
                )}
              >
                {value}
              </button>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
