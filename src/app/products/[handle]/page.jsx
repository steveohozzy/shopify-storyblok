
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/shopify";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return { title: "Product not found" };
  }

  const firstImage = product.media?.edges?.find(
    ({ node }) =>
      node.__typename === "MediaImage" && node.image?.url
  )?.node.image;

  return {
    title: product.title,
    description: product.description || `Discover ${product.title}.`,
    openGraph: {
      title: product.title,
      description: product.description || `Discover ${product.title}.`,
      images: firstImage?.url ? [firstImage.url] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  const availableVariants = product.variants.filter(
    (variant) => variant.availableForSale
  );

  const firstVariant = availableVariants[0] || product.variants[0];
  const price = firstVariant?.price;

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <nav className="mb-8 text-xs text-[#64727c]">
        <Link href="/" className="transition-colors hover:text-[#0a9df5]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <ProductGallery
          media={product.media}
          title={product.title}
        />

        <div className="md:sticky md:top-24 md:self-start">
          {product.vendor && (
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0a9df5]">
              {product.vendor}
            </p>
          )}

          <h1 className="text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl lg:text-5xl">
            {product.title}
          </h1>

          {price && (
            <p className="mt-5 text-xl font-bold text-foreground">
              {new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: price.currencyCode,
              }).format(Number(price.amount))}
            </p>
          )}

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-[#64727c]">
              {product.description}
            </p>
          )}

          <div className="mt-8 rounded-[20px] border border-[#d9dedf] bg-white p-5 sm:p-6">
            <p className="mb-4 text-sm font-bold">
              {product.availableForSale
                ? "Ready to join your collection?"
                : "Currently unavailable"}
            </p>

            <p className="text-sm leading-relaxed text-[#64727c]">
              {product.availableForSale
                ? "Add this item to your collection and make room for another."
                : "This product is not currently available to purchase."}
            </p>

            <AddToCartButton
              variantId={firstVariant?.id}
              availableForSale={Boolean(firstVariant?.availableForSale)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
