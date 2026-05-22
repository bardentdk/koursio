import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Bell,
  CheckCircle,
  ShoppingBag,
  Award,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeDate } from "@/lib/utils/format";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  order_confirmed: ShoppingBag,
  certificate_issued: Award,
  assignment_reviewed: BookOpen,
  message: MessageSquare,
  default: Bell,
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: rawNotifs } = await supabase
    .from("notifications")
    .select("id, type, title, message, is_read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  type Notif = {
    id: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
  };
  const notifs: Notif[] = (rawNotifs as unknown as Notif[] | null) ?? [];

  // Mark all as read (use any to bypass strict type inference on update)
  if (notifs.some((n) => !n.is_read)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("notifications") as any)
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-text-primary">Notifications</h1>
        <p className="text-text-secondary mt-1">
          {notifs.length} notification{notifs.length !== 1 ? "s" : ""}
        </p>
      </div>

      {notifs.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-10 h-10" />}
          title="Aucune notification"
          description="Vous serez notifié de vos achats, corrections et certificats ici."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {notifs.map((notif) => {
            const Icon = ICON_MAP[notif.type] ?? ICON_MAP.default;
            return (
              <div
                key={notif.id}
                className={`comic-card p-4 flex items-start gap-4 ${notif.is_read ? "bg-surface" : "bg-primary/5 border-primary/30"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.is_read ? "bg-surface-2" : "bg-primary/15"}`}
                >
                  <Icon
                    className={`w-5 h-5 ${notif.is_read ? "text-text-muted" : "text-primary"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-sm text-text-primary">
                      {notif.title}
                    </p>
                    {!notif.is_read && (
                      <Badge variant="primary" className="text-xs">
                        Nouveau
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">{notif.message}</p>
                  <p className="text-xs text-text-muted mt-1">
                    {formatRelativeDate(notif.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
