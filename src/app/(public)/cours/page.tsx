"use client";

import { useState, useTransition, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { CourseCard } from "@/components/ui/course-card";
import { SearchBar } from "@/components/ui/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import type { CourseRow, CategoryRow } from "@/lib/supabase/queries";

const LEVELS = [
  { value: "", label: "Tous niveaux" },
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Plus populaires" },
  { value: "newest", label: "Plus récents" },
  { value: "rating", label: "Mieux notés" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];

const PRICE_RANGES = [
  { value: "", label: "Tous les prix" },
  { value: "0-30", label: "Moins de 30€" },
  { value: "30-60", label: "30€ - 60€" },
  { value: "60-999", label: "Plus de 60€" },
];

function CataloguePage() {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(
    searchParams.get("categorie") ?? "",
  );
  const [level, setLevel] = useState(searchParams.get("niveau") ?? "");
  const [priceRange, setPriceRange] = useState(
    searchParams.get("prix") ?? "",
  );
  const [sort, setSort] = useState(searchParams.get("tri") ?? "popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [, startTransition] = useTransition();

  const [allCourses, setAllCourses] = useState<CourseRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from("courses") as any)
        .select(
          "id, title, slug, subtitle, price, original_price, thumbnail_url, rating, total_reviews, total_enrollments, level, duration_hours, total_lessons, is_featured, is_bestseller, is_new, has_certificate, status, currency, category_id, published_at, instructor:profiles!instructor_id(id, full_name), category:categories(id, name, slug, color)",
        )
        .eq("status", "published")
        .order("created_at", { ascending: false }),
      supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("order_index"),
    ]).then(([{ data: courses }, { data: cats }]) => {
      setAllCourses((courses ?? []) as CourseRow[]);
      setCategories((cats ?? []) as CategoryRow[]);
      setLoading(false);
    });
  }, []);

  const filtered = allCourses
    .filter((c) => {
      if (
        query &&
        !c.title.toLowerCase().includes(query.toLowerCase()) &&
        !c.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      if (category && c.category?.slug !== category) return false;
      if (level && c.level !== level) return false;
      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        if (c.price < min || c.price > max) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case "newest":
          return (b.published_at ?? "").localeCompare(a.published_at ?? "");
        case "rating":
          return b.rating - a.rating;
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        default:
          return b.total_enrollments - a.total_enrollments;
      }
    });

  const activeFiltersCount = [category, level, priceRange].filter(
    Boolean,
  ).length;

  const clearFilters = () => {
    setCategory("");
    setLevel("");
    setPriceRange("");
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black text-text-primary mb-2">
              Catalogue des formations
            </h1>
            <p className="text-text-secondary">
              {loading
                ? "Chargement..."
                : `${filtered.length} formation${filtered.length !== 1 ? "s" : ""} disponible${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </motion.div>

          <div className="flex gap-3 mt-6">
            <SearchBar
              size="md"
              placeholder="Rechercher une formation..."
              defaultValue={query}
              onSearch={(q) => startTransition(() => setQuery(q))}
              className="flex-1 max-w-xl"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters((v) => !v)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              className="relative"
            >
              Filtres
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setCategory("")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all",
                !category
                  ? "bg-primary text-white border-primary"
                  : "bg-transparent text-text-secondary border-border hover:border-primary hover:text-primary",
              )}
            >
              Tout
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setCategory(cat.slug === category ? "" : cat.slug)
                }
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all",
                  category === cat.slug
                    ? "text-white border-transparent"
                    : "bg-transparent text-text-secondary border-border hover:border-primary hover:text-primary",
                )}
                style={
                  category === cat.slug
                    ? {
                        backgroundColor: cat.color ?? "#f84904",
                        borderColor: cat.color ?? "#f84904",
                      }
                    : {}
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Advanced filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="comic-card bg-surface p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">
                Niveau
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full h-10 bg-background border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
              >
                {LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 block">
                Prix
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full h-10 bg-background border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
              >
                {PRICE_RANGES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            {activeFiltersCount > 0 && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  leftIcon={<X className="w-4 h-4" />}
                >
                  Effacer les filtres
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {query && (
              <Badge
                variant="primary"
                icon={
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setQuery("")}
                  />
                }
              >
                &ldquo;{query}&rdquo;
              </Badge>
            )}
            {category && (
              <Badge
                variant="primary"
                icon={
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => setCategory("")}
                  />
                }
              >
                {categories.find((c) => c.slug === category)?.name}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-9 bg-surface border-2 border-border rounded-[10px] px-3 text-sm font-medium focus:border-primary focus:outline-none"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <div className="flex border-2 border-border rounded-[10px] overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "p-2",
                  view === "grid"
                    ? "bg-primary text-white"
                    : "bg-surface text-text-muted hover:bg-surface-2",
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "p-2",
                  view === "list"
                    ? "bg-primary text-white"
                    : "bg-surface text-text-muted hover:bg-surface-2",
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[16px] bg-surface border-2 border-border animate-pulse h-80"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Aucune formation trouvée"
            description="Essayez d'autres filtres ou une recherche différente."
            action={{ label: "Effacer les filtres", onClick: clearFilters }}
          />
        ) : (
          <div
            className={cn(
              "grid gap-5",
              view === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1",
            )}
          >
            {filtered.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3) }}
              >
                <CourseCard
                  course={course as never}
                  compact={view === "list"}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CataloguePageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <CataloguePage />
    </Suspense>
  );
}

export default CataloguePageWrapper;
