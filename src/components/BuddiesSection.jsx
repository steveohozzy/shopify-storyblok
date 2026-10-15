import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { getProducts } from "@/lib/shopify";
import BuddyGrid from "@/components/BuddyGrid";

export default async function BuddiesSection({ blok }) {
  const products = (await getProducts()).slice(0, 3);

  return (
    <section
      {...storyblokEditable(blok)}
      className="border-y border-[#d9dedf] bg-white"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            {blok.Eyebrow && (
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0a9df5]">
                {blok.Eyebrow}
              </p>
            )}

            {blok.Title && (
              <h2 className="font-heading text-4xl font-black tracking-[-0.07em] text-foreground sm:text-5xl">
                {blok.Title}
              </h2>
            )}
          </div>

          <Link
            href={
              blok.link?.cached_url
                ? `/${blok.link.cached_url}`
                : "/meet-the-buddies"
            }
            className="inline-flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground transition-colors hover:text-[#0a9df5]"
          >
            {blok.linkLabel || "Explore all buddies"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <BuddyGrid items={products} />
      </div>
    </section>
  );
}