
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { renderRichText } from "@storyblok/react";
import { resolveLink } from "@/lib/storyblok";

export default function CollectionSpotlight({ blok }) {
  const image = blok.image?.filename;
  const title = blok.title || "Worth collecting.";
  const accent = blok.titleAccent;
  const description = blok.description
    ? renderRichText(blok.description)
    : null;
  const link = resolveLink(blok.link) || "/collections";
  const imagePosition = blok.imagePosition || "right";

  return (
    <section
      {...storyblokEditable(blok)}
      className="mx-auto max-w-[1440px] px-5 py-12 text-[#101321] sm:px-8 sm:py-16 lg:px-12 lg:py-24"
    >
      <div
        className={`grid gap-8 overflow-hidden rounded-[28px] bg-[#f0f3f5] p-5 sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-12 ${
          imagePosition === "left" ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="flex flex-col items-start">
          {blok.eyebrow && (
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#079fc0]">
              {blok.eyebrow}
            </p>
          )}

          <h2 className="max-w-xl font-heading text-[clamp(2.5rem,5vw,5rem)] font-black leading-[0.9] tracking-[-0.07em]">
            {title}
            {accent && (
              <>
                {" "}
                <span className="text-[#04bfe3]">{accent}</span>
              </>
            )}
          </h2>

          {description && (
            <div
              className="mt-6 max-w-lg text-sm leading-relaxed text-[#647084] sm:text-base"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {blok.buttonText && (
            <Link
              href={link}
              className="group mt-8 inline-flex min-h-[48px] items-center gap-4 rounded-full bg-[#101321] py-2 pl-5 pr-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-[#04d9ff] hover:text-[#101321]"
            >
              {blok.buttonText}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#04d9ff] text-[#101321] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          )}

          {blok.note && (
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[#87919e]">
              {blok.note}
            </p>
          )}
        </div>

        <div className="relative min-h-[300px] overflow-hidden rounded-[22px] bg-[#dce5ea] sm:min-h-[420px] lg:min-h-[540px]">
          {image ? (
            <Image
              src={image}
              alt={blok.imageAlt || ""}
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              quality={90}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-[#647084]">
              Add an image in Storyblok
            </div>
          )}

          {blok.imageLabel && (
            <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-[#101321] backdrop-blur-md sm:bottom-6 sm:left-6">
              {blok.imageLabel}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
