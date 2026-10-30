'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useCart } from '@/components/cart/cart-context';
import { Button } from '@/components/ui/button';
import { CheckIcon, SpinnerIcon } from '@/components/ui/icons';
import { track, toItem } from '@/lib/analytics';
import { findVariant, imagesForColor, missingOptions, type Selection } from '@/lib/catalog/variants';
import type { Product } from '@/lib/shopify/types';
import { useUIStore } from '@/lib/stores/ui-store';
import { OptionPicker } from './option-picker';
import { Price } from './price';
import { ProductGallery } from './product-gallery';
import { RestockForm } from './restock-form';
import { WishlistButton } from './wishlist-button';

type AddState = 'idle' | 'adding' | 'added';

export function ProductExperience({
  product,
  initialSelection,
  locale,
  children,
}: {
  product: Product;
  initialSelection: Selection;
  locale: string;
  /** Server-rendered content under the buy box (label, details). */
  children?: ReactNode;
}) {
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const [state, setState] = useState<AddState>('idle');
  const { addToCart } = useCart();
  const openCart = useUIStore((s) => s.openCart);
  const showToast = useUIStore((s) => s.showToast);
  const addedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const variant = findVariant(product, selection);
  const missing = missingOptions(product, selection);
  const colorOption = product.options.find((o) => /^colou?r$/i.test(o.name));
  const color = colorOption ? selection[colorOption.name] : undefined;
  const galleryImages = useMemo(() => imagesForColor(product, color), [product, color]);

  const price = variant?.price ?? product.priceRange.min;
  const compareAt = variant?.compareAtPrice ?? product.variants[0]?.compareAtPrice ?? null;
  const soldOut = variant ? !variant.availableForSale : !product.availableForSale;

  useEffect(() => {
    track({
      name: 'view_item',
      currency: product.priceRange.min.currencyCode,
      value: Number(product.priceRange.min.amount),
      items: [
        toItem({
          id: product.id,
          title: product.title,
          category: product.productType,
          price: product.priceRange.min,
        }),
      ],
    });
  }, [product]);

  useEffect(() => () => clearTimeout(addedTimer.current), []);

  function select(name: string, value: string) {
    const next = { ...selection, [name]: value };
    // Keep the size when switching colour only if that combination is in stock.
    const sizeOption = product.options.find((o) => /^size$/i.test(o.name))?.name;
    const candidate = findVariant(product, next);
    if (candidate && !candidate.availableForSale && sizeOption && name !== sizeOption)
      delete next[sizeOption];
    setSelection(next);
    setState('idle');
    const params = new URLSearchParams(window.location.search);
    for (const option of product.options) {
      const v = next[option.name];
      if (v && option.values.length > 1) params.set(option.name.toLowerCase(), v);
      else params.delete(option.name.toLowerCase());
    }
    const qs = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  }

  async function add() {
    if (!variant || soldOut || state === 'adding') return;
    setState('adding');
    const result = await addToCart({
      variantId: variant.id,
      variantTitle: variant.title,
      selectedOptions: variant.selectedOptions,
      price: variant.price,
      product: {
        handle: product.handle,
        title: product.title,
        featuredImage: variant.image ?? product.featuredImage,
      },
    });
    if (!result.ok) {
      setState('idle');
      showToast(result.error, { label: 'Retry', onAction: () => void add() });
      return;
    }
    track({
      name: 'add_to_cart',
      currency: variant.price.currencyCode,
      value: Number(variant.price.amount),
      items: [
        toItem({
          id: variant.id,
          title: product.title,
          variant: variant.title,
          category: product.productType,
          price: variant.price,
        }),
      ],
    });
    setState('added');
    openCart();
    addedTimer.current = setTimeout(() => setState('idle'), 2000);
  }

  const label =
    state === 'adding'
      ? 'Adding…'
      : state === 'added'
        ? 'Added to cart'
        : missing.length
          ? `Select a ${missing[0]!.toLowerCase()}`
          : soldOut
            ? 'Sold out'
            : 'Add to cart';

  const buttonVariant = state === 'added' ? 'success' : 'primary';
  const disabled = state === 'adding' || Boolean(missing.length) || soldOut;
  const summary =
    variant && variant.title !== 'Default Title'
      ? variant.title.replace(' / ', ', size ')
      : 'Choose your options';

  return (
    <div className="flex flex-wrap items-start gap-x-12 gap-y-6">
      <div className="min-w-0 flex-[999_1_560px]">
        <ProductGallery key={color ?? 'all'} images={galleryImages} title={product.title} />
      </div>

      <div className="flex max-w-[520px] flex-[1_1_380px] flex-col gap-7">
        <div className="flex flex-col gap-2.5">
          <h1 className="font-wide text-[30px] leading-none font-extrabold tracking-[-0.03em] sm:text-[clamp(34px,3.4vw,48px)]">
            {product.title}
          </h1>
          <Price price={price} compareAt={compareAt} locale={locale} className="text-[22px] font-semibold" />
          <p className="text-muted text-sm">
            Taxes included where applicable. Shipping calculated at checkout.
          </p>
        </div>

        {product.options.map((option) => (
          <OptionPicker
            key={option.id}
            product={product}
            option={option}
            selection={selection}
            onSelect={select}
            sizeGuideHref="#details"
          />
        ))}

        <div className="flex gap-2.5">
          <Button
            size="lg"
            variant={buttonVariant}
            className="flex-1"
            onClick={add}
            disabled={disabled}
            aria-live="polite"
          >
            {state === 'adding' ? (
              <SpinnerIcon size={18} />
            ) : state === 'added' ? (
              <CheckIcon size={18} />
            ) : null}
            {label}
          </Button>
          <WishlistButton product={product} variant={variant} />
        </div>

        {variant && soldOut ? <RestockForm label={`${product.title} in ${variant.title}`} /> : null}

        {children}
      </div>

      {/* Mobile buy bar keeps the main action in reach while scrolling. */}
      <div className="border-line bg-paper fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="flex min-w-0 flex-col">
          <span className="text-muted truncate text-[13px]">{summary}</span>
          <Price price={price} compareAt={compareAt} locale={locale} className="text-[17px] font-bold" />
        </div>
        <Button
          size="md"
          variant={buttonVariant}
          className="h-[52px] flex-1"
          onClick={add}
          disabled={disabled}
        >
          {state === 'adding' ? <SpinnerIcon size={18} /> : null}
          {label}
        </Button>
      </div>
    </div>
  );
}
