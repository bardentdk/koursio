"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { KoursioMark } from "@/components/illustrations/koursio-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function InscriptionPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(
        authError.message === "User already registered"
          ? "Cet email est déjà utilisé. Essayez de vous connecter."
          : "Une erreur est survenue. Veuillez réessayer.",
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
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
            Vérifiez vos emails !
          </h2>
          <p className="text-text-secondary">
            Un lien de confirmation a été envoyé à <strong>{email}</strong>.
            Cliquez dessus pour activer votre compte.
          </p>
          <Button asChild className="w-full">
            <Link href="/connexion">Aller à la connexion</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  const passwordStrength =
    password.length === 0
      ? 0
      : password.length < 6
        ? 1
        : password.length < 10
          ? 2
          : 3;
  const strengthColors = ["bg-border", "bg-error", "bg-warning", "bg-success"];
  const strengthLabels = ["", "Faible", "Moyen", "Fort"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="comic-card bg-background p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <KoursioMark size={64} withSparks />
          </div>
          <h1 className="text-2xl font-black text-text-primary">
            Créer un compte
          </h1>
          <p className="text-text-secondary mt-1">
            Rejoignez 48 000+ apprenants sur Koursio
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-[10px] bg-error/10 border-2 border-error/30 text-error text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nom complet"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jean Dupont"
            required
            leftIcon={<User className="w-4 h-4" />}
          />
          <Input
            label="Adresse e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <div>
            <Input
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${i <= passwordStrength ? strengthColors[passwordStrength] : "bg-border"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {strengthLabels[passwordStrength]}
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-text-muted">
            En créant un compte, vous acceptez nos{""}
            <Link href="/conditions" className="text-primary hover:underline">
              conditions d&apos;utilisation
            </Link>
            {""}et notre{""}
            <Link
              href="/confidentialite"
              className="text-primary hover:underline"
            >
              politique de confidentialité
            </Link>
            .
          </p>

          <Button type="submit" loading={loading} size="lg" className="w-full">
            Créer mon compte gratuitement
          </Button>
        </form>

        {/* Sign in link */}
        <p className="text-center text-sm text-text-secondary">
          Déjà un compte ?{""}
          <Link
            href="/connexion"
            className="text-primary font-bold hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
