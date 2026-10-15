
"use server";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_TOKEN;

async function shopifyRequest(query, variables = {}) {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error("Shopify environment variables are missing.");
  }

  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/api/2026-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify request failed: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(
      result.errors.map((error) => error.message).join(" ")
    );
  }

  return result.data;
}

const CART_FIELDS = `
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
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
            product {
              title
              handle
            }
          }
        }
      }
    }
  }
`;

function checkUserErrors(userErrors) {
  if (userErrors?.length) {
    throw new Error(userErrors.map((error) => error.message).join(" "));
  }
}

export async function addCartItemAction(cartId, variantId, quantity = 1) {
  if (!variantId || typeof variantId !== "string") {
    throw new Error("A valid product variant is required.");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1.");
  }

  let data;
  let cart;

  if (cartId) {
    data = await shopifyRequest(
      `
        mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              ${CART_FIELDS}
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }],
      }
    );

    checkUserErrors(data.cartLinesAdd.userErrors);
    cart = data.cartLinesAdd.cart;
  } else {
    data = await shopifyRequest(
      `
        mutation CartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              ${CART_FIELDS}
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        input: {
          lines: [{ merchandiseId: variantId, quantity }],
        },
      }
    );

    checkUserErrors(data.cartCreate.userErrors);
    cart = data.cartCreate.cart;
  }

  if (!cart) {
    throw new Error("Shopify did not return a cart.");
  }

  return cart;
}

export async function getCartAction(cartId) {
  if (!cartId) return null;

  const data = await shopifyRequest(
    `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          ${CART_FIELDS}
        }
      }
    `,
    { cartId }
  );

  return data.cart || null;
}

export async function removeCartItemAction(cartId, lineId) {
  if (!cartId || !lineId) {
    throw new Error("A cart ID and line ID are required.");
  }

  const data = await shopifyRequest(
    `
      mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ${CART_FIELDS}
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      cartId,
      lineIds: [lineId],
    }
  );

  checkUserErrors(data.cartLinesRemove.userErrors);

  return data.cartLinesRemove.cart;
}

export async function updateCartItemAction(cartId, lineId, quantity) {
  if (!cartId || !lineId) {
    throw new Error("A cart ID and line ID are required.");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1.");
  }

  const data = await shopifyRequest(
    `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ${CART_FIELDS}
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      cartId,
      lines: [{ id: lineId, quantity }],
    }
  );

  checkUserErrors(data.cartLinesUpdate.userErrors);

  const cart = data.cartLinesUpdate.cart;

  if (!cart) {
    throw new Error("Shopify did not return the updated cart.");
  }

  return cart;
}
