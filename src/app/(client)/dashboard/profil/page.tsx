"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
  } | null>(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/connexion");
        return;
      }
      setUser({
        id: data.user.id,
        email: data.user.email ?? "",
        full_name: data.user.user_metadata?.full_name ?? "",
        avatar_url: data.user.user_metadata?.avatar_url ?? "",
      });
      setFullName(data.user.user_metadata?.full_name ?? "");
    });
  }, [router]);

  const handleSaveProfile = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    if (error) toast.error("Erreur lors de la sauvegarde");
    else toast.success("Profil mis à jour !");
    setLoading(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error("Le mot de passe doit faire 8 caractères minimum");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error("Erreur lors du changement de mot de passe");
    else {
      toast.success("Mot de passe mis à jour !");
      setNewPassword("");
      setOldPassword("");
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-text-primary">Mon profil</h1>
        <p className="text-text-secondary mt-1">
          Gérez vos informations personnelles et votre mot de passe.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Avatar section */}
        <div className="comic-card bg-surface p-6 flex items-center gap-5">
          <Avatar
            name={fullName || user.email}
            src={user.avatar_url}
            size="xl"
          />
          <div>
            <h3 className="font-bold text-text-primary">
              {fullName || "Votre nom"}
            </h3>
            <p className="text-sm text-text-muted">{user.email}</p>
            <Button size="sm" variant="outline" className="mt-2">
              Changer la photo
            </Button>
          </div>
        </div>

        {/* Personal info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="comic-card bg-surface p-6 flex flex-col gap-5"
        >
          <h2 className="font-black text-text-primary text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Informations personnelles
          </h2>
          <Input
            label="Nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jean Dupont"
          />
          <div>
            <label className="text-sm font-semibold text-text-primary mb-1.5 block">
              Adresse e-mail
            </label>
            <div className="flex items-center h-11 px-4 bg-surface-2 border-2 border-border rounded-[10px] text-sm text-text-muted">
              <Mail className="w-4 h-4 mr-2" /> {user.email}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-text-primary mb-1.5 block">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Parlez-nous de vous..."
              className="w-full bg-surface border-2 border-border rounded-[10px] px-4 py-3 text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <Button
            loading={loading}
            onClick={handleSaveProfile}
            leftIcon={<Save className="w-4 h-4" />}
            className="self-start"
          >
            Sauvegarder
          </Button>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="comic-card bg-surface p-6 flex flex-col gap-5"
        >
          <h2 className="font-black text-text-primary text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" /> Changer le mot de passe
          </h2>
          <Input
            label="Nouveau mot de passe"
            type={showPwd ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="8 caractères minimum"
            rightIcon={
              <button type="button" onClick={() => setShowPwd((s) => !s)}>
                {showPwd ? (
                  <EyeOff className="w-4 h-4 text-text-muted" />
                ) : (
                  <Eye className="w-4 h-4 text-text-muted" />
                )}
              </button>
            }
          />
          <Button
            loading={loading}
            onClick={handleChangePassword}
            variant="outline"
            className="self-start"
          >
            Mettre à jour
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
