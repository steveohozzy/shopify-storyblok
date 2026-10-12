import { Heart, Sparkles, Gift } from "lucide-react";
import { storyblokEditable } from "@storyblok/react/rsc";

const DEFAULT_VALUES = [
  {
    icon: Heart,
    title: "Irresistibly cuddly",
    description:
      "Luxuriously soft textures that make every hug a little sweeter.",
  },
  {
    icon: Sparkles,
    title: "Lovable characters",
    description:
      "Classic animals and playful personalities to collect and adore.",
  },
  {
    icon: Gift,
    title: "Joyfully giftable",
    description:
      "A little friend for birthdays, celebrations and just-because moments.",
  },
];

export default function BrandValues({ blok }) {
  const values = DEFAULT_VALUES.map((item, index) => ({
    ...item,
    title: blok[`Title${index + 1}`] || item.title,
    description: blok[`Description${index + 1}`] || item.description,
  }));

  return (
    <section
      {...storyblokEditable(blok)}
      className="bg-white px-4 py-14 text-[#004c46] sm:px-8 sm:py-16 lg:py-20"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6 lg:gap-8">
        {values.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title + index}
              className="flex h-full flex-col items-center rounded-3xl bg-[#f9e6e2] px-6 py-9 text-center sm:px-5 sm:py-10 lg:px-8 lg:py-12"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-[#00594f]">
                <Icon size={27} strokeWidth={1.6} aria-hidden="true" />
              </div>

              <h3 className="font-heading text-2xl font-bold leading-tight sm:text-xl lg:text-2xl">
                {item.title}
              </h3>

              <p className="mt-3 max-w-xs text-sm leading-[1.8] text-[#004c46]/80 sm:text-sm lg:text-base">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

