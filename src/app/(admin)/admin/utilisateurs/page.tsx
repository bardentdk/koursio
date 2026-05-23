"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Shield, BookOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils/format";
import { toast } from "sonner";

const ROLE_LABELS: Record<
  string,
  { label: string; variant: "primary" | "success" | "warning" | "error" }
> = {
  admin: { label: "Admin", variant: "error" },
  instructor: { label: "Formateur", variant: "success" },
  student: { label: "Apprenant", variant: "primary" },
};

type User = {
  id: string;
  full_name?: string | null;
  email: string;
  avatar_url?: string | null;
  created_at: string;
  roles: string[];
  primary_role: string;
  enrollment_count: number;
};

export default function AdminUtilisateursPage() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleRoleChange = async (userId: string, role: string) => {
    setUpdatingId(userId);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, role }),
    });
    if (res.ok) {
      toast.success("Rôle mis à jour");
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                primary_role: role,
                roles: [...new Set([...u.roles, role])],
              }
            : u,
        ),
      );
    } else {
      toast.error("Impossible de mettre à jour le rôle");
    }
    setUpdatingId(null);
  };

  const filtered = users.filter((u) => {
    if (
      query &&
      !u.full_name?.toLowerCase().includes(query.toLowerCase()) &&
      !u.email.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    if (roleFilter && u.primary_role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="max-w-6xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">
            Utilisateurs
          </h1>
          <p className="text-text-secondary mt-1">
            {loading ? "Chargement..." : `${filtered.length} utilisateurs`}
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={load}
        >
          Actualiser
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Nom ou e-mail..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="w-64"
        />
        {["", "admin", "instructor", "student"].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${roleFilter === r ? "bg-primary text-white border-primary" : "bg-transparent border-border text-text-muted hover:border-primary hover:text-primary"}`}
          >
            {r === "" ? "Tous" : (ROLE_LABELS[r]?.label ?? r)}
          </button>
        ))}
      </div>

      <div className="comic-card bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-border">
              <tr className="text-left">
                <th className="px-4 py-3 font-bold text-text-secondary">
                  Utilisateur
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden sm:table-cell">
                  Rôle
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden md:table-cell">
                  Cours
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden lg:table-cell">
                  Inscrit le
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-4 py-3" colSpan={5}>
                      <div className="h-8 bg-surface-2 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-text-muted"
                  >
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
              {filtered.map((user, i) => {
                const roleInfo = ROLE_LABELS[user.primary_role];
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border hover:bg-surface-2 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={user.full_name ?? user.email}
                          src={user.avatar_url ?? undefined}
                          size="sm"
                        />
                        <div>
                          <p className="font-bold text-text-primary">
                            {user.full_name ?? "—"}
                          </p>
                          <p className="text-xs text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant={roleInfo?.variant ?? "outline"}>
                        {roleInfo?.label ?? user.primary_role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1 text-text-muted">
                        <BookOpen className="w-3.5 h-3.5" />
                        {user.enrollment_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden lg:table-cell">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {user.primary_role !== "admin" && (
                          <button
                            onClick={() => handleRoleChange(user.id, "admin")}
                            disabled={updatingId === user.id}
                            title="Promouvoir admin"
                            className="p-1.5 rounded-[6px] hover:bg-error/10 text-text-muted hover:text-error transition-colors disabled:opacity-50"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        )}
                        {user.primary_role !== "instructor" && (
                          <button
                            onClick={() =>
                              handleRoleChange(user.id, "instructor")
                            }
                            disabled={updatingId === user.id}
                            title="Promouvoir formateur"
                            className="p-1.5 rounded-[6px] hover:bg-success/10 text-text-muted hover:text-success transition-colors disabled:opacity-50 text-xs font-bold"
                          >
                            F
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
