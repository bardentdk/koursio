"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Menu,
  X,
  FileText,
  MessageSquare,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";
import type { Course } from "@/types";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  is_free: boolean;
  is_completed: boolean;
  video_url: string | null;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface LessonPlayerProps {
  course: Course;
  sections: Section[];
  initialLessonId?: string;
  userId: string;
}

function formatSeconds(s: number) {
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${m % 60}min` : `${m}min`;
}

function VideoPlayer({
  videoUrl,
  lessonTitle,
}: {
  videoUrl: string | null;
  lessonTitle: string;
}) {
  if (!videoUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/40">
        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
          <Play className="w-10 h-10 fill-white/30 ml-1" />
        </div>
        <p className="text-sm">Vidéo disponible après connexion Supabase Storage</p>
      </div>
    );
  }

  // YouTube
  if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
    const videoId = videoUrl.includes("youtu.be")
      ? videoUrl.split("youtu.be/")[1]?.split("?")[0]
      : new URL(videoUrl).searchParams.get("v");
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title={lessonTitle}
      />
    );
  }

  // Vimeo
  if (videoUrl.includes("vimeo.com")) {
    const videoId = videoUrl.split("vimeo.com/")[1]?.split("?")[0];
    return (
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
        className="w-full h-full"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture"
        title={lessonTitle}
      />
    );
  }

  // Direct URL (Supabase Storage or other)
  return (
    <video
      key={videoUrl}
      src={videoUrl}
      controls
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      className="w-full h-full"
      playsInline
    >
      Votre navigateur ne supporte pas la vidéo HTML5.
    </video>
  );
}

export function LessonPlayer({
  course,
  sections,
  initialLessonId,
  userId,
}: LessonPlayerProps) {
  const allLessons = sections.flatMap((s) => s.lessons);
  const [currentLessonId, setCurrentLessonId] = useState(
    initialLessonId ?? allLessons[0]?.id,
  );
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(allLessons.filter((l) => l.is_completed).map((l) => l.id)),
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id)),
  );
  const [activeTab, setActiveTab] = useState<"content" | "notes" | "qa">(
    "content",
  );
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const currentLesson = allLessons.find((l) => l.id === currentLessonId);
  const currentIdx = allLessons.findIndex((l) => l.id === currentLessonId);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
  const completionPct =
    allLessons.length > 0
      ? Math.round((completedIds.size / allLessons.length) * 100)
      : 0;

  const markCompleted = useCallback(
    async (lessonId: string) => {
      setCompletedIds((prev) => new Set([...prev, lessonId]));
      // Save to Supabase
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            courseId: course.id,
            completed: true,
          }),
        });
      } catch {}
    },
    [course.id],
  );

  const handleComplete = async () => {
    if (!currentLesson) return;
    await markCompleted(currentLesson.id);
    if (nextLesson) {
      setCurrentLessonId(nextLesson.id);
    } else {
      toast.success(" Cours terminé ! Votre certificat est disponible.", {
        duration: 5000,
      });
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="h-full flex bg-[#0f172a] text-white overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10 shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 rounded-[8px] hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/50 truncate">{course.title}</p>
            <p className="text-sm font-bold truncate">{currentLesson?.title}</p>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Progress value={completionPct} size="sm" className="w-28" />
            <span className="text-xs font-bold text-white/70">
              {completionPct}%
            </span>
          </div>
          {completionPct === 100 && (
            <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-400">
              <Award className="w-4 h-4" /> Certifié
            </span>
          )}
        </div>

        {/* Video area */}
        <div className="relative bg-black aspect-video max-h-[60vh] w-full shrink-0">
          <VideoPlayer
            videoUrl={currentLesson?.video_url ?? null}
            lessonTitle={currentLesson?.title ?? ""}
          />
        </div>

        {/* Tabs + actions */}
        <div className="flex-1 flex flex-col overflow-hidden border-t border-white/10">
          {/* Tab bar */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-white/10 shrink-0">
            {[
              { id: "content", label: "Contenu", icon: FileText },
              { id: "notes", label: "Notes perso", icon: FileText },
              { id: "qa", label: "Q&A", icon: MessageSquare },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-colors",
                  activeTab === id
                    ? "bg-white/15 text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/8",
                )}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white/60 hover:text-white border-white/20 hover:border-white/40"
                onClick={() => prevLesson && setCurrentLessonId(prevLesson.id)}
                disabled={!prevLesson}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Préc.
              </Button>
              {currentLesson && !completedIds.has(currentLesson.id) ? (
                <Button
                  size="sm"
                  onClick={handleComplete}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Terminer
                </Button>
              ) : nextLesson ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentLessonId(nextLesson.id)}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Suivant
                </Button>
              ) : (
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  <Award className="w-4 h-4" /> Terminé !
                </span>
              )}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "content" && (
              <div>
                <h2 className="font-bold text-lg mb-2">
                  {currentLesson?.title}
                </h2>
                <p className="text-white/60 text-sm">
                  {currentLesson ? formatSeconds(currentLesson.duration) : ""} ·
                  Leçon {currentIdx + 1}/{allLessons.length}
                </p>
              </div>
            )}
            {activeTab === "notes" && (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-white/50">
                  Notes personnelles pour cette leçon
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Prenez vos notes ici..."
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-[10px] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 resize-none"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="self-start"
                  onClick={() => {
                    setSavingNotes(true);
                    setTimeout(() => {
                      setSavingNotes(false);
                      toast.success("Notes sauvegardées");
                    }, 500);
                  }}
                  loading={savingNotes}
                >
                  Sauvegarder
                </Button>
              </div>
            )}
            {activeTab === "qa" && (
              <div className="text-center py-8 text-white/40">
                <MessageSquare className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm">Section Q&A disponible prochainement</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-l border-white/10 flex flex-col overflow-hidden shrink-0 bg-[#1e293b]"
          >
            <div className="p-3 border-b border-white/10 flex items-center justify-between shrink-0">
              <span className="font-bold text-sm">Programme</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-white/10 rounded-[6px] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sections.map((section) => {
                const sectionDone = section.lessons.filter((l) =>
                  completedIds.has(l.id),
                ).length;
                const isExpanded = expandedSections.has(section.id);
                return (
                  <div key={section.id} className="border-b border-white/10">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-3 hover:bg-white/5 transition-colors text-left"
                    >
                      <div>
                        <p className="text-xs font-bold text-white/90">
                          {section.title}
                        </p>
                        <p className="text-[11px] text-white/40">
                          {sectionDone}/{section.lessons.length}
                        </p>
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-white/40 shrink-0 transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          {section.lessons.map((lesson) => {
                            const isActive = lesson.id === currentLessonId;
                            const isDone = completedIds.has(lesson.id);
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => setCurrentLessonId(lesson.id)}
                                className={cn(
                                  "w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs transition-colors",
                                  isActive
                                    ? "bg-primary/20 border-l-2 border-primary"
                                    : "hover:bg-white/5 border-l-2 border-transparent",
                                )}
                              >
                                {isDone ? (
                                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-white/30 shrink-0" />
                                )}
                                <span
                                  className={cn(
                                    "flex-1 truncate",
                                    isActive
                                      ? "font-bold text-white"
                                      : "text-white/60",
                                  )}
                                >
                                  {lesson.title}
                                </span>
                                <span className="text-[11px] text-white/30 shrink-0">
                                  {formatSeconds(lesson.duration)}
                                </span>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
