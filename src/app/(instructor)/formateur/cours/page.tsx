import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Plus,
  Star,
  Users,
  BookOpen,
  Edit,
  Eye,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_COURSES } from "@/lib/data/mock-data";
import { formatPrice, formatNumber } from "@/lib/utils/format";

export default async function FormateurCoursPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const courses = MOCK_COURSES.slice(0, 3);

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Mes cours</h1>
          <p className="text-text-secondary mt-1">
            {courses.length} cours créés
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} asChild>
          <Link href="/formateur/cours/nouveau">Nouveau cours</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="comic-card bg-surface p-5 flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <h3 className="font-bold text-text-primary line-clamp-1 flex-1">
                  {course.title}
                </h3>
                <Badge
                  variant={
                    course.status === "published"
                      ? "success"
                      : course.status === "pending"
                        ? "warning"
                        : "outline"
                  }
                >
                  {course.status === "published"
                    ? "Publié"
                    : course.status === "pending"
                      ? "En attente"
                      : "Brouillon"}
                </Badge>
              </div>
              <p className="text-sm text-text-muted line-clamp-2 mb-3">
                {course.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-5 text-sm text-text-muted">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formatNumber(course.total_enrollments)} apprenants
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {course.rating.toFixed(1)} ({course.total_reviews} avis)
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {course.total_lessons} leçons
                </span>
                <span className="font-bold text-primary">
                  {formatPrice(course.price)}
                </span>
              </div>
            </div>
            <div className="flex sm:flex-col gap-2 justify-end shrink-0">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Edit className="w-3.5 h-3.5" />}
                asChild
              >
                <Link href={`/formateur/cours/${course.id}`}>Éditer</Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<BarChart3 className="w-3.5 h-3.5" />}
              >
                Stats
              </Button>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                asChild
              >
                <Link href={`/cours/${course.slug}`} target="_blank">
                  Voir
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
