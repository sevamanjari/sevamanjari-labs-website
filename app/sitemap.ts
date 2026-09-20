import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sevamanjarilabs.in";
  return ["", "/about", "/services", "/products", "/careers", "/contact", "/privacy", "/terms"].map(path => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));
}