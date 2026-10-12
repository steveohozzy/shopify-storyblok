import Image from "next/image";
import { Store, ExternalLink } from "lucide-react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { resolveLink } from "@/lib/storyblok";

export default function RetailerSection({ blok }) {
  const image = blok.Image?.filename;
  const imageAlt =
    blok.ImageAlt ||
    "The colourful Snuggle Buddies Yummy Buddies family";

  const retailerName = blok.RetailerName || "The Entertainer";
  const buttonText = blok.ctaText || "Shop Snuggle Buddies";
  const href =
    resolveLink(blok.CtaLink) ||
    "https://www.thetoyshop.com/brands/addo/snuggle-buddies";

  const isExternal = /^https?:\/\//i.test(href);

  const buttonClass =
    "group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#00594f] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#003f39]";

  return (
    <section
      {...storyblokEditable(blok)}
      className="bg-white px-4 py-12 text-[#004c46] sm:px-8 sm:py-16 lg:py-20"
    >
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-[#f9e6e2] md:grid-cols-2">
        <div className="relative min-h-[260px] sm:min-h-[360px] md:min-h-full">
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
              className="object-cover object-center"
            />
          ) : (
            <div className="flex min-h-[260px] h-full items-center justify-center bg-[#f2d8d3] p-8 text-center sm:min-h-[360px]">
              <p className="text-sm text-[#004c46]/70">
                Add a retailer image in Storyblok
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-start justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <Store
            size={30}
            strokeWidth={1.6}
            className="mb-5 text-[#004c46]"
            aria-hidden="true"
          />

          <div className="mb-3 inline-flex items-center rounded-full bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#004c46] sm:text-xs">
            {blok.Eyebrow || "Meet our retailer"}
          </div>

          <h2 className="font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {retailerName}
          </h2>

          <p className="mt-5 max-w-xl text-base leading-[1.85] text-[#004c46]/80 sm:text-lg">
            {blok.Description ||
              "Explore Snuggle Buddies online at The Entertainer, from classic animal companions to playful little characters."}
          </p>

          <div className="mt-7">
            {isExternal ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass}
              >
                {buttonText}
                <ExternalLink
                  size={16}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            ) : (
              <a href={href} className={buttonClass}>
                {buttonText}
                <ExternalLink
                  size={16}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
            )}
          </div>

          {blok.Note !== "" && (
            <p className="mt-5 text-xs leading-relaxed text-[#004c46]/65 sm:text-sm">
              {blok.Note ||
                "Prices, availability and delivery details are provided by The Entertainer."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
