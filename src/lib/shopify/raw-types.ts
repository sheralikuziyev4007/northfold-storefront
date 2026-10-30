/* Shapes returned by the Storefront API for the documents in queries.ts. */
import type { Image, Money, SelectedOption } from './types';

export type RawImage = { url: string; altText: string | null; width: number | null; height: number | null };

export type RawVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: RawImage | null;
};

export type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  createdAt: string;
  availableForSale: boolean;
  featuredImage: RawImage | null;
  images: { nodes: RawImage[] };
  options: { id: string; name: string; optionValues: { name: string }[] }[];
  variants: { nodes: RawVariant[] };
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  metafields: ({ key: string; value: string } | null)[] | null;
  seo: { title: string | null; description: string | null } | null;
};

export type RawCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: RawImage | null;
};

export type RawCartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money; amountPerQuantity: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: { handle: string; title: string; featuredImage: RawImage | null };
  };
};

export type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: { nodes: RawCartLine[] };
};

export type UserError = { field: string[] | null; message: string };

export type CartMutationPayload = { cart: RawCart | null; userErrors: UserError[] };

export type { Image };
