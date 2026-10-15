// src/lib/storyblok.js
import Page from "@/components/Page";
import BlogPage from "@/components/BlogPage";
import BlogPost from "@/components/BlogPost";
import BrandsHub from "@/components/BrandsHub";
import BrandSection from "@/components/BrandSection";
import HomepageHero from "@/components/HomepageHero";
import StorySection from "@/components/StorySection";
import Marquee from "@/components/Marquee";
import PanelsSet from "@/components/PanelsSet";
import Blog from "@/components/BlogSection";
import Newsletter from "@/components/Newsletter";
import RichText from "@/components/RichText";
import Grid from "@/components/Grid";
import Column from "@/components/Column";
import HtmlBlock from "@/components/HTMLBlock";
import Tabs from "@/components/Tabs";
import TabItem from "@/components/TabItem";
import BuddiesSection from "@/components/BuddiesSection";
import BuddiesPage from "@/components/BuddiesPage";
import BuddiesCategoryLinks from "@/components/BuddiesCategoryLinks";
import SnuggleEndNote from "@/components/SnuggleEndNote";
import HeroStatement from "@/components/HeroStatement";
import BrandValues from "@/components/BrandVaues";
import PageIntro from "@/components/PageIntro";
import RetailerSection from "@/components/RetailerSection";
import RecycledMaterials from "@/components/RecycledMaterials";
import CollectionSpotlight from "@/components/CollectionSpotlight";
import CollectorVault from "@/components/CollectorsVault";
import BuildDreamDisplay from "@/components/BuildDreamDisplay";

import { apiPlugin, storyblokInit } from "@storyblok/react";

export const components = {
  page: Page,
  homepageHero: HomepageHero,
  storySection: StorySection,
  Marquee: Marquee,
  panelsSet: PanelsSet,
  blogSection: Blog,
  newsletter: Newsletter,
  RichText: RichText, 
  Grid: Grid,
  column: Column,
  htmlBlock: HtmlBlock,
  blogPage: BlogPage,
  blogPost: BlogPost,
  brandsHub: BrandsHub,
  brandSection: BrandSection,
  Tabs: Tabs,
  "Tab Item": TabItem,
  buddiesSection: BuddiesSection,
  buddiesPage: BuddiesPage,
  buddiesCategoryLinks: BuddiesCategoryLinks,
  snuggleEndNote: SnuggleEndNote,
  HeroStatement: HeroStatement,
  BrandValues: BrandValues,
  PageIntro: PageIntro,
  RetailerSection: RetailerSection,
  RecycledMaterials: RecycledMaterials,
  CollectionSpotlight: CollectionSpotlight,
  CollectorVault: CollectorVault,
  buildDreamDisplay: BuildDreamDisplay,
};

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_DELIVERY_API_TOKEN || process.env.STORYBLOK_DELIVERY_API_TOKEN,
  use: [apiPlugin],
  components,
  apiOptions: {
    region: "eu",
  },
});

export function resolveLink(link) {
  if (!link) return "/";

  if (link.linktype === "story") {
    return `/${link.cached_url}`;
  }

  return link.url || "/";
}

export async function getBuddies() {
  const storyblokApi = getStoryblokApi();

  const { data } = await storyblokApi.get("cdn/stories", {
    starts_with: "buddies/",
    version:
      process.env.NODE_ENV === "development"
        ? "draft"
        : "published",
  });

  return (data.stories || []).map((story) => {
    const content = story.content;
    const image = content.image;

    return {
      id: content.ID || content.id || story.slug,
      name: content.Name || content.name || story.name,
      category: content.category || "",
      image: image?.filename || "",
      line: content.tagline || "",
      description: content.description || "",
    };
  });
}