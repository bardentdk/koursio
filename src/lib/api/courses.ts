import { createClient } from "@/lib/supabase/server";
import {
  MOCK_COURSES,
  MOCK_CATEGORIES,
  MOCK_INSTRUCTORS,
} from "@/lib/data/mock-data";
import type { Course, Category } from "@/types";

export interface CourseFilters {
  query?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: "popular" | "newest" | "price_asc" | "price_desc" | "rating";
  page?: number;
  limit?: number;
}

export interface CourseWithInstructor extends Course {
  instructor: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  category: Pick<Category, "id" | "name" | "slug" | "color"> | null;
}

// Try Supabase first, fall back to mock data
export async function getCourses(filters: CourseFilters = {}): Promise<{
  courses: CourseWithInstructor[];
  total: number;
}> {
  const {
    query,
    category,
    level,
    minPrice,
    maxPrice,
    minRating,
    sort = "popular",
    page = 1,
    limit = 12,
  } = filters;

  try {
    const supabase = await createClient();

    let q = supabase
      .from("courses")
      .select(
        "*, instructor:profiles!instructor_id(id, full_name, avatar_url), category:categories(id, name, slug, color) ",
        { count: "exact" },
      )
      .eq("status", "published");

    if (query) q = q.ilike("title", `%${query}%`);
    if (category) q = q.eq("categories.slug", category);
    if (level) q = q.eq("level", level);
    if (minPrice !== undefined) q = q.gte("price", minPrice);
    if (maxPrice !== undefined) q = q.lte("price", maxPrice);
    if (minRating !== undefined) q = q.gte("rating", minRating);

    switch (sort) {
      case "newest":
        q = q.order("published_at", { ascending: false });
        break;
      case "price_asc":
        q = q.order("price", { ascending: true });
        break;
      case "price_desc":
        q = q.order("price", { ascending: false });
        break;
      case "rating":
        q = q.order("rating", { ascending: false });
        break;
      default:
        q = q.order("total_enrollments", { ascending: false });
    }

    const from = (page - 1) * limit;
    q = q.range(from, from + limit - 1);

    const { data, count, error } = await q;
    if (error) throw error;
    if (data && data.length > 0) {
      return {
        courses: data as unknown as CourseWithInstructor[],
        total: count ?? 0,
      };
    }
  } catch {
    // Fall through to mock data
  }

  // Mock data fallback
  let courses = MOCK_COURSES.map((c) => {
    const instructor = MOCK_INSTRUCTORS.find((i) => i.id === c.instructor_id);
    const cat = MOCK_CATEGORIES.find((cat) => cat.id === c.category_id);
    return {
      ...c,
      instructor: {
        id: instructor?.id ?? "",
        full_name: instructor?.full_name ?? null,
        avatar_url: instructor?.avatar_url ?? null,
      },
      category: cat
        ? { id: cat.id, name: cat.name, slug: cat.slug, color: cat.color }
        : null,
    };
  });

  if (query)
    courses = courses.filter((c) =>
      c.title.toLowerCase().includes(query.toLowerCase()),
    );
  if (category) courses = courses.filter((c) => c.category?.slug === category);
  if (level) courses = courses.filter((c) => c.level === level);
  if (minPrice !== undefined)
    courses = courses.filter((c) => c.price >= minPrice);
  if (maxPrice !== undefined)
    courses = courses.filter((c) => c.price <= maxPrice);
  if (minRating !== undefined)
    courses = courses.filter((c) => c.rating >= minRating);

  switch (sort) {
    case "newest":
      courses.sort((a, b) =>
        (b.published_at ?? "").localeCompare(a.published_at ?? ""),
      );
      break;
    case "price_asc":
      courses.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      courses.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      courses.sort((a, b) => b.rating - a.rating);
      break;
    default:
      courses.sort((a, b) => b.total_enrollments - a.total_enrollments);
  }

  const total = courses.length;
  const from = (page - 1) * limit;
  return {
    courses: courses.slice(from, from + limit) as CourseWithInstructor[],
    total,
  };
}

export async function getCourseBySlug(
  slug: string,
): Promise<CourseWithInstructor | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select(
        "*, instructor:profiles!instructor_id(id, full_name, avatar_url, bio), category:categories(id, name, slug, color) ",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    if (!error && data) return data as unknown as CourseWithInstructor;
  } catch {}

  const course = MOCK_COURSES.find((c) => c.slug === slug);
  if (!course) return null;
  const instructor = MOCK_INSTRUCTORS.find(
    (i) => i.id === course.instructor_id,
  );
  const cat = MOCK_CATEGORIES.find((c) => c.id === course.category_id);
  return {
    ...course,
    instructor: {
      id: instructor?.id ?? "",
      full_name: instructor?.full_name ?? null,
      avatar_url: instructor?.avatar_url ?? null,
    },
    category: cat
      ? { id: cat.id, name: cat.name, slug: cat.slug, color: cat.color }
      : null,
  };
}
