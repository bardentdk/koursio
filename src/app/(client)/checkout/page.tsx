"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CreditCard,
  Lock,
  CheckCircle,
  User,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils/format";
import { toast } from "sonner";

interface CartCourse {
  id: string;
  title: string;
  slug: string;
  price: number;
  sale_price: number | null;
  thumbnail_url: string | null;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appliedCoupon = searchParams.get("coupon") ?? "";

  const [cartIds, setCartIds] = useState<string[]>([]);
  const [cartCourses, setCartCourses] = useState<CartCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"info" | "payment" | "done">("info");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [orderRef, setOrderRef] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState(appliedCoupon);
  const [couponLoading, setCouponLoading] = useState(false);
  const [discountType, setDiscountType] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Load cart IDs + auth
  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("cart") ?? "[]") as string[];
    setCartIds(ids);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email ?? "" });
        setEmail(data.user.email ?? "");
        setStep("payment");
      }
    });
  }, []);

  // Load courses from Supabase
  useEffect(() => {
    if (cartIds.length === 0) {
      setCartCourses([]);
      return;
    }
    setCoursesLoading(true);
    const supabase = createClient();
    supabase
      .from("courses")
      .select("id, title, slug, price, sale_price, thumbnail_url")
      .in("id", cartIds)
      .then(({ data, error }) => {
        if (error) {
          toast.error("Erreur lors du chargement du panier");
        } else {
          setCartCourses((data ?? []) as CartCourse[]);
        }
        setCoursesLoading(false);
      });
  }, [cartIds]);

  // Validate coupon from URL param on mount if present
  useEffect(() => {
    if (appliedCoupon && cartCourses.length > 0) {
      validateCoupon(appliedCoupon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedCoupon, cartCourses.length]);

  const subtotal = cartCourses.reduce((sum, c) => sum + (c.sale_price ?? c.price), 0);
  const discountAmt =
    couponApplied && discountValue > 0
      ? discountType === "percentage"
        ? subtotal * (discountValue / 100)
        : Math.min(discountValue, subtotal)
      : 0;
  const total = subtotal - discountAmt;

  const validateCoupon = async (code: string) => {
    if (!code.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/checkout/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), total: subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscountType(data.discount_type);
        setDiscountValue(data.discount_value);
        setCouponApplied(true);
        toast.success("Code promo appliqué !");
      } else {
        setCouponApplied(false);
        setDiscountValue(0);
        setDiscountType(null);
        setCouponError(data.message ?? "Code invalide");
      }
    } catch {
      setCouponError("Erreur lors de la vérification");
    }
    setCouponLoading(false);
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createAccount) {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) {
        toast.error("Erreur lors de la création du compte");
        return;
      }
      if (data.user)
        setUser({ id: data.user.id, email: data.user.email ?? "" });
    }
    setStep("payment");
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartIds.length) return;
    setLoading(true);

    // Simulate payment delay
    await new Promise((r) => setTimeout(r, 1500));

    try {
      // Call real order API
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseIds: cartIds,
          couponCode: couponApplied ? couponCode : null,
          subtotal,
          discount: discountAmt,
          total,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOrderRef(data.invoiceNumber);
      localStorage.removeItem("cart");
      setStep("done");
    } catch {
      // Fallback for unauthenticated demo
      setOrderRef(`FAC-DEMO-${Date.now().toString(36).toUpperCase()}`);
      localStorage.removeItem("cart");
      setStep("done");
    }
    setLoading(false);
  };

  if (step === "done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full comic-card bg-surface p-10 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-success/15 border-2 border-success/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-black text-text-primary mb-2">
            Commande confirmée !
          </h1>
          <p className="text-text-secondary mb-2">
            Merci pour votre achat. Vos cours sont maintenant disponibles.
          </p>
          <p className="text-xs text-text-muted mb-6">
            Référence : <strong>{orderRef}</strong>
          </p>
          <div className="flex flex-col gap-3">
            <Button size="lg" className="w-full" asChild>
              <a href="/dashboard/mes-cours">Accéder à mes cours</a>
            </Button>
            <Button variant="outline" size="md" className="w-full" asChild>
              <a href="/dashboard/factures">Voir ma facture</a>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-black text-text-primary mb-2">
            Finaliser la commande
          </h1>
          <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Lock className="w-4 h-4" /> Paiement sécurisé SSL
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === "info" && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleInfoSubmit}
                className="comic-card bg-surface p-6 flex flex-col gap-5"
              >
                <h2 className="font-black text-text-primary text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Vos informations
                </h2>
                <Input
                  label="Nom complet"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Jean Dupont"
                />
                <Input
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="jean@exemple.fr"
                  leftIcon={<Mail className="w-4 h-4" />}
                />
                <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-[10px]">
                  <input
                    type="checkbox"
                    id="create-account"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <label
                    htmlFor="create-account"
                    className="text-sm text-text-secondary cursor-pointer"
                  >
                    Créer un compte pour accéder à mes cours
                  </label>
                </div>
                {createAccount && (
                  <Input
                    label="Mot de passe"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="8 caractères minimum"
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                      >
                        {showPwd ? (
                          <EyeOff className="w-4 h-4 text-text-muted" />
                        ) : (
                          <Eye className="w-4 h-4 text-text-muted" />
                        )}
                      </button>
                    }
                  />
                )}
                <Button type="submit" size="lg" className="w-full">
                  Continuer vers le paiement
                </Button>
              </motion.form>
            )}

            {step === "payment" && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handlePayment}
                className="comic-card bg-surface p-6 flex flex-col gap-5"
              >
                <h2 className="font-black text-text-primary text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Paiement
                </h2>
                <div className="p-3 bg-info/10 border-2 border-info/30 rounded-[10px] flex items-center gap-2 text-sm text-info">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Mode démo — aucun débit réel. Stripe sera branché en
                  production.
                </div>
                <Input
                  label="Numéro de carte"
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16)
                        .replace(/(.{4})/g, "$1")
                        .trim(),
                    )
                  }
                  placeholder="1234 5678 9012 3456"
                  leftIcon={<CreditCard className="w-4 h-4" />}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiration"
                    value={cardExpiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
                      setCardExpiry(v);
                    }}
                    placeholder="MM/AA"
                    required
                  />
                  <Input
                    label="CVC"
                    value={cardCvc}
                    onChange={(e) =>
                      setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    placeholder="123"
                    required
                  />
                </div>

                {/* Coupon code field in payment step */}
                <div className="flex gap-2">
                  <Input
                    label="Code promo"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponApplied(false);
                      setCouponError("");
                    }}
                    placeholder="FLASH50"
                    className="flex-1"
                  />
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      loading={couponLoading}
                      onClick={() => validateCoupon(couponCode)}
                      disabled={!couponCode.trim()}
                    >
                      Appliquer
                    </Button>
                  </div>
                </div>
                {couponError && (
                  <p className="text-xs text-error -mt-3">{couponError}</p>
                )}
                {couponApplied && (
                  <p className="text-xs text-success -mt-3">
                    Code {couponCode} appliqué !
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  className="w-full"
                  leftIcon={<Lock className="w-4 h-4" />}
                >
                  {loading ? "Traitement..." : `Payer ${formatPrice(total)}`}
                </Button>
              </motion.form>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="comic-card bg-surface p-5 sticky top-20">
              <h2 className="font-bold text-text-primary mb-4">
                Récapitulatif
              </h2>
              {coursesLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-6 h-6 rounded-full border-3 border-primary border-t-transparent animate-spin" />
                </div>
              ) : (
                <div className="flex flex-col gap-3 mb-5">
                  {cartCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex justify-between gap-2 text-sm"
                    >
                      <span className="text-text-secondary line-clamp-1 flex-1">
                        {course.title}
                      </span>
                      <span className="font-semibold shrink-0">
                        {formatPrice(course.sale_price ?? course.price)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {couponApplied && discountAmt > 0 && (
                <div className="flex justify-between text-sm text-success mb-2">
                  <span>
                    Code {couponCode}{" "}
                    {discountType === "percentage"
                      ? `(-${discountValue}%)`
                      : `(-${formatPrice(discountValue)})`}
                  </span>
                  <span>-{formatPrice(discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-text-primary text-lg pt-3 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-text-muted mt-3 text-center">
                Garantie satisfait ou remboursé 30 jours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
