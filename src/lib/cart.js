
const CART_STORAGE_KEY = "dropzone-shopify-cart-id";

export function getStoredCartId() {
  if (typeof window === "undefined") return null;

  return window.localStorage.getItem(CART_STORAGE_KEY);
}

export function setStoredCartId(cartId) {
  if (typeof window === "undefined") return;

  if (cartId) {
    window.localStorage.setItem(CART_STORAGE_KEY, cartId);
  } else {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  }
}

export function clearStoredCartId() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(CART_STORAGE_KEY);
}
