import { Heart } from "lucide-react";
import { storyblokEditable } from "@storyblok/react/rsc";

export default function PageIntro({ blok }) {
  return (
    <section
      {...storyblokEditable(blok)}
      className="bg-white px-4 py-14 text-center text-[#004c46] sm:px-8 sm:py-16 lg:py-20"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <Heart
          size={26}
          strokeWidth={1.6}
          className="mb-5 text-[#004c46]"
          aria-hidden="true"
        />

        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-[#f9e6e2] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#004c46] sm:text-xs">
          {blok.Eyebrow || "Bring a buddy home"}
        </div>

        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          {blok.Title || "Your next cuddle is waiting."}
        </h1>

        {blok.Description && (
          <p className="mt-5 max-w-xl text-base leading-[1.8] text-[#004c46]/80 sm:text-lg">
            {blok.Description}
          </p>
        )}

        {!blok.Description && (
          <p className="mt-5 max-w-xl text-base leading-[1.8] text-[#004c46]/80 sm:text-lg">
            Find a little friend to call your own.
          </p>
        )}
      </div>
    </section>
  );
}
