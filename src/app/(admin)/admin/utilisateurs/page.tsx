"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, Shield, BookOpen, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils/format";

const MOCK_USERS = [
  {
    id: "u1",
    name: "Thomas Rousseau",
    email: "thomas.r@example.com",
    role: "student",
    courses: 3,
    joined: "2024-11-15T00:00:00Z",
    avatar: null,
  },
  {
    id: "u2",
    name: "Camille Martin",
    email: "camille.m@example.com",
    role: "student",
    courses: 2,
    joined: "2025-01-02T00:00:00Z",
    avatar: null,
  },
  {
    id: "u3",
    name: "Alexandre Martin",
    email: "alexandre.martin@example.com",
    role: "instructor",
    courses: 3,
    joined: "2023-01-15T00:00:00Z",
    avatar: null,
  },
  {
    id: "u4",
    name: "Sophie Leblanc",
    email: "sophie.leblanc@example.com",
    role: "instructor",
    courses: 2,
    joined: "2023-03-20T00:00:00Z",
    avatar: null,
  },
  {
    id: "u5",
    name: "Admin Koursio",
    email: "admin@Koursio.fr",
    role: "admin",
    courses: 0,
    joined: "2023-01-01T00:00:00Z",
    avatar: null,
  },
  {
    id: "u6",
    name: "Julien Petit",
    email: "julien.p@example.com",
    role: "student",
    courses: 1,
    joined: "2025-02-14T00:00:00Z",
    avatar: null,
  },
];

const ROLE_LABELS: Record<
  string,
  { label: string; variant: "primary" | "success" | "warning" | "error" }
> = {
  admin: { label: "Admin", variant: "error" },
  instructor: { label: "Formateur", variant: "success" },
  student: { label: "Apprenant", variant: "primary" },
};

export default function AdminUtilisateursPage() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const users = MOCK_USERS.filter((u) => {
    if (
      query &&
      !u.name.toLowerCase().includes(query.toLowerCase()) &&
      !u.email.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    if (roleFilter && u.role !== roleFilter) return false;
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
            {MOCK_USERS.length} utilisateurs au total
          </p>
        </div>
        <Button leftIcon={<UserPlus className="w-4 h-4" />}>
          Inviter un utilisateur
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
            {r === "" ? "Tous" : ROLE_LABELS[r]?.label}
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
              {users.map((user, i) => {
                const roleInfo = ROLE_LABELS[user.role];
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
                        <Avatar name={user.name} size="sm" />
                        <div>
                          <p className="font-bold text-text-primary">
                            {user.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant={roleInfo?.variant ?? "outline"}>
                        {roleInfo?.label ?? user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1 text-text-muted">
                        <BookOpen className="w-3.5 h-3.5" />
                        {user.courses}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden lg:table-cell">
                      {formatDate(user.joined)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-primary transition-colors">
                          <Shield className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
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
