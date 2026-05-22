import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Receipt, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice, formatDate } from "@/lib/utils/format";

export default async function FacturesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, issued_at, status, total")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  type Invoice = {
    id: string;
    invoice_number: string;
    issued_at: string;
    status: string;
    total: number;
  };
  const invoiceList: Invoice[] =
    (invoices as unknown as Invoice[] | null) ?? [];

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-text-primary">Mes factures</h1>
        <p className="text-text-secondary mt-1">Historique de vos achats.</p>
      </div>

      {invoiceList.length === 0 ? (
        <EmptyState
          icon={<Receipt className="w-10 h-10" />}
          title="Aucune facture"
          description="Vos factures apparaîtront ici après votre premier achat."
          action={{ label: "Explorer les cours", href: "/cours" }}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {invoiceList.map((invoice) => (
            <div
              key={invoice.id}
              className="comic-card bg-surface p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="w-10 h-10 rounded-[10px] bg-success/10 flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-text-primary text-sm">
                    {invoice.invoice_number}
                  </span>
                  <Badge
                    variant={invoice.status === "paid" ? "success" : "warning"}
                  >
                    {invoice.status === "paid" ? "Payée" : "En attente"}
                  </Badge>
                </div>
                <p className="text-sm text-text-muted">
                  {formatDate(invoice.issued_at)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-text-primary text-lg">
                  {formatPrice(invoice.total)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
