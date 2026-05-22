import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) redirect("/connexion");
  return user;
}

export async function getUserRole(userId: string): Promise<string> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) return "student";

  const roleId = (data as { role_id: string }).role_id;

  const { data: role } = await supabase
    .from("roles")
    .select("*")
    .eq("id", roleId)
    .single();

  if (!role) return "student";
  return (role as { name: string }).name ?? "student";
}

export async function requireRole(role: "admin" | "instructor") {
  const user = await requireAuth();
  const userRole = await getUserRole(user.id);
  if (userRole !== role && userRole !== "admin") {
    redirect("/dashboard");
  }
  return user;
}

export async function requireAdmin() {
  return requireRole("admin");
}

export async function requireInstructor() {
  const user = await requireAuth();
  const userRole = await getUserRole(user.id);
  if (userRole !== "instructor" && userRole !== "admin") {
    redirect("/dashboard");
  }
  return user;
}

export async function checkCourseAccess(
  userId: string,
  courseId: string,
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();
  return !!data;
}
