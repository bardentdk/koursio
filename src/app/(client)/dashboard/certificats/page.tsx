import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Award, Download, ExternalLink, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { MOCK_COURSES } from "@/lib/data/mock-data";
import { formatDate } from "@/lib/utils/format";

export default async function CertificatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: rawCerts } = await supabase
    .from("certificates")
    .select("id, course_id, issued_at, certificate_url")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  type CertRow = {
    id: string;
    course_id: string;
    issued_at: string;
    certificate_url: string | null;
  };
  const certs: CertRow[] = (rawCerts as unknown as CertRow[] | null) ?? [];

  const certWithCourse = certs.map((cert) => {
    const course = MOCK_COURSES.find((c) => c.id === cert.course_id);
    return { ...cert, course };
  });

  return (
    <div className="max-w-4xl flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black text-text-primary">
          Mes certificats
        </h1>
        <p className="text-text-secondary mt-1">
          {certWithCourse.length} certificat
          {certWithCourse.length !== 1 ? "s" : ""} obtenu
          {certWithCourse.length !== 1 ? "s" : ""}
        </p>
      </div>

      {certWithCourse.length === 0 ? (
        <>
          <EmptyState
            icon={<Award className="w-10 h-10" />}
            title="Aucun certificat pour l'instant"
            description="Terminez un cours à 100% pour obtenir votre certificat de complétion."
            action={{ label: "Voir mes cours", href: "/dashboard/mes-cours" }}
          />
          <div className="comic-card bg-primary/5 border-primary/20 p-5 flex gap-3">
            <div className="w-10 h-10 rounded-[12px] gradient-brand-subtle border border-primary/20 flex items-center justify-center shrink-0 text-xl"></div>
            <div>
              <h3 className="font-bold text-text-primary mb-1">
                Comment obtenir un certificat ?
              </h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li> Complétez toutes les leçons d'un cours (100%)</li>
                <li> Certains cours requièrent de valider le quiz final</li>
                <li>Certains cours requièrent un TP validé par le formateur</li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {certWithCourse.map((cert) => (
            <div
              key={cert.id}
              className="comic-card bg-background p-6 flex flex-col gap-4"
            >
              {/* Certificate header */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-[14px] gradient-brand flex items-center justify-center text-2xl shadow-[0_3px_0_0_#c93800]"></div>
                <Badge variant="certified">Certifié</Badge>
              </div>

              {/* Course title */}
              <div>
                <h3 className="font-black text-text-primary mb-1">
                  {cert.course?.title ?? "Cours terminé"}
                </h3>
                <p className="text-sm text-text-muted">
                  Délivré le {formatDate(cert.issued_at)}
                </p>
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-3 border-t border-border">
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  className="flex-1"
                >
                  Télécharger
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Partager
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
