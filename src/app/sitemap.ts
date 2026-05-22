import { MetadataRoute } from "next";
import { MOCK_COURSES, MOCK_CATEGORIES } from "@/lib/data/mock-data";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://koursio.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE}/cours`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE}/connexion`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE}/inscription`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE}/formateurs`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  const categoryRoutes = MOCK_CATEGORIES.filter((c) => c.is_active).map(
    (cat) => ({
      url: `${BASE}/cours?categorie=${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  const courseRoutes = MOCK_COURSES.filter((c) => c.status === "published").map(
    (course) => ({
      url: `${BASE}/cours/${course.slug}`,
      lastModified: new Date(course.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  return [...staticRoutes, ...categoryRoutes, ...courseRoutes];
}
