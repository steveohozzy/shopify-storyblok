"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownRight,
  ArrowUpRight,
  Heart,
  Search,
  X,
  ArrowLeft,
  Bookmark,
  Plus,
  Minus,
  Check,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { resolveLink } from "@/lib/storyblok";
import { useBuddyFavourites } from "@/lib/useBuddyFavourites";
import { useBuddyCollection } from "@/lib/useBuddyCollection";
import {
  getCartAction,
  updateCartItemAction,
  removeCartItemAction,
} from "@/app/actions/cart";
import { getStoredCartId, clearStoredCartId } from "@/lib/cart";

export default function Header({ blok, buddies = [], categories = [] }) {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState(null);
  const [query, setQuery] = useState("");
  const { saved, toggleFavourite } = useBuddyFavourites(buddies);
  const { collected, toggleCollection } = useBuddyCollection(buddies);
  const [selected, setSelected] = useState(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");
  const [updatingLine, setUpdatingLine] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  const categoryLinks = categories.map((category) => ({
    _uid: `shopify-${category}`,
    Label: category,
    href: `/products?category=${encodeURIComponent(category)}`,
  }));

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setPanel(null);
        setSelected(null);
        setOpen(false);
        setShopOpen(false);
        setMobileShopOpen(false);
        setCartOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function refreshCart(event) {
      if (event?.detail?.cart) {
        if (active) {
          setCart(event.detail.cart);
          setCartError("");
        }
        return;
      }

      const cartId = getStoredCartId();

      if (!cartId) {
        if (active) setCart(null);
        return;
      }

      try {
        const updatedCart = await getCartAction(cartId);

        if (!active) return;

        if (updatedCart) {
          setCart(updatedCart);
        } else {
          clearStoredCartId();
          setCart(null);
        }

        setCartError("");
      } catch (error) {
        if (active) {
          setCartError("Unable to load your bag. Please try again.");
        }
      }
    }

    refreshCart();

    window.addEventListener("cart:updated", refreshCart);

    return () => {
      active = false;
      window.removeEventListener("cart:updated", refreshCart);
    };
  }, []);

  function getNavHref(item) {
    if (item.href) {
      return item.href;
    }

    const pageLink = resolveLink(item.Link);

    if (item.HomepageAnchor) {
      if (pathname === "/") {
        return `#${item.HomepageAnchor}`;
      }

      if (pageLink && pageLink !== "/") {
        return `${pageLink}#${item.HomepageAnchor}`;
      }

      return `/#${item.HomepageAnchor}`;
    }

    return pageLink || "/";
  }

  function openSearch() {
    setQuery("");
    setSelected(null);
    setPanel("search");
    setOpen(false);
    setMobileShopOpen(false);
    setCartOpen(false);
  }

  function openFavourites() {
    setQuery("");
    setSelected(null);
    setPanel("saved");
    setOpen(false);
    setMobileShopOpen(false);
    setCartOpen(false);
  }

  
  function openCollection() {
    setOpen(false);
    setShopOpen(false);
    setMobileShopOpen(false);
    setCartOpen(false);
    setPanel(null);
    setSelected(null);

    router.push("/your-collection");
  }

  async function openCart() {
    setCartOpen(true);
    setOpen(false);
    setPanel(null);
    setSelected(null);
    setShopOpen(false);
    setMobileShopOpen(false);
    setCartLoading(true);
    setCartError("");

    try {
      const cartId = getStoredCartId();

      if (!cartId) {
        setCart(null);
        return;
      }

      const updatedCart = await getCartAction(cartId);

      if (updatedCart) {
        setCart(updatedCart);
      } else {
        clearStoredCartId();
        setCart(null);
      }
    } catch (error) {
      setCartError("Unable to load your bag. Please try again.");
    } finally {
      setCartLoading(false);
    }
  }

  async function changeCartQuantity(line, quantity) {
    const cartId = getStoredCartId();

    if (!cartId || !line?.id || updatingLine) return;

    setUpdatingLine(line.id);
    setCartError("");

    try {
      const updatedCart =
        quantity < 1
          ? await removeCartItemAction(cartId, line.id)
          : await updateCartItemAction(cartId, line.id, quantity);

      setCart(updatedCart);

      window.dispatchEvent(
        new CustomEvent("cart:updated", {
          detail: { cart: updatedCart },
        })
      );
    } catch (error) {
      setCartError(error.message || "Unable to update your bag.");
    } finally {
      setUpdatingLine(null);
    }
  }

  const cartCount = cart?.totalQuantity || 0;
  const cartLines = cart?.lines?.edges?.map((edge) => edge.node) || [];
  const cartSubtotal = cart?.cost?.subtotalAmount;

  function formatCartPrice(price) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: price?.currencyCode || "GBP",
    }).format(Number(price?.amount || 0));
  }

  const results = buddies.filter((buddy) => {
    if (panel === "saved" && !saved.includes(buddy.id)) {
      return false;
    }

    if (panel === "collection" && !collected.includes(buddy.id)) {
      return false;
    }

    const searchText = [
      buddy.name,
      buddy.category,
      buddy.description,
      buddy.line,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchText.includes(query.toLowerCase());
  });

  return (
    <>
      <header
        {...storyblokEditable(blok)}
        className="sticky top-0 z-50 border-b border-border bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex h-24 items-center justify-between">
            <Link
              href="/"
              className="relative flex h-20 w-40 shrink-0 items-center gap-1 text-3xl font-black tracking-tighter text-primary"
              onClick={() => {
                setOpen(false);
                setShopOpen(false);
                setMobileShopOpen(false);
              }}
            >
              <ArrowDownRight
                className="mt-2 h-5 w-5 shrink-0"
                strokeWidth={4}
              />
              <span>DROPZONE</span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden items-center gap-6 md:flex lg:gap-8">
              {categoryLinks.length > 0 && (
                <div
                  className="relative"
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setShopOpen(!shopOpen)}
                    aria-expanded={shopOpen}
                    aria-haspopup="true"
                    className="inline-flex items-center gap-1.5 py-2 font-heading text-sm text-foreground transition-colors hover:text-primary lg:text-base"
                  >
                    Shop
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        shopOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute left-0 top-full z-[70] w-64 pt-3 transition-all duration-200 ${
                      shopOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-white p-2 shadow-xl">
                      <Link
                        href="/products"
                        onClick={() => setShopOpen(false)}
                        className="flex items-center justify-between rounded-xl px-4 py-3 font-heading text-sm font-bold text-primary transition-colors hover:bg-muted"
                      >
                        All products
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>

                      <div className="my-1 border-t border-border" />

                      {categoryLinks.map((item) => (
                        <Link
                          key={item._uid}
                          href={item.href}
                          onClick={() => setShopOpen(false)}
                          className="block rounded-xl px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                        >
                          {item.Label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {blok?.Navigation?.map((item) => (
                <Link
                  key={item._uid}
                  href={getNavHref(item)}
                  target={item.OpenInNewTab ? "_blank" : undefined}
                  rel={
                    item.OpenInNewTab
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group inline-flex items-center gap-1.5 py-2 font-heading text-sm text-foreground transition-colors hover:text-primary lg:text-base"
                >
                  <span>{item.Label}</span>

                  {item.OpenInNewTab && (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search items"
                title="Search"
                className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={openFavourites}
                aria-label={`Favourite b items (${saved.length})`}
                title="Favourites"
                className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <Heart
                  className="h-5 w-5"
                  fill={saved.length ? "currentColor" : "none"}
                />

                {saved.length > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {saved.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={openCollection}
                aria-label={`My collection (${collected.length})`}
                title="My collection"
                className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <Bookmark className="h-5 w-5" />

                {collected.length > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {collected.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={openCart}
                aria-label={`Shopping bag (${cartCount} items)`}
                title="Shopping bag"
                className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <ShoppingBag className="h-5 w-5" />

                {cartCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-navigation"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-border bg-white text-foreground transition-colors hover:bg-muted md:hidden"
              >
                <div className="relative h-6 w-6">
                  <span
                    className={`absolute left-0 top-1 h-0.5 w-6 bg-current transition-all duration-300 ${
                      open ? "translate-y-2 rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-3 h-0.5 w-6 bg-current transition-all duration-300 ${
                      open ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-5 h-0.5 w-6 bg-current transition-all duration-300 ${
                      open ? "-translate-y-2 -rotate-45" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={() => {
          setOpen(false);
          setMobileShopOpen(false);
        }}
        className={`fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile navigation flyout */}
      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[60] flex h-dvh w-full max-w-[400px] flex-col overflow-y-auto border-l border-border bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-6">
          <Link
            href="/"
            className="relative h-14 w-40 shrink-0"
            onClick={() => {
              setOpen(false);
              setMobileShopOpen(false);
            }}
          >
            <Image
              src={
                blok?.Logo?.filename ||
                "https://www.addoplay.com/wp-content/uploads/2025/04/AP_Licensing.png"
              }
              alt={blok?.LogoAlt || "ADDO Play"}
              fill
              className="object-contain object-left"
            />
          </Link>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setMobileShopOpen(false);
            }}
            aria-label="Close menu"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border text-2xl text-foreground transition-colors hover:bg-muted"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 px-5 py-4">
          {/* Mobile Shop menu */}
          {categoryLinks.length > 0 && (
            <div className="border-b border-border">
              <button
                type="button"
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
                aria-expanded={mobileShopOpen}
                aria-controls="mobile-shop-categories"
                className="flex w-full items-center justify-between px-3 py-5 font-heading text-lg text-foreground transition-colors hover:text-primary"
              >
                <span>Shop</span>

                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                    mobileShopOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id="mobile-shop-categories"
                className={`grid transition-[grid-template-rows] duration-300 ${
                  mobileShopOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-3 pl-3">
                    <Link
                      href="/products"
                      onClick={() => {
                        setOpen(false);
                        setMobileShopOpen(false);
                      }}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold text-primary transition-colors hover:bg-muted"
                    >
                      <span>All products</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>

                    {categoryLinks.map((item) => (
                      <Link
                        key={item._uid}
                        href={item.href}
                        onClick={() => {
                          setOpen(false);
                          setMobileShopOpen(false);
                        }}
                        className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                      >
                        <span>{item.Label}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {blok?.Navigation?.map((item) => (
            <Link
              key={item._uid}
              href={getNavHref(item)}
              target={item.OpenInNewTab ? "_blank" : undefined}
              rel={
                item.OpenInNewTab
                  ? "noopener noreferrer"
                  : undefined
              }
              onClick={() => {
                setOpen(false);
                setMobileShopOpen(false);
              }}
              className="group flex items-center justify-between border-b border-border px-3 py-5 font-heading text-lg text-foreground transition-colors hover:text-primary"
            >
              <span>{item.Label}</span>

              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </nav>

        <div className="grid grid-cols-2 gap-3 border-t border-border p-5">
          <button
            type="button"
            onClick={openFavourites}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Heart className="h-4 w-4" />
            Favourites ({saved.length})
          </button>

          <button
            type="button"
            onClick={openCollection}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Bookmark className="h-4 w-4" />
            My collection ({collected.length})
          </button>

          <button
            type="button"
            onClick={openSearch}
            className="col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Search className="h-4 w-4" />
            Find an item
          </button>

          <button
            type="button"
            onClick={openCart}
            className="col-span-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <ShoppingBag className="h-4 w-4" />
            Shopping bag ({cartCount})
          </button>
        </div>
      </aside>

      {/* Shopping bag backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-[80] bg-foreground/30 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Shopping bag panel */}
      <aside
        aria-label="Shopping bag"
        aria-hidden={!cartOpen}
        className={`fixed right-0 top-0 z-[90] flex h-dvh w-full max-w-md flex-col border-l border-border bg-white shadow-2xl transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Your bag
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close shopping bag"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cartError && (
          <div
            role="alert"
            className="mx-5 mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {cartError}
            <button
              type="button"
              onClick={openCart}
              className="ml-2 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {cartLoading ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading your bag...
            </div>
          ) : cartLines.length > 0 ? (
            <div className="flex flex-col gap-5">
              {cartLines.map((line) => {
                const product = line.merchandise?.product;
                const variant = line.merchandise;
                const busy = updatingLine === line.id;

                return (
                  <div
                    key={line.id}
                    className="flex gap-4 border-b border-border pb-5"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {variant?.image?.url && (
                        <img
                          src={variant.image.url}
                          alt={variant.image.altText || product?.title || ""}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-heading font-bold text-foreground">
                            {product?.title || "Product"}
                          </p>

                          {variant?.title &&
                            variant.title !== "Default Title" && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {variant.title}
                              </p>
                            )}
                        </div>

                        <p className="shrink-0 text-sm font-bold text-foreground">
                          {formatCartPrice({
                            amount:
                              Number(variant?.price?.amount || 0) *
                              line.quantity,
                            currencyCode:
                              variant?.price?.currencyCode || "GBP",
                          })}
                        </p>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatCartPrice(variant?.price)} each
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center rounded-full border border-border">
                          <button
                            type="button"
                            onClick={() =>
                              changeCartQuantity(line, line.quantity - 1)
                            }
                            disabled={busy || updatingLine !== null}
                            aria-label={`Decrease quantity of ${product?.title || "product"}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:opacity-40"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="min-w-8 text-center text-sm font-semibold">
                            {line.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              changeCartQuantity(line, line.quantity + 1)
                            }
                            disabled={busy || updatingLine !== null}
                            aria-label={`Increase quantity of ${product?.title || "product"}`}
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:opacity-40"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => changeCartQuantity(line, 0)}
                          disabled={busy || updatingLine !== null}
                          className="text-xs font-semibold text-muted-foreground underline transition-colors hover:text-red-600 disabled:opacity-40"
                        >
                          {busy ? "Updating..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-5 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />

              <h3 className="mt-5 font-heading text-xl font-bold text-foreground">
                Your bag is empty
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Found something you love? Add it to your bag and it will appear here.
              </p>

              <Link
                href="/products"
                onClick={() => setCartOpen(false)}
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Explore products
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {cartLines.length > 0 && (
          <div className="border-t border-border bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="font-heading text-base font-bold text-foreground">
                Subtotal
              </span>

              <span className="text-lg font-bold text-foreground">
                {formatCartPrice(cartSubtotal)}
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Shipping and any applicable taxes are calculated at checkout.
            </p>

            <a
              href={cart?.checkoutUrl || undefined}
              onClick={(event) => {
                if (!cart?.checkoutUrl) event.preventDefault();
              }}
              className={`mt-5 flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 ${
                !cart?.checkoutUrl ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Checkout
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="mt-3 w-full py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>

      {/* Search, favourites and collection dialog */}
      {panel && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-foreground/40 px-4 py-8 backdrop-blur-sm sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPanel(null);
              setSelected(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="buddy-dialog-title"
            className="my-auto flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2
                  id="buddy-dialog-title"
                  className="font-heading text-2xl font-bold text-foreground"
                >
                  {panel === "saved"
                    ? "Your favourite items"
                    : panel === "collection"
                      ? "My collection"
                      : "Find your collectible"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {panel === "saved"
                    ? "Your little cuddle collection."
                    : panel === "collection"
                      ? "The items you already own."
                      : "A new item is calling you."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPanel(null);
                  setSelected(null);
                }}
                aria-label="Close dialog"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selected ? (
              <div className="overflow-y-auto p-6">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to results
                </button>

                <img
                  src={selected.image}
                  alt={selected.name}
                  className="mb-5 aspect-square w-full rounded-2xl bg-muted object-cover"
                />

                <h3 className="font-heading text-2xl font-bold text-foreground">
                  {selected.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {selected.category}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-foreground">
                  {selected.description || selected.line}
                </p>

                <div className="mt-6 flex gap-3">
                  <a
                    href={`https://www.thetoyshop.com/p/${encodeURIComponent(
                      selected.id
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Find at The Entertainer
                    <ArrowUpRight className="h-4 w-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => toggleFavourite(selected.id)}
                    aria-label={
                      saved.includes(selected.id)
                        ? "Remove from favourites"
                        : "Add to favourites"
                    }
                    title="Toggle favourite"
                    className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border text-primary transition-colors hover:bg-muted"
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={
                        saved.includes(selected.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCollection(selected.id)}
                    aria-label={
                      collected.includes(selected.id)
                        ? "Remove from my collection"
                        : "Add to my collection"
                    }
                    title={
                      collected.includes(selected.id)
                        ? "Remove from my collection"
                        : "Add to my collection"
                    }
                    className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border transition-colors hover:bg-muted ${
                      collected.includes(selected.id)
                        ? "bg-primary text-primary-foreground"
                        : "text-primary"
                    }`}
                  >
                    {collected.includes(selected.id) ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {panel === "search" && (
                  <div className="px-5 pt-5">
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 focus-within:border-primary">
                      <Search className="h-5 w-5 shrink-0 text-muted-foreground" />

                      <input
                        type="search"
                        autoFocus
                        aria-label="Search items"
                        placeholder="Figure, card, pop..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="h-12 min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                      />

                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          aria-label="Clear search"
                          className="cursor-pointer text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto p-4">
                  {results.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {results.map((buddy) => {
                        const isSaved = saved.includes(buddy.id);
                        const isCollected = collected.includes(buddy.id);

                        return (
                          <div
                            key={buddy.id}
                            className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-muted"
                          >
                            <button
                              type="button"
                              onClick={() => setSelected(buddy)}
                              className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                            >
                              <img
                                src={buddy.image}
                                alt={buddy.name}
                                className="h-16 w-16 shrink-0 rounded-xl bg-muted object-cover"
                              />

                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-heading text-base font-bold text-foreground">
                                  {buddy.name}
                                </span>

                                <span className="mt-1 block text-xs text-muted-foreground">
                                  {buddy.category}
                                </span>
                              </span>

                              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleFavourite(buddy.id)}
                              aria-label={
                                isSaved
                                  ? `Remove ${buddy.name} from favourites`
                                  : `Add ${buddy.name} to favourites`
                              }
                              title={
                                isSaved
                                  ? "Remove favourite"
                                  : "Add favourite"
                              }
                              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-primary transition-colors hover:bg-white"
                            >
                              <Heart
                                className="h-5 w-5"
                                fill={isSaved ? "currentColor" : "none"}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleCollection(buddy.id)}
                              aria-label={
                                isCollected
                                  ? `Remove ${buddy.name} from my collection`
                                  : `Add ${buddy.name} to my collection`
                              }
                              title={
                                isCollected
                                  ? "Remove from my collection"
                                  : "Add to my collection"
                              }
                              className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white ${
                                isCollected
                                  ? "text-primary"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              {isCollected ? (
                                <Check className="h-5 w-5" />
                              ) : (
                                <Plus className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-12 text-center">
                      {panel === "collection" ? (
                        <Bookmark className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      ) : (
                        <Heart className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      )}

                      <p className="mt-4 font-heading text-lg font-bold text-foreground">
                        {panel === "saved"
                          ? "No favourites just yet"
                          : panel === "collection"
                            ? "Your collection is waiting"
                            : "No items found"}
                      </p>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {panel === "saved"
                          ? "Search for a collectible and tap the heart to save it here."
                          : panel === "collection"
                            ? "Add items you already own using the plus button on their cards."
                            : "Try another name or category, such as figure or card."}
                      </p>

                      {(panel === "saved" || panel === "collection") && (
                        <button
                          type="button"
                          onClick={openSearch}
                          className="mt-5 cursor-pointer rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          Find an item
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-border px-6 py-3">
                  <p className="text-xs text-muted-foreground">
                    {panel === "saved"
                      ? `${results.length} favourite${results.length === 1 ? "" : "s"}`
                      : panel === "collection"
                        ? `${results.length} item${results.length === 1 ? "" : "s"} in your collection`
                        : `${results.length} item${results.length === 1 ? "" : "s"} found`}
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}