import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/permissions";
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const role = await getUserRole(user.id);
  if (role !== "instructor" && role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-surface flex">
      <InstructorSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
