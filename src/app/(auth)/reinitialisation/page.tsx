"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KoursioMark } from "@/components/illustrations/koursio-mark";
import { createClient } from "@/lib/supabase/client";

export default function ReinitalisationPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Supabase sends the user here with a hash — process the session
    const supabase = createClient();
    supabase.auth.getSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(
        "Impossible de mettre à jour le mot de passe. Le lien a peut-être expiré.",
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="comic-card bg-background p-8 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-[16px] bg-success/10 border-2 border-success/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-black text-text-primary">
            Mot de passe mis à jour !
          </h2>
          <p className="text-text-secondary">
            Redirection vers votre tableau de bord...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="comic-card bg-background p-8 flex flex-col gap-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <KoursioMark size={56} />
          </div>
          <h1 className="text-2xl font-black text-text-primary">
            Nouveau mot de passe
          </h1>
          <p className="text-text-secondary mt-1">
            Choisissez un mot de passe sécurisé
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-[10px] bg-error/10 border-2 border-error/30 text-error text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nouveau mot de passe"
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            required
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="text-text-muted hover:text-text-primary"
              >
                {showPwd ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />
          <Input
            label="Confirmer le mot de passe"
            type={showPwd ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Répétez le mot de passe"
            required
            leftIcon={<Lock className="w-4 h-4" />}
            error={
              confirm && confirm !== password
                ? "Les mots de passe ne correspondent pas"
                : undefined
            }
          />
          <Button type="submit" loading={loading} size="lg" className="w-full">
            Mettre à jour
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
