import type { Database } from "./database";

export type { Database };

// Extracted row types for convenience
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Role = Database["public"]["Tables"]["roles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type CourseSection =
  Database["public"]["Tables"]["course_sections"]["Row"];
export type CourseLesson =
  Database["public"]["Tables"]["course_lessons"]["Row"];
export type CourseAsset = Database["public"]["Tables"]["course_assets"]["Row"];
export type CourseEnrollment =
  Database["public"]["Tables"]["course_enrollments"]["Row"];
export type CourseProgress =
  Database["public"]["Tables"]["course_progress"]["Row"];
export type LessonProgress =
  Database["public"]["Tables"]["lesson_progress"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type Coupon = Database["public"]["Tables"]["coupons"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Certificate = Database["public"]["Tables"]["certificates"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type Instructor = Database["public"]["Tables"]["instructors"]["Row"];
export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
export type AssignmentSubmission =
  Database["public"]["Tables"]["assignment_submissions"]["Row"];
export type AssignmentFeedback =
  Database["public"]["Tables"]["assignment_feedback"]["Row"];
export type Quiz = Database["public"]["Tables"]["quizzes"]["Row"];
export type QuizQuestion =
  Database["public"]["Tables"]["quiz_questions"]["Row"];
export type QuizAnswer = Database["public"]["Tables"]["quiz_answers"]["Row"];
export type QuizAttempt = Database["public"]["Tables"]["quiz_attempts"]["Row"];
export type PromoPopup = Database["public"]["Tables"]["promo_popups"]["Row"];
export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];
export type ThemeSetting =
  Database["public"]["Tables"]["theme_settings"]["Row"];
export type PageSection = Database["public"]["Tables"]["page_sections"]["Row"];

// Enriched types
export type CourseWithInstructor = Course & {
  instructor: Profile & { instructor_profile: Instructor | null };
  category: Category | null;
};

export type CourseWithDetails = CourseWithInstructor & {
  sections: (CourseSection & { lessons: CourseLesson[] })[];
  reviews: (Review & { user: Profile })[];
};

export type CartItem = {
  id: string;
  course: Course & { instructor: Profile };
};

export type UserRole = "admin" | "instructor" | "student";

export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
};
