export const CREATE_CART = `
  mutation CreateCart {
    cartCreate {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
    }
  }
`;

export const ADD_TO_CART = `
  mutation AddToCart(
    $cartId: ID!
    $variantId: ID!
    $quantity: Int!
  ) {
    cartLinesAdd(
      cartId: $cartId
      lines: [
        {
          merchandiseId: $variantId
          quantity: $quantity
        }
      ]
    ) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
    }
  }
`;

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity

      cost {
        subtotalAmount {
          amount
          currencyCode
        }
      }

      lines(first: 50) {
        edges {
          node {
            id
            quantity

            merchandise {
              ... on ProductVariant {
                id
                title

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
    }
  }
`;

export const UPDATE_CART_ITEM = `
  mutation UpdateCartItem(
    $cartId: ID!
    $lineId: ID!
    $quantity: Int!
  ) {
    cartLinesUpdate(
      cartId: $cartId
      lines: [
        {
          id: $lineId
          quantity: $quantity
        }
      ]
    ) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
    }
  }
`;

export const REMOVE_FROM_CART = `
  mutation RemoveFromCart(
    $cartId: ID!
    $lineIds: [ID!]!
  ) {
    cartLinesRemove(
      cartId: $cartId
      lineIds: $lineIds
    ) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
    }
  }
`;