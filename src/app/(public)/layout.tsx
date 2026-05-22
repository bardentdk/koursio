import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

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
