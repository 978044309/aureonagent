import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://johnnyhuang958.github.io/founderai/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}
