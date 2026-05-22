import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light) ", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark) ", color: "#0f172a" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://koursio.fr",
  ),
  title: {
    default: "Koursio — Apprends. Pratique. Progresse.",
    template: "%s | Koursio",
  },
  description:
    "La plateforme d'apprentissage en ligne simple, engageante et efficace. Des formations en développement web, marketing, communication et design.",
  keywords: [
    "formation",
    "cours en ligne",
    "développement web",
    "marketing",
    "certification",
    "koursio",
    "apprendre",
  ],
  authors: [{ name: "Koursio" }],
  creator: "Koursio",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://koursio.fr",
    siteName: "Koursio",
    title: "Koursio — Apprends. Pratique. Progresse.",
    description:
      "La plateforme d'apprentissage en ligne simple, engageante et efficace.",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Koursio" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Koursio — Apprends. Pratique. Progresse.",
    description:
      "La plateforme d'apprentissage en ligne simple, engageante et efficace.",
    creator: "@koursio",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${sora.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                fontFamily: "Sora, sans-serif",
                border: "2px solid var(--border) ",
                borderRadius: "12px",
                boxShadow: "0 4px 0 0 var(--border-strong) ",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
