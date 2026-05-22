import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Read pathname injected by proxy
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "/";

  // Commerce pages use public layout (Navbar + Footer), no sidebar
  const isCommercePage =
    pathname === "/panier" || pathname.startsWith("/checkout");

  if (isCommercePage) {
    return (
      <>
        <Navbar
          user={
            user
              ? {
                  id: user.id,
                  email: user.email ?? "",
                  name: user.user_metadata?.full_name,
                  role: user.user_metadata?.role,
                }
              : null
          }
        />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </>
    );
  }

  // Dashboard layout with sidebar
  return (
    <div className="min-h-screen bg-surface flex">
      {user && <DashboardSidebar user={user} />}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader user={user ?? undefined} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
