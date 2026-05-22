import { createClient } from "@/lib/supabase/server";
import { Star, Users, BookOpen, Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MOCK_INSTRUCTORS } from "@/lib/data/mock-data";
import { formatNumber } from "@/lib/utils/format";

export default async function AdminFormateursPage() {
  const supabase = await createClient();
  const { data: dbInstructors } = await supabase
    .from("instructors")
    .select("*, profiles(full_name, email, avatar_url) ")
    .order("total_students", { ascending: false });

  type InstructorDisplay = {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    rating: number;
    students: number;
    is_featured: boolean;
    specialties: string[];
  };
  const instructors: InstructorDisplay[] = MOCK_INSTRUCTORS.map((i) => ({
    id: i.id,
    name: i.full_name ?? "Formateur",
    email: i.email,
    avatar: i.avatar_url,
    rating: i.instructor_profile.rating,
    students: i.instructor_profile.total_students,
    is_featured: i.instructor_profile.is_featured,
    specialties: i.instructor_profile.specialties ?? [],
  }));

  return (
    <div className="max-w-5xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Formateurs</h1>
          <p className="text-text-secondary mt-1">
            {instructors.length} formateurs actifs
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Inviter un formateur
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {instructors.map((instructor) => (
          <div key={instructor.id} className="comic-card bg-surface p-5">
            <div className="flex items-start gap-4">
              <Avatar
                name={instructor.name}
                src={instructor.avatar}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-text-primary">
                    {instructor.name}
                  </h3>
                  {instructor.is_featured && (
                    <Badge variant="primary">En vedette</Badge>
                  )}
                </div>
                <p className="text-xs text-text-muted mb-2">
                  {instructor.email}
                </p>
                <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {instructor.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {formatNumber(instructor.students)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {instructor.specialties.slice(0, 3).map((s: string) => (
                    <span
                      key={s}
                      className="text-xs px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={instructor.is_featured ? "outline" : "primary"}
                    leftIcon={
                      instructor.is_featured ? (
                        <X className="w-3.5 h-3.5" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )
                    }
                  >
                    {instructor.is_featured
                      ? "Retirer vedette"
                      : "Mettre en vedette"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
