/* GraphQL documents for the Shopify Storefront API. Each operation is named so the
   fixtures data source can answer it without a network request. */

const IMAGE = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

const PRODUCT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    productType
    vendor
    tags
    createdAt
    availableForSale
    featuredImage {
      ...ImageFields
    }
    images(first: 20) {
      nodes {
        ...ImageFields
      }
    }
    options {
      id
      name
      optionValues {
        name
      }
    }
    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          ...ImageFields
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    metafields(
      identifiers: [
        { namespace: "custom", key: "composition" }
        { namespace: "custom", key: "fabric_weight" }
        { namespace: "custom", key: "origin" }
        { namespace: "custom", key: "fibre_source" }
        { namespace: "custom", key: "care" }
        { namespace: "custom", key: "fit" }
      ]
    ) {
      key
      value
    }
    seo {
      title
      description
    }
  }
  ${IMAGE}
`;

const CART = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          amountPerQuantity {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions {
              name
              value
            }
            product {
              handle
              title
              featuredImage {
                ...ImageFields
              }
            }
          }
        }
      }
    }
  }
  ${IMAGE}
`;

export const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts(
    $first: Int!
    $query: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $country: CountryCode
  ) @inContext(country: $country) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      nodes {
        ...ProductFields
      }
    }
  }
  ${PRODUCT}
`;

export const GET_PRODUCT = /* GraphQL */ `
  query GetProduct($handle: String!, $country: CountryCode) @inContext(country: $country) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT}
`;

export const GET_PRODUCT_RECOMMENDATIONS = /* GraphQL */ `
  query GetProductRecommendations($productId: ID!, $country: CountryCode) @inContext(country: $country) {
    productRecommendations(productId: $productId) {
      ...ProductFields
    }
  }
  ${PRODUCT}
`;

export const GET_COLLECTIONS = /* GraphQL */ `
  query GetCollections($first: Int!, $country: CountryCode) @inContext(country: $country) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        description
        image {
          ...ImageFields
        }
      }
    }
  }
  ${IMAGE}
`;

export const GET_COLLECTION_PRODUCTS = /* GraphQL */ `
  query GetCollectionProducts(
    $handle: String!
    $first: Int!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $country: CountryCode
  ) @inContext(country: $country) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        ...ImageFields
      }
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        nodes {
          ...ProductFields
        }
      }
    }
  }
  ${PRODUCT}
`;

export const GET_CART = /* GraphQL */ `
  query GetCart($cartId: ID!, $country: CountryCode) @inContext(country: $country) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART}
`;

export const CREATE_CART = /* GraphQL */ `
  mutation CreateCart($lines: [CartLineInput!], $country: CountryCode) @inContext(country: $country) {
    cartCreate(input: { lines: $lines, buyerIdentity: { countryCode: $country } }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART}
`;

export const ADD_CART_LINES = /* GraphQL */ `
  mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode)
  @inContext(country: $country) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART}
`;

export const UPDATE_CART_LINES = /* GraphQL */ `
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!, $country: CountryCode)
  @inContext(country: $country) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART}
`;

export const REMOVE_CART_LINES = /* GraphQL */ `
  mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!, $country: CountryCode)
  @inContext(country: $country) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART}
`;

export const UPDATE_CART_BUYER_IDENTITY = /* GraphQL */ `
  mutation UpdateCartBuyerIdentity($cartId: ID!, $country: CountryCode!) @inContext(country: $country) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: { countryCode: $country }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART}
`;

/** Pulls the operation name out of a document, e.g. "GetProduct". */
export function operationName(document: string): string {
  const match = /(?:query|mutation)\s+(\w+)/.exec(document);
  if (!match?.[1]) throw new Error('GraphQL document has no operation name');
  return match[1];
}
