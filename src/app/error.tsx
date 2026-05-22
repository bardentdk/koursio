"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error: ", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-[24px] gradient-brand flex items-center justify-center text-5xl shadow-[0_6px_0_0_#c93800]"></div>
        <div>
          <h1 className="text-2xl font-black text-text-primary mb-2">
            Une erreur est survenue
          </h1>
          <p className="text-text-secondary text-sm">
            Quelque chose s&apos;est mal passé. Notre équipe a été notifiée.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={reset} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Réessayer
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" /> Accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
