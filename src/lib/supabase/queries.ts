/**
 * Server-side Supabase query helpers.
 * Import ONLY in Server Components or API route handlers.
 */
import { createClient } from "@/lib/supabase/server";

// ─── Public queries (anon key + RLS) ────────────────────────────────────────

export async function getPublishedCourses(
  options: {
    featured?: boolean;
    bestseller?: boolean;
    isNew?: boolean;
    limit?: number;
    categorySlug?: string;
  } = {},
) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q = (supabase.from("courses") as any)
    .select(
      "id, title, slug, subtitle, price, original_price, thumbnail_url, rating, total_reviews, total_enrollments, level, duration_hours, total_lessons, is_featured, is_bestseller, is_new, has_certificate, has_assignments, status, currency, category_id, instructor_id, created_at, updated_at, published_at, instructor:profiles!instructor_id(id, full_name, avatar_url), category:categories(id, name, slug, color)",
    )
    .eq("status", "published");

  if (options.featured) q = q.eq("is_featured", true);
  if (options.bestseller) q = q.eq("is_bestseller", true);
  if (options.isNew) q = q.eq("is_new", true);
  if (options.limit) q = q.limit(options.limit);

  const { data } = await q.order("created_at", { ascending: false });
  return (data ?? []) as CourseRow[];
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from("courses") as any)
    .select(
      "*, instructor:profiles!instructor_id(id, full_name, avatar_url, bio), category:categories(id, name, slug, color)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data as CourseRow | null;
}

export async function getCategoriesWithCount() {
  const supabase = await createClient();

  const [{ data: categories }, { data: courseCounts }] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("order_index"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("courses") as any)
      .select("category_id")
      .eq("status", "published"),
  ]);

  const countMap: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (courseCounts ?? []).forEach((c: any) => {
    if (c.category_id)
      countMap[c.category_id] = (countMap[c.category_id] ?? 0) + 1;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (categories ?? []).map((cat: any) => ({
    ...cat,
    course_count: countMap[cat.id] ?? 0,
  })) as CategoryWithCount[];
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("order_index");
  return (data ?? []) as CategoryRow[];
}

export async function getFeaturedInstructors(limit = 4) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from("instructors") as any)
    .select(
      "id, rating, total_students, is_featured, specialties, profile:profiles!user_id(id, full_name, avatar_url, bio)",
    )
    .eq("is_featured", true)
    .order("total_students", { ascending: false })
    .limit(limit);
  return (data ?? []) as InstructorRow[];
}

export async function getCourseReviews(courseId: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from("reviews") as any)
    .select("*, user:profiles!user_id(id, full_name, avatar_url)")
    .eq("course_id", courseId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(10);
  return (data ?? []) as ReviewRow[];
}

export async function getCourseSections(courseId: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from("course_sections") as any)
    .select(
      "*, lessons:course_lessons(id, title, duration, is_free, order_index)",
    )
    .eq("course_id", courseId)
    .order("order_index");
  return (data ?? []) as SectionRow[];
}

export async function getRelatedCourses(
  categoryId: string,
  excludeId: string,
  limit = 4,
) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from("courses") as any)
    .select(
      "id, title, slug, subtitle, price, original_price, thumbnail_url, rating, total_reviews, total_enrollments, level, duration_hours, total_lessons, is_featured, is_bestseller, is_new, has_certificate, status, currency, instructor:profiles!instructor_id(id, full_name, avatar_url), category:categories(id, name, slug, color)",
    )
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .limit(limit);
  return (data ?? []) as CourseRow[];
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type CourseRow = {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  price: number;
  original_price?: number | null;
  thumbnail_url?: string | null;
  rating: number;
  total_reviews: number;
  total_enrollments: number;
  level: string;
  language?: string;
  duration_hours: number;
  total_lessons: number;
  total_modules?: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  has_certificate: boolean;
  has_assignments?: boolean;
  status: string;
  currency?: string;
  category_id?: string | null;
  instructor_id?: string;
  objectives?: string[] | null;
  requirements?: string[] | null;
  tags?: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at?: string;
  updated_at?: string;
  published_at?: string | null;
  instructor?: {
    id: string;
    full_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
  } | null;
  category?: {
    id: string;
    name: string;
    slug: string;
    color?: string | null;
  } | null;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  image_url?: string | null;
  parent_id?: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
};

export type CategoryWithCount = CategoryRow & { course_count: number };

export type InstructorRow = {
  id: string;
  rating: number;
  total_students: number;
  is_featured: boolean;
  specialties?: string[] | null;
  profile?: {
    id: string;
    full_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
  } | null;
};

export type ReviewRow = {
  id: string;
  rating: number;
  comment?: string | null;
  is_approved: boolean;
  created_at: string;
  user?: {
    id: string;
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
};

export type SectionRow = {
  id: string;
  title: string;
  order_index: number;
  lessons: {
    id: string;
    title: string;
    duration: number;
    is_free: boolean;
    order_index: number;
  }[];
};
