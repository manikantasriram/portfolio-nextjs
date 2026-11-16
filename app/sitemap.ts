import type { MetadataRoute } from "next";
import { photography } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${site.url}${site.photo}`, `${site.url}${site.ogImage}`],
    },
    // one page per photo, opened from the "Off the Clock" sheet
    ...photography.photos.map((p) => ({
      url: `${site.url}/photos/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4,
      images: [`${site.url}/images/photos/full/${p.slug}.jpg`],
    })),
  ];
}
