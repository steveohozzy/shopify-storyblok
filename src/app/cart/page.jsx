
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCartAction,
  removeCartItemAction,
} from "@/app/actions/cart";
import {
  clearStoredCartId,
  getStoredCartId,
} from "@/lib/cart";

function formatPrice(amount, currencyCode) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currencyCode || "GBP",
  }).format(Number(amount || 0));
}

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const cartId = getStoredCartId();

      if (!cartId) {
        setCart(null);
        return;
      }

      const result = await getCartAction(cartId);

      if (!result) {
        clearStoredCartId();
      }

      setCart(result);
    } catch {
      setError("We couldn't load your bag. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();

    const handleCartUpdated = (event) => {
      if (event.detail?.cart) {
        setCart(event.detail.cart);
        setLoading(false);
      } else {
        loadCart();
      }
    };

    window.addEventListener("cart:updated", handleCartUpdated);

    return () => {
      window.removeEventListener("cart:updated", handleCartUpdated);
    };
  }, [loadCart]);

  const handleRemove = async (lineId) => {
    const cartId = getStoredCartId();

    if (!cartId || removing) return;

    setRemoving(lineId);
    setError("");

    try {
      const updatedCart = await removeCartItemAction(cartId, lineId);

      setCart(updatedCart);

      window.dispatchEvent(
        new CustomEvent("cart:updated", {
          detail: { cart: updatedCart },
        })
      );
    } catch {
      setError("We couldn't remove that item. Please try again.");
    } finally {
      setRemoving(null);
    }
  };

  const lines = cart?.lines?.edges || [];

  if (loading) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8">
        <p className="text-sm text-[#64727c]">Loading your bag...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 lg:py-16">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0a9df5]">
            Your collection
          </p>
          <h1 className="text-4xl font-black tracking-[-0.05em] text-foreground">
            Your bag
          </h1>
        </div>

        {cart?.totalQuantity > 0 && (
          <p className="text-sm text-[#64727c]">
            {cart.totalQuantity}{" "}
            {cart.totalQuantity === 1 ? "item" : "items"}
          </p>
        )}
      </div>

      {error && (
        <p className="mb-6 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {!lines.length ? (
        <div className="border-y border-[#d9dedf] py-16 text-center">
          <h2 className="text-xl font-bold">Your bag is empty</h2>
          <p className="mt-3 text-sm text-[#64727c]">
            Looks like you haven't found your next favourite yet.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex rounded-full bg-[#0a9df5] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0786d2]"
          >
            Discover the collection
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="divide-y divide-[#d9dedf] border-y border-[#d9dedf]">
            {lines.map(({ node }) => {
              const item = node.merchandise;
              const productUrl = `/products/${item.product.handle}`;

              return (
                <div
                  key={node.id}
                  className="flex gap-4 py-5 sm:gap-6"
                >
                  <Link
                    href={productUrl}
                    className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#edf1f1] sm:h-36 sm:w-32"
                  >
                    {item.image?.url && (
                      <Image
                        src={item.image.url}
                        alt={item.image.altText || item.product.title}
                        fill
                        sizes="128px"
                        className="object-contain p-2"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={productUrl}
                      className="font-bold text-foreground transition-colors hover:text-[#0a9df5]"
                    >
                      {item.product.title}
                    </Link>

                    {item.title !== "Default Title" && (
                      <p className="mt-1 text-sm text-[#64727c]">
                        {item.title}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-[#64727c]">
                      Quantity: {node.quantity}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleRemove(node.id)}
                      disabled={removing !== null}
                      className="mt-auto self-start pt-4 text-xs text-[#64727c] underline underline-offset-4 hover:text-red-600 disabled:opacity-50"
                    >
                      {removing === node.id ? "Removing..." : "Remove"}
                    </button>
                  </div>

                  <p className="shrink-0 text-sm font-bold">
                    {formatPrice(
                      Number(item.price.amount) * node.quantity,
                      item.price.currencyCode
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          <aside className="h-fit rounded-[20px] border border-[#d9dedf] p-5 sm:p-6">
            <h2 className="text-lg font-bold">Order summary</h2>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#d9dedf] pt-5">
              <span className="text-sm text-[#64727c]">Subtotal</span>
              <span className="text-lg font-bold">
                {formatPrice(
                  cart.cost.subtotalAmount.amount,
                  cart.cost.subtotalAmount.currencyCode
                )}
              </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#64727c]">
              Shipping, discounts and taxes are calculated at checkout.
            </p>

            <a
              href={cart.checkoutUrl}
              className="mt-6 flex w-full items-center justify-center rounded-full bg-[#0a9df5] px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-[#0786d2]"
            >
              Continue to checkout
            </a>

            <Link
              href="/"
              className="mt-4 block text-center text-sm text-[#64727c] underline underline-offset-4 hover:text-foreground"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
