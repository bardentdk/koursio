import { createClient } from "@/lib/supabase/server";
import { Receipt, Download, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatPrice, formatDate } from "@/lib/utils/format";

export default async function AdminFacturesPage() {
  const supabase = await createClient();

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, profiles!inner(full_name, email, avatar_url) ")
    .order("issued_at", { ascending: false })
    .limit(50);

  const MOCK_INVOICES_FALLBACK = [
    {
      id: "i1",
      invoice_number: "FAC-202501-A3X",
      issued_at: "2025-01-15T10:23:00Z",
      status: "paid",
      total: 49,
      profiles: {
        full_name: "Thomas Rousseau",
        email: "thomas.r@example.com",
        avatar_url: null,
      },
    },
    {
      id: "i2",
      invoice_number: "FAC-202501-B7K",
      issued_at: "2025-01-16T14:45:00Z",
      status: "paid",
      total: 73,
      profiles: {
        full_name: "Camille Martin",
        email: "camille.m@example.com",
        avatar_url: null,
      },
    },
    {
      id: "i3",
      invoice_number: "FAC-202501-C9M",
      issued_at: "2025-01-18T09:12:00Z",
      status: "pending",
      total: 44,
      profiles: {
        full_name: "Julien Petit",
        email: "julien.p@example.com",
        avatar_url: null,
      },
    },
  ];

  const invoiceList = (invoices && invoices.length > 0
    ? invoices
    : MOCK_INVOICES_FALLBACK) as unknown as Array<{
    id: string;
    invoice_number: string;
    issued_at: string;
    status: string;
    total: number;
    profiles: { full_name: string; email: string; avatar_url: string | null };
  }>;

  const totalRevenue = invoiceList
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="max-w-6xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Factures</h1>
          <p className="text-text-secondary mt-1">
            {invoiceList.length} factures · Total {formatPrice(totalRevenue)}
          </p>
        </div>
        <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
          Exporter CSV
        </Button>
      </div>

      <div className="comic-card bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b-2 border-border">
              <tr className="text-left">
                <th className="px-4 py-3 font-bold text-text-secondary">
                  Numéro
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary">
                  Client
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary hidden sm:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 font-bold text-text-secondary">
                  Montant
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
              {invoiceList.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border hover:bg-surface-2 transition-colors"
                >
                  <td className="px-4 py-3">
                    <code className="font-bold text-primary text-xs">
                      {invoice.invoice_number}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={invoice.profiles.full_name}
                        src={invoice.profiles.avatar_url}
                        size="xs"
                      />
                      <div>
                        <p className="font-medium text-text-primary text-xs">
                          {invoice.profiles.full_name}
                        </p>
                        <p className="text-text-muted text-xs hidden sm:block">
                          {invoice.profiles.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted text-xs hidden sm:table-cell">
                    {formatDate(invoice.issued_at)}
                  </td>
                  <td className="px-4 py-3 font-black text-text-primary">
                    {formatPrice(invoice.total)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        invoice.status === "paid"
                          ? "success"
                          : invoice.status === "cancelled"
                            ? "error"
                            : "warning"
                      }
                    >
                      {invoice.status === "paid"
                        ? "Payée"
                        : invoice.status === "cancelled"
                          ? "Annulée"
                          : "En attente"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-primary transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
