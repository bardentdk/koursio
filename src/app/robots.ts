import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://koursio.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/cours", "/cours/"],
        disallow: [
          "/dashboard",
          "/admin",
          "/formateur",
          "/api/",
          "/checkout",
          "/panier",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
