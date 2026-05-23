"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trash2, Tag, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type CartCourse = {
  id: string;
  title: string;
  slug: string;
  price: number;
  original_price?: number | null;
  thumbnail_url?: string | null;
  instructor?: { full_name?: string | null } | null;
};

export default function PanierPage() {
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [cartCourses, setCartCourses] = useState<CartCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") ?? "[]") as string[];
    setCartIds(stored);

    if (stored.length === 0) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("courses") as any)
      .select(
        "id, title, slug, price, original_price, thumbnail_url, instructor:profiles!instructor_id(full_name)",
      )
      .in("id", stored)
      .then(({ data }: { data: CartCourse[] | null }) => {
        setCartCourses(data ?? []);
        setLoading(false);
      });
  }, []);

  const subtotal = cartCourses.reduce((sum, c) => sum + c.price, 0);
  const discountAmount = discount > 0 ? subtotal * (discount / 100) : 0;
  const total = subtotal - discountAmount;

  const removeFromCart = (id: string) => {
    const updated = cartIds.filter((cid) => cid !== id);
    setCartIds(updated);
    setCartCourses((c) => c.filter((x) => x.id !== id));
    localStorage.setItem("cart", JSON.stringify(updated));
    toast.info("Cours retiré du panier");
  };

  const VALID_COUPONS: Record<string, number> = {
    FLASH70: 70,
    FLASH50: 50,
    ETUDIANT20: 20,
    BIENVENUE70: 70,
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setDiscount(VALID_COUPONS[code]);
      setCouponApplied(code);
      setCouponError("");
      toast.success(`Code "${code}" appliqué ! -${VALID_COUPONS[code]}%`);
    } else {
      setCouponError("Code promo invalide ou expiré.");
      setDiscount(0);
      setCouponApplied("");
    }
  };

  if (!loading && cartCourses.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10" />}
          title="Votre panier est vide"
          description="Découvrez nos formations et ajoutez-en une à votre panier."
          action={{ label: "Explorer les cours", href: "/cours" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-text-primary mb-8"
        >
          Mon panier ({cartCourses.length} cours)
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {loading &&
              Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-surface-2 rounded-[16px] animate-pulse"
                />
              ))}
            {cartCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="comic-card bg-surface flex gap-4 p-4"
              >
                <div className="relative w-24 h-16 rounded-[8px] overflow-hidden shrink-0 bg-surface-2">
                  {course.thumbnail_url && (
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/cours/${course.slug}`}>
                    <h3 className="font-bold text-text-primary hover:text-primary transition-colors line-clamp-2 text-sm">
                      {course.title}
                    </h3>
                  </Link>
                  {course.instructor?.full_name && (
                    <p className="text-xs text-text-muted mt-0.5">
                      {course.instructor.full_name}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-black text-primary text-lg">
                      {formatPrice(course.price)}
                    </span>
                    {course.original_price && (
                      <span className="text-sm text-text-muted line-through">
                        {formatPrice(course.original_price)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(course.id)}
                  className="p-2 text-text-muted hover:text-error transition-colors self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="comic-card bg-surface p-6 sticky top-20">
              <h2 className="font-black text-text-primary text-lg mb-5">
                Récapitulatif
              </h2>

              {/* Coupon */}
              <div className="mb-5">
                <label className="text-sm font-bold text-text-muted mb-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Code promo
                </label>
                {couponApplied ? (
                  <div className="flex items-center justify-between p-3 bg-success/10 border-2 border-success/30 rounded-[10px]">
                    <span className="text-success font-bold text-sm">
                      {couponApplied} (-{discount}%)
                    </span>
                    <button
                      onClick={() => {
                        setCouponApplied("");
                        setDiscount(0);
                        setCouponCode("");
                      }}
                      className="text-xs text-text-muted hover:text-error"
                    >
                      Retirer
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      placeholder="EX: FLASH70"
                      error={couponError}
                      className="flex-1 text-sm"
                    />
                    <Button size="sm" variant="outline" onClick={applyCoupon}>
                      OK
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 pb-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Sous-total</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Remise ({discount}%)</span>
                    <span className="font-semibold">
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-4 mb-6">
                <span className="font-black text-text-primary text-lg">
                  Total
                </span>
                <span className="font-black text-primary text-2xl">
                  {formatPrice(total)}
                </span>
              </div>

              <Button
                size="lg"
                className="w-full"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                asChild
              >
                <Link
                  href={`/checkout${couponApplied ? `?coupon=${couponApplied}` : ""}`}
                >
                  Passer la commande
                </Link>
              </Button>

              <p className="text-xs text-text-muted text-center mt-3">
                Paiement sécurisé — Garantie 30 jours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
