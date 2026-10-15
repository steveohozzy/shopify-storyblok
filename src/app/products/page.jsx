
import { Suspense } from "react";
import { getProducts } from "@/lib/shopify";
import ProductsPageClient from "@/components/ProductsPageClient";

export const metadata = {
  title: "Shop All Toys",
  description: "Explore the full collection of toys and collectibles.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
      <div className="mb-10">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0a9df5]">
          The collection
        </p>

        <h1 className="text-4xl font-black tracking-[-0.06em] text-foreground sm:text-5xl">
          Shop all products
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[#64727c]">
          Find your next favourite from our collection.
        </p>
      </div>

      <Suspense fallback={<p className="text-sm text-[#64727c]">Loading products...</p>}>
        <ProductsPageClient products={products} />
      </Suspense>
    </main>
  );
}
