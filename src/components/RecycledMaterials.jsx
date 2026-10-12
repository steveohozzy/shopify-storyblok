import Image from "next/image";
import { Recycle, Leaf } from "lucide-react";
import { storyblokEditable } from "@storyblok/react/rsc";

const DEFAULT_IMAGE =
  "https://www.thetoyshop.com/medias/515Wx515H-578593-PUDDIN-578593-PUDDIN-4.jpg?context=bWFzdGVyfGltYWdlc3wzNjgxNnxpbWFnZS9qcGVnfGFEa3lMMmcyTWk4eE1qZ3hOelU0TlRFM05qWXdOaTgxTVRWWGVEVXhOVWhmTlRjNE5Ua3pYMUJWUkVSSlRsODFOemcxT1ROZlVGVkVSRWxPTFRRdWFuQm58M2ViNTBhMzM4YWE0NWI0ZTAzNmQ2YjZkMTk3ZGI0N2E4NmFlMmNkNWFlOWIxZTgxZDQyYzI2MjgyNDdiNGNiNw";

export default function RecycledMaterials({ blok }) {
  const image = blok.MascotImage?.filename || DEFAULT_IMAGE;
  const imageAlt =
    blok.ImageAlt || "Snuggle Buddies recycled plastic character";

  return (
    <section
      {...storyblokEditable(blok)}
      className="relative isolate overflow-hidden bg-[#e7f0e5] px-4 py-16 text-[#004c46] sm:px-8 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#cbded0]/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-2 grid-cols-[0.6fr_1.4fr] md:gap-10 lg:gap-16">
        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="absolute inset-4 rounded-full bg-white/60 blur-2xl" />

          <div className="relative overflow-hidden rounded-[32px]">
            <Image
              src={image}
              alt={imageAlt}
              width={600}
              height={600}
              sizes="(max-width: 768px) 90vw, 460px"
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-[#d5e3d5] bg-white px-3 py-3 shadow-lg sm:bottom-6">
            <Recycle
              size={21}
              strokeWidth={1.8}
              className="text-[#00594f]"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="mx-auto max-w-2xl text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#004c46]/10 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#004c46] sm:text-xs">
            <Leaf size={15} aria-hidden="true" />
            {blok.Eyebrow || "A little good goes a long way"}
          </div>

          <h2 className="font-heading text-lg font-bold leading-[0.98] tracking-tight sm:text-xl md:text-2xl lg:text-4xl">
            {blok.Title || "Big cuddles. A little less plastic."}
          </h2>

          <p className="mt-6 max-w-xl text-base text-[#315c51] text-sm sm:text-base md:text-lg">
            {blok.Description ||
              "Our world is full of little things worth looking after. That’s why Snuggle Buddies are made using recycled plastic, turning used materials into something new to love."}
          </p>
        </div>
      </div>
    </section>
  );
}
