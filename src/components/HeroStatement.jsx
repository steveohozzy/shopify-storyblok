import Image from "next/image";
import { Heart } from "lucide-react";
import { storyblokEditable } from "@storyblok/react/rsc";

export default function HeroStatement({ blok }) {
  const image = blok.Image?.filename;
  const imageAlt =
    blok.ImageAlt ||
    "The official Snuggle Buddies collection of animals and soft heart cushions";

  return (
    <section {...storyblokEditable(blok)} className="bg-[#f9e6e2]">
      <div className="relative isolate flex min-h-[440px] items-end justify-center overflow-hidden sm:min-h-[540px] lg:min-h-[660px]">
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-[#f9e6e2]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-[#f9e6e2]/5 via-transparent to-[#f9e6e2]" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-12 pt-32 text-center sm:px-8 sm:pb-16 lg:pb-20">
          <div className="mb-4 inline-flex items-center justify-center rounded-full border border-[#004c46]/15 bg-[#f9e6e2]/85 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#004c46] shadow-sm backdrop-blur-sm sm:mb-5 sm:text-xs">
            {blok.Eyebrow || "A world of play by Addo"}
          </div>

          <h1 className="mx-auto max-w-4xl font-heading text-5xl font-bold leading-[0.98] tracking-tight text-[#004c46] sm:text-6xl md:text-7xl lg:text-[88px]">
            {blok.Title || "Our snuggly world."}
          </h1>
        </div>
      </div>

      <div className="relative px-5 pb-16 pt-5 text-center sm:px-8 sm:pb-20 sm:pt-8 lg:pb-24">
        <div className="mx-auto max-w-3xl">
          <Heart
            size={26}
            strokeWidth={1.5}
            className="mx-auto mb-5 text-[#004c46]"
            aria-hidden="true"
          />

          <h2 className="font-heading text-3xl font-bold leading-tight text-[#004c46] sm:text-4xl md:text-5xl">
            {blok.StatementTitle || "Little friends, loved in a big way."}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-[1.85] text-[#004c46]/80 sm:mt-6 sm:text-lg">
            {blok.StatementText ||
              "Snuggle Buddies is Addo’s range of luxuriously soft toys, bringing together timeless teddy bears, classic animals and lovable characters. Highly collectable and irresistibly cuddly, they make lovely gifts and companions for all ages."}
          </p>
        </div>
      </div>
    </section>
  );
}