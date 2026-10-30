import type { Product } from '@/lib/shopify/types';
import { siteUrl } from '@/lib/utils';

function JsonLd({ data }: { data: Record<string, unknown> }) {
  // "<" is escaped so product text can never close the script tag.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const url = `${siteUrl}/products/${product.handle}`;
  const abs = (src: string) => (src.startsWith('http') ? src : `${siteUrl}${src}`);
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ProductGroup',
        name: product.title,
        description: product.description,
        url,
        brand: { '@type': 'Brand', name: product.vendor || 'Northfold' },
        productGroupID: product.id,
        variesBy: product.options.map((o) =>
          /^size$/i.test(o.name) ? 'https://schema.org/size' : 'https://schema.org/color',
        ),
        hasVariant: product.variants.map((v) => ({
          '@type': 'Product',
          sku: v.id,
          name: `${product.title}${v.title === 'Default Title' ? '' : ` – ${v.title}`}`,
          image: abs((v.image ?? product.featuredImage)?.url ?? ''),
          ...Object.fromEntries(
            v.selectedOptions
              .filter((o) => /^(size|colou?r)$/i.test(o.name))
              .map((o) => [/^size$/i.test(o.name) ? 'size' : 'color', o.value]),
          ),
          offers: {
            '@type': 'Offer',
            url: `${url}?${v.selectedOptions.map((o) => `${o.name.toLowerCase()}=${encodeURIComponent(o.value)}`).join('&')}`,
            price: v.price.amount,
            priceCurrency: v.price.currencyCode,
            availability: v.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: `${siteUrl}${item.path}`,
        })),
      }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Northfold',
        url: siteUrl,
        description: 'Small-run clothing in heavyweight natural fabrics. A portfolio project.',
      }}
    />
  );
}
