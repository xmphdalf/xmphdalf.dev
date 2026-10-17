import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// Keep the API out of search, but let crawlers fetch uploaded files (profile
// photo, résumé PDF), served from /api/media/file/. The admin isn't blocked
// here on purpose: it sends a noindex tag, which crawlers only see if they
// are allowed to fetch the page.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/media/file/"],
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
