"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_CATEGORIES } from "@/lib/data/mock-data";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Catégories</h1>
          <p className="text-text-secondary mt-1">
            {categories.length} catégories actives
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Nouvelle catégorie
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="comic-card bg-surface p-4 flex items-center gap-4"
          >
            <GripVertical className="w-5 h-5 text-text-muted cursor-grab shrink-0" />
            <div
              className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-lg font-bold"
              style={{
                backgroundColor: `${cat.color ?? "#00674F"}20`,
                color: cat.color ?? "#00674F",
              }}
            >
              {cat.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-text-primary">{cat.name}</p>
              <p className="text-xs text-text-muted truncate">
                {cat.description}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-text-muted hidden sm:block">
                {cat.course_count} cours
              </span>
              <Badge variant={cat.is_active ? "success" : "outline"}>
                {cat.is_active ? "Active" : "Inactive"}
              </Badge>
              <button className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-primary transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-[6px] hover:bg-surface-2 text-text-muted hover:text-error transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
