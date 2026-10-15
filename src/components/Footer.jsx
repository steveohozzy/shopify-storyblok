import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";

import { getStoryblokApi, resolveLink } from "@/lib/storyblok";

import InstagramIcon from "./icons/InstagramIcon";
import FacebookIcon from "./icons/FacebookIcon";
import YoutubeIcon from "./icons/YouTubeIcon";
import LinkedInIcon from "./icons/LinkedInIcon";
import {
  ArrowDownRight,
} from "lucide-react";

export default async function Footer() {
  const storyblokApi = getStoryblokApi();

  const [{ data: footerData }, { data: headerData }] = await Promise.all([
    storyblokApi.get("cdn/stories/globals/footer", {
      version: "draft",
    }),
    storyblokApi.get("cdn/stories/globals/header", {
      version: "draft",
    }),
  ]);

  const footer =
    footerData?.story?.content?.body?.find(
      (blok) => blok.component === "footer"
    ) || {};

  const header =
    headerData?.story?.content?.body?.find(
      (blok) => blok.component === "HeaderSettings"
    ) || {};

  const menuItems = header.Navigation || [];

  const pathname =
    (await headers()).get("x-pathname") || "/";

  function getNavHref(item) {
    const pageLink = resolveLink(item.Link);

    if (item.HomepageAnchor) {
      if (pathname === "/") {
        return `#${item.HomepageAnchor}`;
      }

      if (pageLink && pageLink !== "/") {
        return `${pageLink}#${item.HomepageAnchor}`;
      }

      return `/#${item.HomepageAnchor}`;
    }

    return pageLink || "/";
  }

  const socials = [
    {
      name: "Instagram",
      link: footer.socialInstagram,
      icon: <InstagramIcon />,
    },
    {
      name: "Facebook",
      link: footer.socialFacebook,
      icon: <FacebookIcon />,
    },
    {
      name: "YouTube",
      link: footer.socialYoutube,
      icon: <YoutubeIcon />,
    },
    {
      name: "LinkedIn",
      link: footer.socialLinkedIn,
      icon: <LinkedInIcon />,
    },
  ]
    .filter(
      (social) =>
        social.link?.cached_url ||
        social.link?.url
    )
    .map((social) => ({
      ...social,
      url: resolveLink(social.link),
    }));
    
    console.log(
  footerData?.story?.content?.body
);
  return ( <footer className="relative mt-auto border-t border-border bg-[#f9f9f9] text-foreground"> <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:gap-12 md:px-8 md:py-16"> <div>  <Link
              href="/"
              className="relative flex h-20 w-40 shrink-0 items-center gap-1 text-3xl font-black tracking-tighter text-primary"
            >
              <ArrowDownRight
                className="mt-2 h-5 w-5 shrink-0"
                strokeWidth={4}
              />
              <span>DROPZONE</span>
            </Link>


      {footer.brandText && (
        <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
          {footer.brandText}
        </p>
      )}

      {socials.length > 0 && (
        <div className="mt-6 flex gap-3">
          {socials.map((social) => (
            <Link
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              {social.icon}
              <span className="sr-only">{social.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>

    <div>
      <h2 className="font-heading text-lg font-bold text-foreground">
        Explore
      </h2>

      <nav aria-label="Footer navigation" className="mt-5">
        <ul className="grid gap-3">
          {menuItems.map((item) => (
            <li key={item._uid}>
              <Link
                href={getNavHref(item)}
                target={item.OpenInNewTab ? "_blank" : undefined}
                rel={item.OpenInNewTab ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <span aria-hidden="true">→</span>
                {item.Label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>

    <div className="rounded-2xl border border-border bg-muted/40 p-6 md:p-7">
      {footer.ctaTitle && (
        <h2 className="font-heading text-2xl font-bold text-foreground">
          {footer.ctaTitle}
        </h2>
      )}

      {footer.ctaText && (
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {footer.ctaText}
        </p>
      )}

      {footer.ctaButtonText && (
        <Link
          href={resolveLink(footer.ctaButtonLink)}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {footer.ctaButtonText}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  </div>

  <div className="border-t border-border">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-sm text-muted-foreground md:flex-row md:px-8">
      <p className="text-center md:text-left">
        © {new Date().getFullYear()} Dropzone.
      </p>

      <nav aria-label="Legal links" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <Link
          href={resolveLink(footer.privacyLink)}
          className="transition-colors hover:text-primary"
        >
          Privacy
        </Link>

        <Link
          href={resolveLink(footer.termsLink)}
          className="transition-colors hover:text-primary"
        >
          Terms
        </Link>

        <Link
          href={resolveLink(footer.cookiesLink)}
          className="transition-colors hover:text-primary"
        >
          Cookies
        </Link>
      </nav>
    </div>
  </div>
</footer>


);

}