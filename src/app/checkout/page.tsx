import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/button';
import { CareLabel } from '@/components/ui/care-label';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false } };

/**
 * Only reachable with the fixtures data source. With a Storefront API source the cart's
 * checkoutUrl points to Shopify's hosted checkout instead.
 */
export default function CheckoutPlaceholder() {
  return (
    <div className="mx-auto max-w-[760px] px-5 py-16 lg:px-8">
      <CareLabel innerClassName="flex flex-col items-start gap-4 px-8 py-10">
        <h1 className="font-wide text-[32px] leading-none font-extrabold tracking-[-0.02em]">
          Checkout happens on Shopify
        </h1>
        <p className="text-muted text-base leading-relaxed">
          In a live store, this button sends the cart to Shopify’s hosted checkout, which handles payment, tax
          and shipping. This build is running on sample data, so there is no checkout to open.
        </p>
        <ButtonLink href="/collections/all">Keep browsing</ButtonLink>
      </CareLabel>
    </div>
  );
}
