"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, FileText, HelpCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  is_free: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseAccordionProps {
  sections: Section[];
}

function formatSeconds(s: number) {
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}min`;
  return `${m}min`;
}

export function CourseAccordion({ sections }: CourseAccordionProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set([sections[0]?.id]),
  );

  const toggle = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {sections.map((section) => {
        const isOpen = openSections.has(section.id);
        const totalDuration = section.lessons.reduce(
          (acc, l) => acc + l.duration,
          0,
        );

        return (
          <div
            key={section.id}
            className="comic-card bg-surface overflow-hidden"
          >
            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-surface-2 transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-text-primary">
                  {section.title}
                </span>
                <span className="text-xs text-text-muted">
                  {section.lessons.length} leçon
                  {section.lessons.length !== 1 ? "s" : ""} ·{" "}
                  {formatSeconds(totalDuration)}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-primary shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="flex flex-col">
                    {section.lessons.map((lesson, i) => (
                      <div
                        key={lesson.id}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 text-sm",
                          i !== 0 && "border-t border-border",
                          lesson.is_free
                            ? "hover:bg-primary/5 cursor-pointer"
                            : "opacity-70",
                        )}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: lesson.is_free
                              ? "rgba(0,103,79,0.1) "
                              : "rgba(0,0,0,0.05) ",
                          }}
                        >
                          {lesson.is_free ? (
                            <Play className="w-3.5 h-3.5 text-primary fill-primary" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-text-muted" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "flex-1",
                            lesson.is_free
                              ? "text-text-primary font-medium"
                              : "text-text-secondary",
                          )}
                        >
                          {lesson.title}
                          {lesson.is_free && (
                            <span className="ml-2 text-xs text-primary font-bold">
                              Aperçu gratuit
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-text-muted shrink-0">
                          {formatSeconds(lesson.duration)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
