import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/permissions";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = await getUserRole(user.id);
    if (role !== "instructor" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { status, grade, comment } = body as {
      status: "approved" | "rejected" | "revision_needed";
      grade?: number;
      comment?: string;
    };

    const { data: rawInstructor } = await supabase
      .from("instructors").select("id").eq("user_id", user.id).single();
    const instructorData = rawInstructor as { id: string } | null;
    if (!instructorData) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 403 });
    }

    const { data: rawSub, error: subError } = await supabase
      .from("assignment_submissions").select("id, assignment_id, user_id").eq("id", id).single();
    const submission = rawSub as { id: string; assignment_id: string; user_id: string } | null;
    if (subError || !submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const { data: rawAssignment } = await supabase
      .from("assignments").select("course_id").eq("id", submission.assignment_id).single();
    const assignment = rawAssignment as { course_id: string } | null;
    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const { data: rawCourse } = await supabase
      .from("courses").select("id").eq("id", assignment.course_id).eq("instructor_id", instructorData.id).single();
    const course = rawCourse as { id: string } | null;
    if (!course) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { error: updateError } = await supabase
      .from("assignment_submissions")
      // @ts-expect-error
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (grade !== undefined || comment) {
      const { error: feedbackError } = await supabase
        .from("assignment_feedback")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({ submission_id: id, instructor_id: user.id, score: grade ?? null, comment: comment ?? "" } as any);
      if (feedbackError) {
        return NextResponse.json({ error: feedbackError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
