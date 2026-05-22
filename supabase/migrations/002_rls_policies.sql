-- =============================================
-- MyLMS — Row Level Security Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_popups ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION is_instructor()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name IN ('instructor', 'admin')
  );
$$;

CREATE OR REPLACE FUNCTION is_enrolled(p_course_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM course_enrollments
    WHERE user_id = auth.uid() AND course_id = p_course_id
  );
$$;

-- =============================================
-- PROFILES POLICIES
-- =============================================

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Public profiles visible" ON profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage profiles" ON profiles
  FOR ALL USING (is_admin());

-- =============================================
-- ROLES POLICIES
-- =============================================

CREATE POLICY "Roles are publicly readable" ON roles
  FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can manage roles" ON roles
  FOR ALL USING (is_admin());

-- =============================================
-- USER_ROLES POLICIES
-- =============================================

CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles" ON user_roles
  FOR ALL USING (is_admin());

-- =============================================
-- INSTRUCTORS POLICIES
-- =============================================

CREATE POLICY "Instructors are publicly readable" ON instructors
  FOR SELECT USING (TRUE);

CREATE POLICY "Instructors can update own profile" ON instructors
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage instructors" ON instructors
  FOR ALL USING (is_admin());

-- =============================================
-- CATEGORIES POLICIES
-- =============================================

CREATE POLICY "Categories are publicly readable" ON categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (is_admin());

-- =============================================
-- COURSES POLICIES
-- =============================================

CREATE POLICY "Published courses are publicly readable" ON courses
  FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can view own courses" ON courses
  FOR SELECT USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can create courses" ON courses
  FOR INSERT WITH CHECK (instructor_id = auth.uid() AND is_instructor());

CREATE POLICY "Instructors can update own courses" ON courses
  FOR UPDATE USING (instructor_id = auth.uid() AND is_instructor());

CREATE POLICY "Admins can manage all courses" ON courses
  FOR ALL USING (is_admin());

-- =============================================
-- COURSE_SECTIONS POLICIES
-- =============================================

CREATE POLICY "Sections of published courses are readable" ON course_sections
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND status = 'published')
  );

CREATE POLICY "Instructors can manage own course sections" ON course_sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "Admins can manage all sections" ON course_sections
  FOR ALL USING (is_admin());

-- =============================================
-- COURSE_LESSONS POLICIES
-- =============================================

CREATE POLICY "Free lessons are publicly readable" ON course_lessons
  FOR SELECT USING (
    is_free = TRUE OR
    is_enrolled(course_id) OR
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "Instructors can manage own lessons" ON course_lessons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "Admins can manage all lessons" ON course_lessons
  FOR ALL USING (is_admin());

-- =============================================
-- COURSE_ASSETS POLICIES
-- =============================================

CREATE POLICY "Assets accessible to enrolled users" ON course_assets
  FOR SELECT USING (
    is_enrolled(course_id) OR
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "Instructors can manage own assets" ON course_assets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
  );

-- =============================================
-- ENROLLMENTS POLICIES
-- =============================================

CREATE POLICY "Users can view own enrollments" ON course_enrollments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Instructors can view enrollments of own courses" ON course_enrollments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "System can insert enrollments" ON course_enrollments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage enrollments" ON course_enrollments
  FOR ALL USING (is_admin());

-- =============================================
-- PROGRESS POLICIES
-- =============================================

CREATE POLICY "Users can manage own progress" ON course_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Instructors can view progress of own courses" ON course_progress
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "Users can manage own lesson progress" ON lesson_progress
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- CART POLICIES
-- =============================================

CREATE POLICY "Users can manage own cart" ON carts
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own cart items" ON cart_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM carts WHERE id = cart_id AND user_id = auth.uid())
  );

-- =============================================
-- ORDERS POLICIES
-- =============================================

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all orders" ON orders
  FOR ALL USING (is_admin());

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
  );

-- =============================================
-- INVOICES POLICIES
-- =============================================

CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all invoices" ON invoices
  FOR ALL USING (is_admin());

-- =============================================
-- COUPONS POLICIES
-- =============================================

CREATE POLICY "Active coupons are readable" ON coupons
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage coupons" ON coupons
  FOR ALL USING (is_admin());

CREATE POLICY "Users can view own redemptions" ON coupon_redemptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all redemptions" ON coupon_redemptions
  FOR ALL USING (is_admin());

-- =============================================
-- REVIEWS POLICIES
-- =============================================

CREATE POLICY "Approved reviews are publicly readable" ON reviews
  FOR SELECT USING (is_approved = TRUE);

CREATE POLICY "Users can view own reviews" ON reviews
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Enrolled users can submit reviews" ON reviews
  FOR INSERT WITH CHECK (user_id = auth.uid() AND is_enrolled(course_id));

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage reviews" ON reviews
  FOR ALL USING (is_admin());

-- =============================================
-- WISHLISTS POLICIES
-- =============================================

CREATE POLICY "Users can manage own wishlist" ON wishlists
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- QUIZZES POLICIES
-- =============================================

CREATE POLICY "Enrolled users can view quizzes" ON quizzes
  FOR SELECT USING (is_enrolled(course_id));

CREATE POLICY "Instructors can manage own quizzes" ON quizzes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "Enrolled users can view questions" ON quiz_questions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM quizzes q WHERE q.id = quiz_id AND is_enrolled(q.course_id))
  );

CREATE POLICY "Enrolled users can view answers" ON quiz_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quiz_questions qq
      JOIN quizzes q ON q.id = qq.quiz_id
      WHERE qq.id = question_id AND is_enrolled(q.course_id)
    )
  );

CREATE POLICY "Users can manage own quiz attempts" ON quiz_attempts
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- ASSIGNMENTS POLICIES
-- =============================================

CREATE POLICY "Enrolled users can view assignments" ON assignments
  FOR SELECT USING (is_enrolled(course_id));

CREATE POLICY "Instructors can manage own assignments" ON assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
  );

CREATE POLICY "Users can manage own submissions" ON assignment_submissions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Instructors can view submissions of own courses" ON assignment_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN courses c ON c.id = a.course_id
      WHERE a.id = assignment_id AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can manage feedback" ON assignment_feedback
  FOR ALL USING (instructor_id = auth.uid());

CREATE POLICY "Students can view own feedback" ON assignment_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assignment_submissions s
      WHERE s.id = submission_id AND s.user_id = auth.uid()
    )
  );

-- =============================================
-- CERTIFICATES POLICIES
-- =============================================

CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Certificates are publicly readable by ID" ON certificates
  FOR SELECT USING (TRUE);

-- =============================================
-- NOTIFICATIONS POLICIES
-- =============================================

CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications" ON notifications
  FOR ALL USING (is_admin());

-- =============================================
-- SITE SETTINGS POLICIES
-- =============================================

CREATE POLICY "Site settings are publicly readable" ON site_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (is_admin());

CREATE POLICY "Theme settings are publicly readable" ON theme_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage theme settings" ON theme_settings
  FOR ALL USING (is_admin());

CREATE POLICY "Page sections are publicly readable" ON page_sections
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage page sections" ON page_sections
  FOR ALL USING (is_admin());

CREATE POLICY "Active promo popups are readable" ON promo_popups
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage promo popups" ON promo_popups
  FOR ALL USING (is_admin());

CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (is_admin());

CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (TRUE);
