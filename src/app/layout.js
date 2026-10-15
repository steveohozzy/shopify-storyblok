
import { Plus_Jakarta_Sans, Quicksand } from 'next/font/google';
import "./globals.css";

import {
  getStoryblokApi,
} from "@/lib/storyblok";

import Header from "@/components/Header";
import { getBuddies } from "@/lib/storyblok";
import { getProductCategories } from "@/lib/shopify";
import Footer from "@/components/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-heading',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

export const metadata = {
  title: "Snuggle Buddies",
  description: "Test with Storyblok",
};

export default async function RootLayout({ children }) {
  const storyblokApi = getStoryblokApi();

  const { data } = await storyblokApi.get(
    "cdn/stories/globals/header",
    {
      version: "draft",
    }
  );

  const buddies = await getBuddies();
  const categories = await getProductCategories();

  const header =
    data?.story?.content?.body?.find(
      (blok) => blok.component === "HeaderSettings"
    ) || {};

  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${quicksand.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background">
        <Header
          blok={header}
          buddies={buddies}
          categories={categories}
        />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
