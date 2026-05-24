"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface CartItem {
  id: string;
  title: string;
  price: number;
  sale_price: number | null;
  thumbnail_url: string | null;
  instructor_name?: string;
}

interface UseCartReturn {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (courseId: string) => Promise<void>;
  removeItem: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  loading: boolean;
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const getStoredIds = (): string[] => {
    try {
      return JSON.parse(localStorage.getItem("cart") ?? "[]");
    } catch {
      return [];
    }
  };

  const saveIds = (ids: string[]) => {
    localStorage.setItem("cart", JSON.stringify(ids));
  };

  const loadItems = useCallback(async () => {
    const ids = getStoredIds();
    if (ids.length === 0) {
      setItems([]);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("courses")
      .select("id, title, price, sale_price, thumbnail_url, instructors(profiles(full_name))")
      .in("id", ids);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItems((data ?? []).map((c: any) => ({
      id: c.id,
      title: c.title,
      price: c.price,
      sale_price: c.sale_price,
      thumbnail_url: c.thumbnail_url,
      instructor_name: c.instructors?.profiles?.full_name ?? undefined,
    })));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const addItem = async (courseId: string) => {
    const ids = getStoredIds();
    if (!ids.includes(courseId)) {
      saveIds([...ids, courseId]);
      await loadItems();
    }
  };

  const removeItem = (courseId: string) => {
    const ids = getStoredIds().filter((id) => id !== courseId);
    saveIds(ids);
    setItems((prev) => prev.filter((item) => item.id !== courseId));
  };

  const clearCart = () => {
    saveIds([]);
    setItems([]);
  };

  const isInCart = (courseId: string) => getStoredIds().includes(courseId);

  const total = items.reduce((sum, item) => sum + (item.sale_price ?? item.price), 0);

  return { items, count: items.length, total, addItem, removeItem, clearCart, isInCart, loading };
}
