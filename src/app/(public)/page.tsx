// This route group page is not used — homepage is served by app/page.tsx
// Kept to avoid conflicts; redirects are handled at the app/page.tsx level.
import { redirect } from "next/navigation";
export default function PublicGroupPage() {
  redirect("/");
}
