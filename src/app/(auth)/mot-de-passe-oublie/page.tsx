"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/reinitialisation`,
      },
    );

    if (resetError) {
      setError("Une erreur est survenue. Vérifiez votre adresse e-mail.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
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
            E-mail envoyé !
          </h2>
          <p className="text-text-secondary">
            Vérifiez votre boîte e-mail à <strong>{email}</strong> et cliquez
            sur le lien pour réinitialiser votre mot de passe.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/connexion" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Retour à la connexion
            </Link>
          </Button>
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
          <div className="w-16 h-16 rounded-[16px] bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl"></span>
          </div>
          <h1 className="text-2xl font-black text-text-primary">
            Mot de passe oublié ?
          </h1>
          <p className="text-text-secondary mt-1">
            Entrez votre e-mail pour recevoir un lien de réinitialisation
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-[10px] bg-error/10 border-2 border-error/30 text-error text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Adresse e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <Button type="submit" loading={loading} size="lg" className="w-full">
            Envoyer le lien
          </Button>
        </form>

        <Link
          href="/connexion"
          className="flex items-center justify-center gap-1 text-sm text-text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la connexion
        </Link>
      </div>
    </motion.div>
  );
}
