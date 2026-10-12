import Link from "next/link";
import { Heart } from "lucide-react";
import { storyblokEditable } from "@storyblok/react/rsc";
import { resolveLink } from "@/lib/storyblok";

export default function SnuggleEndNote({ blok }) {
const title = blok.Title || "Your next cuddle is waiting.";
const description =
blok.Description ||
"Discover more Snuggle Buddies at The Entertainer.";
const buttonText = blok.ctaText || "Find your Snuggle Buddy";
const href =
resolveLink(blok.CtaLink) ||
"https://www.thetoyshop.com/search/?text=snuggle%20buddies";

const isExternal = /^https?:///i.test(href);

const buttonClass =
"group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#00594f] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#003f39]";

return (
<section
{...storyblokEditable(blok)}
id={blok.AnchorId || undefined}
className="px-4 py-16 text-[#004c46] md:px-8 md:py-20"
> <div className="mx-auto flex max-w-3xl flex-col items-center text-center"> <Heart
       size={28}
       strokeWidth={1.5}
       className="mb-5 text-[#004c46]"
       aria-hidden="true"
     />


    <h3 className="font-heading text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
      {title}
    </h3>

    {description && (
      <p className="mt-5 max-w-xl whitespace-pre-line text-base leading-[1.8] text-[#004c46] sm:text-lg">
        {description}
      </p>
    )}

    <div className="mt-7">
      {isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          {buttonText}
          <span
            className="text-lg transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </a>
      ) : (
        <Link href={href} className={buttonClass}>
          {buttonText}
          <span
            className="text-lg transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      )}
    </div>
  </div>
</section>


);
}
