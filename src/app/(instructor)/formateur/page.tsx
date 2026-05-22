import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  BookOpen,
  Users,
  Star,
  TrendingUp,
  Plus,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MOCK_COURSES, MOCK_INSTRUCTORS } from "@/lib/data/mock-data";
import { formatPrice, formatNumber } from "@/lib/utils/format";

export default async function FormateurDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const name = user.user_metadata?.full_name ?? "Formateur";
  // For demo, show first instructor's courses
  const instructorCourses = MOCK_COURSES.slice(0, 3);

  const PENDING_TPS = [
    {
      id: "tp1",
      student: "Thomas R.",
      course: "Next.js 15 Complet",
      submitted: "Il y a 2h",
    },
    {
      id: "tp2",
      student: "Camille M.",
      course: "Next.js 15 Complet",
      submitted: "Il y a 5h",
    },
  ];

  return (
    <div className="max-w-5xl flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">
            Bonjour, {name.split("")[0]}
          </h1>
          <p className="text-text-secondary mt-1">
            Gérez vos cours et suivez vos apprenants.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} asChild>
          <Link href="/formateur/cours/nouveau">Nouveau cours</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Cours actifs"
          value={instructorCourses.length.toString()}
          icon={<BookOpen className="w-5 h-5" />}
          accentColor="#00674F"
        />
        <StatCard
          label="Apprenants"
          value="12 450"
          icon={<Users className="w-5 h-5" />}
          accentColor="#7c3aed"
          trend={{ value: 8, label: "ce mois" }}
        />
        <StatCard
          label="Note moy."
          value="4.8"
          icon={<Star className="w-5 h-5" />}
          accentColor="#fbbf24"
        />
        <StatCard
          label="TP en attente"
          value={PENDING_TPS.length.toString()}
          icon={<ClipboardList className="w-5 h-5" />}
          accentColor="#f84904"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* My courses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-text-primary">Mes cours</h2>
            <Link
              href="/formateur/cours"
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {instructorCourses.map((course) => (
              <Link
                key={course.id}
                href={`/formateur/cours/${course.id}`}
                className="block"
              >
                <div className="comic-card bg-background p-4 flex flex-col gap-2 hover:border-primary transition-all group">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <Badge
                      variant={
                        course.status === "published" ? "success" : "warning"
                      }
                      className="shrink-0 text-xs"
                    >
                      {course.status === "published" ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {formatNumber(course.total_enrollments)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {course.rating.toFixed(1)}
                    </span>
                    <span className="ml-auto font-bold text-primary">
                      {formatPrice(course.price)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Pending TPs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-text-primary">
              TP à corriger
            </h2>
            <Link
              href="/formateur/tp"
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {PENDING_TPS.map((tp) => (
              <div
                key={tp.id}
                className="comic-card bg-background p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-[10px] bg-warning/15 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-text-primary">
                    {tp.student}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {tp.course}
                  </p>
                  <p className="text-xs text-text-muted">{tp.submitted}</p>
                </div>
                <Button size="sm" asChild>
                  <Link href="/formateur/tp">Corriger</Link>
                </Button>
              </div>
            ))}
            {PENDING_TPS.length === 0 && (
              <p className="text-center text-text-muted py-8 text-sm">
                Aucun TP en attente
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
