export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      roles: {
        Row: {
          id: string;
          name: "admin" | "instructor" | "student";
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["roles"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["roles"]["Insert"]>;
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role_id: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_roles"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["user_roles"]["Insert"]>;
      };
      instructors: {
        Row: {
          id: string;
          user_id: string;
          bio: string | null;
          specialties: string[] | null;
          website: string | null;
          social_links: Json | null;
          rating: number;
          total_students: number;
          is_featured: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["instructors"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["instructors"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          image_url: string | null;
          parent_id: string | null;
          order_index: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["categories"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          subtitle: string | null;
          description: string | null;
          instructor_id: string;
          category_id: string | null;
          price: number;
          original_price: number | null;
          currency: string;
          level: "beginner" | "intermediate" | "advanced" | "all";
          language: string;
          thumbnail_url: string | null;
          preview_video_url: string | null;
          duration_hours: number;
          total_lessons: number;
          total_modules: number;
          has_certificate: boolean;
          has_assignments: boolean;
          objectives: string[] | null;
          requirements: string[] | null;
          tags: string[] | null;
          status: "draft" | "pending" | "published" | "archived";
          is_featured: boolean;
          is_bestseller: boolean;
          is_new: boolean;
          rating: number;
          total_reviews: number;
          total_enrollments: number;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["courses"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
      };
      course_sections: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          order_index: number;
          is_free: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["course_sections"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["course_sections"]["Insert"]
        >;
      };
      course_lessons: {
        Row: {
          id: string;
          section_id: string;
          course_id: string;
          title: string;
          description: string | null;
          video_url: string | null;
          video_duration: number | null;
          order_index: number;
          is_free: boolean;
          has_quiz: boolean;
          has_assignment: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["course_lessons"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["course_lessons"]["Insert"]
        >;
      };
      course_assets: {
        Row: {
          id: string;
          lesson_id: string;
          course_id: string;
          name: string;
          file_url: string;
          file_type: string;
          file_size: number | null;
          is_downloadable: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["course_assets"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["course_assets"]["Insert"]
        >;
      };
      course_enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          order_id: string | null;
          enrolled_at: string;
          expires_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["course_enrollments"]["Row"],
          "id" | "enrolled_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["course_enrollments"]["Insert"]
        >;
      };
      course_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          completion_percentage: number;
          last_lesson_id: string | null;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["course_progress"]["Row"],
          "id" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["course_progress"]["Insert"]
        >;
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          course_id: string;
          is_completed: boolean;
          watch_time: number;
          completed_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["lesson_progress"]["Row"],
          "id"
        >;
        Update: Partial<
          Database["public"]["Tables"]["lesson_progress"]["Insert"]
        >;
      };
      carts: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["carts"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["carts"]["Insert"]>;
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          course_id: string;
          added_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["cart_items"]["Row"],
          "id" | "added_at"
        >;
        Update: Partial<Database["public"]["Tables"]["cart_items"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: "pending" | "completed" | "refunded" | "failed";
          subtotal: number;
          discount: number;
          total: number;
          currency: string;
          coupon_id: string | null;
          payment_method: string | null;
          payment_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["orders"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          course_id: string;
          price: number;
          original_price: number | null;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          order_id: string;
          user_id: string;
          status: "paid" | "pending" | "cancelled";
          subtotal: number;
          discount: number;
          total: number;
          tax: number;
          billing_details: Json | null;
          pdf_url: string | null;
          issued_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["invoices"]["Row"],
          "id" | "issued_at"
        >;
        Update: Partial<Database["public"]["Tables"]["invoices"]["Insert"]>;
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          type: "percentage" | "fixed";
          value: number;
          min_purchase: number | null;
          max_uses: number | null;
          max_uses_per_user: number | null;
          current_uses: number;
          applicable_courses: string[] | null;
          applicable_categories: string[] | null;
          starts_at: string | null;
          expires_at: string | null;
          is_active: boolean;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["coupons"]["Row"],
          "id" | "created_at" | "current_uses"
        >;
        Update: Partial<Database["public"]["Tables"]["coupons"]["Insert"]>;
      };
      coupon_redemptions: {
        Row: {
          id: string;
          coupon_id: string;
          user_id: string;
          order_id: string;
          redeemed_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["coupon_redemptions"]["Row"],
          "id" | "redeemed_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["coupon_redemptions"]["Insert"]
        >;
      };
      reviews: {
        Row: {
          id: string;
          course_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["reviews"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          added_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["wishlists"]["Row"],
          "id" | "added_at"
        >;
        Update: Partial<Database["public"]["Tables"]["wishlists"]["Insert"]>;
      };
      quizzes: {
        Row: {
          id: string;
          lesson_id: string;
          course_id: string;
          title: string;
          passing_score: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["quizzes"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["quizzes"]["Insert"]>;
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question: string;
          type: "single" | "multiple";
          order_index: number;
          explanation: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["quiz_questions"]["Row"],
          "id"
        >;
        Update: Partial<
          Database["public"]["Tables"]["quiz_questions"]["Insert"]
        >;
      };
      quiz_answers: {
        Row: {
          id: string;
          question_id: string;
          answer: string;
          is_correct: boolean;
          order_index: number;
        };
        Insert: Omit<Database["public"]["Tables"]["quiz_answers"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["quiz_answers"]["Insert"]>;
      };
      quiz_attempts: {
        Row: {
          id: string;
          quiz_id: string;
          user_id: string;
          score: number;
          passed: boolean;
          answers: Json;
          attempted_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["quiz_attempts"]["Row"],
          "id" | "attempted_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["quiz_attempts"]["Insert"]
        >;
      };
      assignments: {
        Row: {
          id: string;
          lesson_id: string;
          course_id: string;
          title: string;
          description: string;
          instructions: string | null;
          max_score: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["assignments"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["assignments"]["Insert"]>;
      };
      assignment_submissions: {
        Row: {
          id: string;
          assignment_id: string;
          user_id: string;
          content: string | null;
          file_urls: string[] | null;
          status:
            | "pending"
            | "reviewed"
            | "approved"
            | "rejected"
            | "revision_needed";
          submitted_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["assignment_submissions"]["Row"],
          "id" | "submitted_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["assignment_submissions"]["Insert"]
        >;
      };
      assignment_feedback: {
        Row: {
          id: string;
          submission_id: string;
          instructor_id: string;
          score: number | null;
          comment: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["assignment_feedback"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["assignment_feedback"]["Insert"]
        >;
      };
      certificates: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          certificate_url: string | null;
          issued_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["certificates"]["Row"],
          "id" | "issued_at"
        >;
        Update: Partial<Database["public"]["Tables"]["certificates"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["notifications"]["Row"],
          "id" | "created_at" | "is_read"
        >;
        Update: Partial<
          Omit<
            Database["public"]["Tables"]["notifications"]["Row"],
            "id" | "created_at"
          >
        >;
      };
      site_settings: {
        Row: { id: string; key: string; value: Json; updated_at: string };
        Insert: Omit<
          Database["public"]["Tables"]["site_settings"]["Row"],
          "id" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["site_settings"]["Insert"]
        >;
      };
      theme_settings: {
        Row: {
          id: string;
          primary_color: string;
          secondary_from: string;
          secondary_to: string;
          font_family: string;
          border_radius: string;
          dark_mode_default: boolean;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["theme_settings"]["Row"],
          "id" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["theme_settings"]["Insert"]
        >;
      };
      page_sections: {
        Row: {
          id: string;
          page: string;
          section_key: string;
          title: string | null;
          content: Json;
          is_active: boolean;
          order_index: number;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["page_sections"]["Row"],
          "id" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["page_sections"]["Insert"]
        >;
      };
      promo_popups: {
        Row: {
          id: string;
          title: string;
          text: string;
          image_url: string | null;
          color: string | null;
          coupon_code: string | null;
          target_pages: string[] | null;
          frequency: "once" | "always" | "daily";
          starts_at: string | null;
          ends_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["promo_popups"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["promo_popups"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["audit_logs"]["Row"],
          "id" | "created_at"
        >;
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
