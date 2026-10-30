import type { RawCart, RawCollection, RawImage, RawProduct } from './raw-types';
import type { Cart, Collection, Image, Product, ProductLabel } from './types';

export function normalizeImage(image: RawImage | null | undefined, fallbackAlt: string): Image | null {
  if (!image?.url) return null;
  return {
    url: image.url,
    altText: image.altText?.trim() || fallbackAlt,
    width: image.width ?? 1200,
    height: image.height ?? 1500,
  };
}

const LABEL_KEYS: Record<string, keyof ProductLabel> = {
  composition: 'composition',
  fabric_weight: 'fabricWeight',
  origin: 'origin',
  fibre_source: 'fibreSource',
  care: 'care',
  fit: 'fit',
};

export function normalizeLabel(metafields: RawProduct['metafields']): ProductLabel {
  const label: ProductLabel = {
    composition: null,
    fabricWeight: null,
    origin: null,
    fibreSource: null,
    care: null,
    fit: null,
  };
  for (const field of metafields ?? []) {
    const key = field ? LABEL_KEYS[field.key] : undefined;
    if (field && key && field.value.trim()) label[key] = field.value.trim();
  }
  return label;
}

export function hasLabel(label: ProductLabel): boolean {
  return Boolean(label.composition || label.fabricWeight || label.origin || label.fibreSource);
}

export function normalizeProduct(raw: RawProduct): Product {
  const images = raw.images.nodes
    .map((img, i) => normalizeImage(img, `${raw.title}, view ${i + 1}`))
    .filter((img): img is Image => img !== null);

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    productType: raw.productType,
    vendor: raw.vendor,
    tags: raw.tags,
    createdAt: raw.createdAt,
    availableForSale: raw.availableForSale,
    featuredImage: normalizeImage(raw.featuredImage, raw.title) ?? images[0] ?? null,
    images,
    // Shopify returns a single "Title / Default Title" option for products without variants.
    options: raw.options
      .filter((o) => !(o.optionValues.length === 1 && o.optionValues[0]?.name === 'Default Title'))
      .map((o) => ({ id: o.id, name: o.name, values: o.optionValues.map((v) => v.name) })),
    variants: raw.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      selectedOptions: v.selectedOptions,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      image: normalizeImage(v.image, `${raw.title}, ${v.title}`),
    })),
    priceRange: { min: raw.priceRange.minVariantPrice, max: raw.priceRange.maxVariantPrice },
    label: normalizeLabel(raw.metafields),
    seo: {
      title: raw.seo?.title || raw.title,
      description: raw.seo?.description || raw.description.slice(0, 155),
    },
  };
}

export function normalizeCollection(raw: RawCollection): Collection {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    image: normalizeImage(raw.image, raw.title),
  };
}

export function normalizeCart(raw: RawCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    cost: raw.cost,
    lines: raw.lines.nodes.map((line) => ({
      ...line,
      merchandise: {
        ...line.merchandise,
        product: {
          ...line.merchandise.product,
          featuredImage: normalizeImage(
            line.merchandise.product.featuredImage,
            line.merchandise.product.title,
          ),
        },
      },
    })),
  };
}
