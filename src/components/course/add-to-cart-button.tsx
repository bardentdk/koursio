"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, Lock } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface AddToCartButtonProps extends Omit<ButtonProps, "onClick"> {
  courseId: string;
  isEnrolled?: boolean;
  courseSlug?: string;
}

export function AddToCartButton({
  courseId,
  isEnrolled = false,
  courseSlug,
  children,
  ...props
}: AddToCartButtonProps) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const cart: string[] = JSON.parse(localStorage.getItem("cart") ?? "[]");
    setInCart(cart.includes(courseId));
  }, [courseId]);

  // Already enrolled — go to course
  if (isEnrolled && courseSlug) {
    return (
      <Button leftIcon={<Lock className="w-4 h-4" />} asChild {...props}>
        <Link href={`/dashboard/cours/${courseSlug}`}>Accéder au cours</Link>
      </Button>
    );
  }

  const handleClick = () => {
    const cart: string[] = JSON.parse(localStorage.getItem("cart") ?? "[]");
    if (inCart) {
      router.push("/panier");
      return;
    }
    if (!cart.includes(courseId)) {
      cart.push(courseId);
      localStorage.setItem("cart", JSON.stringify(cart));
      setAdded(true);
      setInCart(true);
      toast.success("Cours ajouté au panier !", {
        action: {
          label: "Voir le panier",
          onClick: () => router.push("/panier"),
        },
      });
      setTimeout(() => setAdded(false), 3000);
    }
  };

  return (
    <Button
      onClick={handleClick}
      leftIcon={
        added ? (
          <Check className="w-4 h-4" />
        ) : inCart ? (
          <ShoppingCart className="w-4 h-4" />
        ) : (
          <ShoppingCart className="w-4 h-4" />
        )
      }
      {...props}
    >
      {children ??
        (added ? "Ajouté !" : inCart ? "Voir le panier" : "Ajouter au panier")}
    </Button>
  );
}
