import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { renderRichText } from "@storyblok/react";
import { resolveLink } from "@/lib/storyblok";

export default function StorySection({ blok }) {
  const title = blok.Title || "Good collections are a point of view.";
  const titleAccent = blok.titleAccent;
  const description = blok.Blurb
    ? renderRichText(blok.Blurb)
    : "Meet the artists, makers and collectors shaping the world beyond the shelf.";

  const ctaLink = resolveLink(blok.CtaLink) || "/our-world";
  const image = blok.Image?.filename || "/hero-collectibles.png";
  const imageAlt =
    blok.ImageAlt || "Warm wood display shelving with collectibles";

  return (
    <section
      {...storyblokEditable(blok)}
      
    >
      <div id="journal"
      className={`mx-auto grid max-w-[1440px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.25fr] lg:px-12 lg:py-28 ${
        blok.Flip ? "[&>div]:order-2 [&>a]:order-1" : ""
      }`}>
      <div>
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0a9df5]">
          {blok.Tagline || "The vault notes"}
        </p>

        <h2 className="max-w-xl font-heading text-5xl font-black leading-[0.92] tracking-[-0.07em] text-foreground sm:text-6xl">
          {title}
          {titleAccent && (
            <>
              {" "}
              <span className="text-[#0a9df5]">
                {titleAccent}
              </span>
            </>
          )}
        </h2>

        {blok.Blurb ? (
          <div
            className="mt-8 max-w-sm text-sm leading-relaxed text-[#64727c]"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        ) : (
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-[#64727c]">
            {description}
          </p>
        )}
      </div>

      <Link
        href={ctaLink}
        className="group relative block min-h-[300px] overflow-hidden rounded-[24px] bg-[#d8eef8]"
        aria-label={blok.ctaText || "Read the journal"}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1023px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          quality={85}
        />

        {blok.ctaText && (
          <div className="absolute bottom-5 left-5 flex items-center gap-2">
            <span className="rounded-full bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">
              {blok.ctaText}
            </span>

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a9df5] text-white transition-colors group-hover:bg-foreground">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        )}
      </Link>
      </div>
    </section>
  );
}