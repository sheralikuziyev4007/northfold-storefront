/* Normalized domain types. UI code depends on these, never on raw GraphQL shapes. */

export type Money = { amount: string; currencyCode: string };

export type Image = { url: string; altText: string; width: number; height: number };

export type SelectedOption = { name: string; value: string };

export type ProductOption = { id: string; name: string; values: string[] };

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
};

/** Facts printed on the garment label, sourced from product metafields (namespace "custom"). */
export type ProductLabel = {
  composition: string | null;
  fabricWeight: string | null;
  origin: string | null;
  fibreSource: string | null;
  care: string | null;
  fit: string | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  createdAt: string;
  availableForSale: boolean;
  featuredImage: Image | null;
  images: Image[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: { min: Money; max: Money };
  label: ProductLabel;
  seo: { title: string; description: string };
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money; amountPerQuantity: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: { handle: string; title: string; featuredImage: Image | null };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: { subtotalAmount: Money; totalAmount: Money };
};

export type ProductSort = 'featured' | 'newest' | 'price-asc' | 'price-desc';
