
"use client";

import { useState } from "react";
import { addCartItemAction } from "@/app/actions/cart";
import { getStoredCartId, setStoredCartId } from "@/lib/cart";

export default function AddToCartButton({
  variantId,
  availableForSale,
}) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const handleAddToCart = async () => {
    if (!variantId || adding || !availableForSale) return;

    setAdding(true);
    setAdded(false);
    setError("");

    try {
      const cart = await addCartItemAction(
        getStoredCartId(),
        variantId,
        1
      );

      setStoredCartId(cart.id);

      window.dispatchEvent(
        new CustomEvent("cart:updated", {
          detail: { cart },
        })
      );

      setAdded(true);
    } catch (err) {
      setError(err.message || "Unable to add this item to your bag.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!availableForSale || !variantId || adding}
        className="mt-5 w-full rounded-full bg-[#0a9df5] px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-[#0786d2] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {!availableForSale
          ? "Currently unavailable"
          : adding
            ? "Adding to bag..."
            : added
              ? "Added to bag ✓"
              : "Add to bag"}
      </button>

      {added && (
        <p className="mt-3 text-center text-sm text-[#267347]" role="status">
          Added to your bag successfully.
        </p>
      )}

      {error && (
        <p className="mt-3 text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
