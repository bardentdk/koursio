import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/permissions";

type InstructorRow = { id: string };
type CourseRow = { id: string };
type AssignmentRow = { id: string; title: string; course_id: string };
type SubmissionRow = {
  id: string; assignment_id: string; user_id: string;
  content: string | null; file_urls: string[] | null;
  status: string; submitted_at: string; updated_at: string;
};
type ProfileRow = { id: string; full_name: string | null; email: string };
type CourseWithTitle = { id: string; title: string };

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole(user.id);
    if (role !== "instructor" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: rawInstructor } = await supabase
      .from("instructors").select("id").eq("user_id", user.id).single();
    const instructorData = rawInstructor as InstructorRow | null;
    if (!instructorData) return NextResponse.json({ submissions: [] });

    const { data: rawCourses } = await supabase
      .from("courses").select("id").eq("instructor_id", instructorData.id);
    const courses = (rawCourses ?? []) as CourseRow[];
    if (courses.length === 0) return NextResponse.json({ submissions: [] });

    const courseIds = courses.map((c) => c.id);

    const { data: rawAssignments } = await supabase
      .from("assignments").select("id, title, course_id").in("course_id", courseIds);
    const assignments = (rawAssignments ?? []) as AssignmentRow[];
    if (assignments.length === 0) return NextResponse.json({ submissions: [] });

    const assignmentIds = assignments.map((a) => a.id);

    const { data: rawSubmissions, error: submissionsError } = await supabase
      .from("assignment_submissions")
      .select("id, assignment_id, user_id, content, file_urls, status, submitted_at, updated_at")
      .in("assignment_id", assignmentIds)
      .order("submitted_at", { ascending: false });

    if (submissionsError) {
      return NextResponse.json({ error: submissionsError.message }, { status: 500 });
    }

    const submissions = (rawSubmissions ?? []) as SubmissionRow[];
    if (submissions.length === 0) return NextResponse.json({ submissions: [] });

    const studentIds = [...new Set(submissions.map((s) => s.user_id))];

    const { data: rawProfiles } = await supabase
      .from("profiles").select("id, full_name, email").in("id", studentIds);
    const profiles = (rawProfiles ?? []) as ProfileRow[];

    const { data: rawCoursesData } = await supabase
      .from("courses").select("id, title").in("id", courseIds);
    const coursesData = (rawCoursesData ?? []) as CourseWithTitle[];

    const enrichedSubmissions = submissions.map((sub) => {
      const assignment = assignments.find((a) => a.id === sub.assignment_id);
      const course = coursesData.find((c) => c.id === assignment?.course_id);
      const profile = profiles.find((p) => p.id === sub.user_id);
      return {
        id: sub.id,
        assignment_id: sub.assignment_id,
        student_id: sub.user_id,
        content: sub.content,
        files_urls: sub.file_urls,
        status: sub.status,
        submitted_at: sub.submitted_at,
        updated_at: sub.updated_at,
        assignment_title: assignment?.title ?? "",
        course_id: assignment?.course_id ?? "",
        course_title: course?.title ?? "",
        student_name: profile?.full_name ?? "",
        student_email: profile?.email ?? "",
      };
    });

    return NextResponse.json({ submissions: enrichedSubmissions });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
