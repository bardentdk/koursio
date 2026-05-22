"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KoursioMark } from "@/components/illustrations/koursio-mark";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou mot de passe incorrect. Veuillez réessayer.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background rounded-[24px] border-2 border-border shadow-[0_8px_0_0_var(--border-strong)] p-8 flex flex-col gap-6"
      >
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <KoursioMark size={64} withSparks />
          </div>
          <h1 className="text-2xl font-black text-text-primary">
            Bon retour !
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Connectez-vous à votre espace Koursio
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3.5 rounded-[12px] bg-error/8 border border-error/20 text-error text-sm font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Form */}
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
          <div className="flex flex-col gap-1.5">
            <Input
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="hover:text-text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />
            <div className="flex justify-end">
              <Link
                href="/mot-de-passe-oublie"
                className="text-xs text-primary hover:underline font-semibold"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            size="lg"
            className="w-full mt-1"
            rightIcon={
              !loading ? <ArrowRight className="w-5 h-5" /> : undefined
            }
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px gradient-brand opacity-20" />
          <span className="text-xs text-text-muted font-medium px-2">ou</span>
          <div className="flex-1 h-px gradient-brand opacity-20" />
        </div>

        {/* Sign up */}
        <p className="text-center text-sm text-text-secondary">
          Pas encore de compte ?{" "}
          <Link
            href="/inscription"
            className="text-primary font-bold hover:underline inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Créer un compte gratuit
          </Link>
        </p>

        {/* Trust */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-border">
          <span className="flex items-center gap-1 text-[10px] text-text-muted font-medium">
            <Lock className="w-3 h-3" /> Sécurisé SSL
          </span>
          <span className="flex items-center gap-1 text-[10px] text-text-muted font-medium">
            <ShieldCheck className="w-3 h-3" /> Données FR
          </span>
          <span className="flex items-center gap-1 text-[10px] text-text-muted font-medium">
            <FileCheck className="w-3 h-3" /> RGPD
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md h-96 animate-pulse bg-surface rounded-[24px]" />
      }
    >
      <ConnexionForm />
    </Suspense>
  );
}
