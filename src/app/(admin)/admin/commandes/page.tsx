"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Download, Eye, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatPrice, formatDate } from "@/lib/utils/format";

const STATUS_MAP: Record<
  string,
  { label: string; variant: "success" | "warning" | "error" | "outline" }
> = {
  completed: { label: "Complétée", variant: "success" },
  pending: { label: "En attente", variant: "warning" },
  refunded: { label: "Remboursée", variant: "error" },
  failed: { label: "Échouée", variant: "error" },
};

type Order = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  coupon_code?: string | null;
  user?: { id: string; full_name?: string | null; email?: string } | null;
  order_items?: { course?: { title?: string | null } | null }[];
};

export default function AdminCommandesPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(load, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = orders.filter((o) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      o.user?.full_name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Commandes</h1>
          <p className="text-text-secondary mt-1">
            {loading ? "Chargement..." : `${filtered.length} commandes`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={load}
          >
            Actualiser
          </Button>
          <Button
            variant="outline"
            leftIcon={<Download className="w-4 h-4" />}
            disabled
          >
            Exporter CSV
          </Button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Client ou ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="max-w-xs"
        />
        {["", "completed", "pending", "refunded", "failed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${statusFilter === s ? "bg-primary text-white border-primary" : "bg-transparent border-border text-text-muted hover:border-primary hover:text-primary"}`}
          >
            {s === "" ? "Toutes" : (STATUS_MAP[s]?.label ?? s)}
          </button>
        ))}
      </div>

      <div className="comic-card bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-border">
              <tr className="text-left">
                <th className="px-4 py-3 font-bold text-text-secondary">ID</th>
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
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-4 py-3" colSpan={7}>
                      <div className="h-8 bg-surface-2 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-text-muted"
                  >
                    Aucune commande
                  </td>
                </tr>
              )}
              {filtered.map((order, i) => {
                const statusInfo = STATUS_MAP[order.status];
                const courseNames = (order.order_items ?? [])
                  .map((oi) => oi.course?.title)
                  .filter(Boolean)
                  .join(", ");
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
                        {order.id.slice(0, 8).toUpperCase()}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          name={
                            order.user?.full_name ??
                            order.user?.email ??
                            "Client"
                          }
                          size="xs"
                        />
                        <div>
                          <p className="font-medium text-text-primary text-xs">
                            {order.user?.full_name ?? "—"}
                          </p>
                          <p className="text-text-muted text-xs hidden sm:block">
                            {order.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden md:table-cell">
                      <span className="text-xs">
                        {courseNames
                          ? courseNames.slice(0, 40) +
                            (courseNames.length > 40 ? "..." : "")
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-text-primary">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden sm:table-cell text-xs">
                      {formatDate(order.created_at)}
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
