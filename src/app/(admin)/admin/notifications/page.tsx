"use client";

import { useState } from "react";
import { Bell, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const NOTIFICATION_TYPES = [
  { value: "message", label: "Message général" },
  { value: "promo", label: "Promotion / Offre" },
  { value: "new_course", label: "Nouveau cours disponible" },
  { value: "system", label: "Notification système" },
];

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("message");
  const [target, setTarget] = useState("all");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!title || !message) {
      toast.error("Remplissez le titre et le message");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success(
      `Notification envoyée à ${target === "all" ? "tous les utilisateurs" : "les utilisateurs sélectionnés"} !`,
    );
    setTitle("");
    setMessage("");
    setSending(false);
  };

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-text-primary">Notifications</h1>
        <p className="text-text-secondary mt-1">
          Envoyez des notifications à vos utilisateurs.
        </p>
      </div>

      <div className="comic-card bg-surface p-6 flex flex-col gap-5">
        <h2 className="font-bold text-text-primary text-lg flex items-center gap-2">
          <Send className="w-5 h-5 text-primary" /> Envoyer une notification
        </h2>

        <div>
          <label className="text-sm font-bold text-text-primary mb-1.5 block">
            Destinataires
          </label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full h-11 bg-surface border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
          >
            <option value="all">Tous les utilisateurs ({">"}48 000)</option>
            <option value="enrolled">Apprenants avec cours actifs</option>
            <option value="inactive">Utilisateurs inactifs (30+ jours)</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-text-primary mb-1.5 block">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full h-11 bg-surface border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
          >
            {NOTIFICATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Titre de la notification"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder=" Nouvelle offre disponible !"
        />

        <div>
          <label className="text-sm font-bold text-text-primary mb-1.5 block">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Profitez de -50% sur tous nos cours jusqu'à dimanche minuit..."
            className="w-full bg-surface border-2 border-border rounded-[10px] px-4 py-3 text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="flex gap-3">
          <Button
            loading={sending}
            onClick={handleSend}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Envoyer la notification
          </Button>
        </div>
      </div>

      {/* Recent notifications sent */}
      <div className="comic-card bg-surface p-6">
        <h2 className="font-bold text-text-primary mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" /> Envois récents
        </h2>
        <div className="flex flex-col gap-3">
          {[
            {
              title: " Bienvenue sur Koursio !",
              type: "system",
              sent_to: "Tous",
              date: "Il y a 2 jours",
              count: 48640,
            },
            {
              title: "Code promo FLASH70 disponible",
              type: "promo",
              sent_to: "Tous",
              date: "Il y a 5 jours",
              count: 48640,
            },
          ].map((n, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3 border-b border-border last:border-0"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-text-primary">
                  {n.title}
                </p>
                <p className="text-xs text-text-muted flex items-center gap-1">
                  <Users className="w-3 h-3" />{" "}
                  {n.count.toLocaleString("fr-FR")} destinataires · {n.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
