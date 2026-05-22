"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  GripVertical,
  Trash2,
  Edit,
  ChevronDown,
  Play,
  Save,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { MOCK_COURSES } from "@/lib/data/mock-data";
import Link from "next/link";
import { toast } from "sonner";

type Lesson = { id: string; title: string; duration: number; is_free: boolean };
type Section = { id: string; title: string; lessons: Lesson[]; open: boolean };

const MOCK_SECTIONS: Section[] = [
  {
    id: "s1",
    title: "Introduction",
    open: true,
    lessons: [
      {
        id: "l1",
        title: "Présentation du cours",
        duration: 320,
        is_free: true,
      },
      { id: "l2", title: "Installation", duration: 540, is_free: true },
    ],
  },
  {
    id: "s2",
    title: "Les fondamentaux",
    open: false,
    lessons: [
      { id: "l3", title: "Concepts de base", duration: 680, is_free: false },
    ],
  },
];

export default function EditCoursPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState(
    MOCK_COURSES.find((c) => c.id === id) ?? MOCK_COURSES[0],
  );
  const [sections, setSections] = useState<Section[]>(MOCK_SECTIONS);
  const [saving, setSaving] = useState(false);
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const toggleSection = (id: string) =>
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, open: !s.open } : s)),
    );

  const addSection = () => {
    if (!newSectionTitle) return;
    setSections((prev) => [
      ...prev,
      { id: `s${Date.now()}`, title: newSectionTitle, open: true, lessons: [] },
    ]);
    setNewSectionTitle("");
    setAddingSection(false);
  };

  const addLesson = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lessons: [
                ...s.lessons,
                {
                  id: `l${Date.now()}`,
                  title: "Nouvelle leçon",
                  duration: 0,
                  is_free: false,
                },
              ],
            }
          : s,
      ),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Cours mis à jour !");
    setSaving(false);
  };

  return (
    <div className="max-w-4xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          asChild
        >
          <Link href="/formateur/cours">Retour</Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-text-primary truncate">
            {course.title}
          </h1>
        </div>
        <Badge variant={course.status === "published" ? "success" : "warning"}>
          {course.status === "published" ? "Publié" : "Brouillon"}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Eye className="w-4 h-4" />}
          asChild
        >
          <Link href={`/cours/${course.slug}`} target="_blank">
            Voir
          </Link>
        </Button>
        <Button
          loading={saving}
          size="sm"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSave}
        >
          Sauvegarder
        </Button>
      </div>

      {/* Programme / Curriculum */}
      <div className="comic-card bg-surface p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-text-primary text-lg">
            Programme du cours
          </h2>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setAddingSection(true)}
          >
            Ajouter un module
          </Button>
        </div>

        {/* Add section form */}
        {addingSection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4"
          >
            <div className="flex gap-2">
              <Input
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Titre du module..."
                className="flex-1"
              />
              <Button size="sm" onClick={addSection}>
                Ajouter
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAddingSection(false)}
              >
                Annuler
              </Button>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col gap-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="border-2 border-border rounded-[12px] overflow-hidden"
            >
              {/* Section header */}
              <div className="flex items-center gap-3 p-3 bg-surface-2">
                <GripVertical className="w-4 h-4 text-text-muted cursor-grab" />
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex-1 flex items-center gap-2 text-left"
                >
                  <ChevronDown
                    className={`w-4 h-4 text-text-muted transition-transform ${section.open ? "rotate-180" : ""}`}
                  />
                  <span className="font-bold text-sm text-text-primary">
                    {section.title}
                  </span>
                  <span className="text-xs text-text-muted">
                    ({section.lessons.length} leçons)
                  </span>
                </button>
                <button className="p-1 hover:bg-surface-2 rounded text-text-muted hover:text-primary transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-surface-2 rounded text-text-muted hover:text-error transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Lessons */}
              {section.open && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 px-4 py-2.5 border-t border-border hover:bg-surface-2 transition-colors"
                    >
                      <GripVertical className="w-4 h-4 text-text-muted cursor-grab" />
                      <Play className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-text-primary flex-1">
                        {lesson.title}
                      </span>
                      {lesson.is_free && (
                        <Badge variant="success" className="text-xs">
                          Gratuit
                        </Badge>
                      )}
                      <span className="text-xs text-text-muted">
                        {Math.round(lesson.duration / 60)}min
                      </span>
                      <button className="p-1 hover:bg-surface rounded text-text-muted hover:text-primary">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 hover:bg-surface rounded text-text-muted hover:text-error">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="px-4 py-2 border-t border-dashed border-border">
                    <button
                      onClick={() => addLesson(section.id)}
                      className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Ajouter une leçon
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
