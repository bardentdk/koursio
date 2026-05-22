"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatPrice, formatDate } from "@/lib/utils/format";

const MOCK_ORDERS = [
  {
    id: "ord-1",
    ref: "CMD-2025-001",
    user: { name: "Thomas Rousseau", email: "thomas.r@example.com" },
    courses: ["Next.js 15 Complet"],
    total: 49,
    status: "completed",
    date: "2025-01-15T10:23:00Z",
  },
  {
    id: "ord-2",
    ref: "CMD-2025-002",
    user: { name: "Camille Martin", email: "camille.m@example.com" },
    courses: ["SEO Masterclass 2025", "Prise de Parole en Public"],
    total: 73,
    status: "completed",
    date: "2025-01-16T14:45:00Z",
  },
  {
    id: "ord-3",
    ref: "CMD-2025-003",
    user: { name: "Julien Petit", email: "julien.p@example.com" },
    courses: ["UI/UX Design avec Figma"],
    total: 44,
    status: "pending",
    date: "2025-01-18T09:12:00Z",
  },
  {
    id: "ord-4",
    ref: "CMD-2025-004",
    user: { name: "Anaïs Lambert", email: "anais.l@example.com" },
    courses: ["React JS Avancé"],
    total: 59,
    status: "refunded",
    date: "2025-01-20T11:30:00Z",
  },
  {
    id: "ord-5",
    ref: "CMD-2025-005",
    user: { name: "Marc Dupont", email: "marc.d@example.com" },
    courses: ["Cybersécurité — Ethical Hacking"],
    total: 69,
    status: "completed",
    date: "2025-01-22T16:00:00Z",
  },
];

const STATUS_MAP: Record<
  string,
  { label: string; variant: "success" | "warning" | "error" | "outline" }
> = {
  completed: { label: "Complétée", variant: "success" },
  pending: { label: "En attente", variant: "warning" },
  refunded: { label: "Remboursée", variant: "error" },
  failed: { label: "Échouée", variant: "error" },
};

export default function AdminCommandesPage() {
  const [query, setQuery] = useState("");
  const orders = MOCK_ORDERS.filter(
    (o) =>
      !query ||
      o.ref.toLowerCase().includes(query.toLowerCase()) ||
      o.user.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="max-w-6xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Commandes</h1>
          <p className="text-text-secondary mt-1">
            {MOCK_ORDERS.length} commandes
          </p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
          Exporter CSV
        </Button>
      </div>

      <Input
        placeholder="Référence ou client..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leftIcon={<Search className="w-4 h-4" />}
        className="max-w-xs"
      />

      <div className="comic-card bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-border">
              <tr className="text-left">
                <th className="px-4 py-3 font-bold text-text-secondary">
                  Référence
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary">
                  Client
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden md:table-cell">
                  Cours
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary">
                  Total
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden sm:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary">
                  Statut
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => {
                const statusInfo = STATUS_MAP[order.status];
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-border hover:bg-surface-2 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <code className="font-bold text-primary text-xs">
                        {order.ref}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={order.user.name} size="xs" />
                        <div>
                          <p className="font-medium text-text-primary text-xs">
                            {order.user.name}
                          </p>
                          <p className="text-text-muted text-xs hidden sm:block">
                            {order.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden md:table-cell">
                      <span className="text-xs">
                        {order.courses.join(", ").slice(0, 40)}
                        {order.courses.join(", ").length > 40 ? "..." : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-text-primary">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden sm:table-cell text-xs">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusInfo?.variant ?? "outline"}>
                        {statusInfo?.label ?? order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-primary transition-colors">
                          <Eye className="w-4 h-4" />
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
