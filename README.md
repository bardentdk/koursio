# Koursio — Apprends. Pratique. Progresse.

> Plateforme LMS Marketplace premium construite avec Next.js 16, TailwindCSS 4, Supabase et TypeScript.
> Palette : Orange `#f84904` → Rose `#ff0072` · Police : Sora Bold/Regular

---

## Stack technique

| Technologie | Usage |
|---|---|
| **Next.js 16** | App Router, SSR/SSG, API Routes, Proxy |
| **TailwindCSS 4** | Design system, variables CSS, dark mode |
| **Supabase** | Auth, PostgreSQL, Storage, RLS |
| **TypeScript** | Typage statique |
| **Framer Motion** | Animations UI, transitions |
| **GSAP** | Animations hero, blobs |
| **Recharts** | Graphiques admin |
| **Sonner** | Toast notifications |
| **next-themes** | Mode clair/sombre |

---

## Installation rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
# Éditer .env.local avec vos clés Supabase

# 3. Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Base de données Supabase

Exécuter dans le SQL Editor de votre dashboard Supabase, dans l'ordre :

1. `supabase/migrations/001_initial_schema.sql` — Tables, triggers, index
2. `supabase/migrations/002_rls_policies.sql` — Row Level Security
3. `supabase/seed.sql` — Données de départ (catégories, codes promo, etc.)

Pour régénérer les types TypeScript :
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

---

## Architecture — 40 routes

### Public
| Route | Description |
|---|---|
| `/` | Homepage avec PromoPopup + FloatingCTA |
| `/cours` | Catalogue avec filtres |
| `/cours/[slug]` | Détail cours + programme + avis |
| `/connexion` | Connexion (layout 2 colonnes) |
| `/inscription` | Inscription |
| `/mot-de-passe-oublie` | Reset password |

### Commerce
| Route | Description |
|---|---|
| `/panier` | Panier + codes promo |
| `/checkout` | Tunnel d'achat → Supabase |

### Apprenant (`/dashboard`)
| Route | Description |
|---|---|
| `/dashboard` | Tableau de bord (cours réels Supabase) |
| `/dashboard/mes-cours` | Liste cours achetés |
| `/dashboard/cours/[slug]` | Lecteur vidéo interactif |
| `/dashboard/certificats` | Certificats obtenus |
| `/dashboard/factures` | Historique achats |
| `/dashboard/favoris` | Wishlist |
| `/dashboard/notifications` | Notifications temps réel |
| `/dashboard/profil` | Édition profil |

### Admin (`/admin`) — 13 pages
Dashboard · Cours · Catégories · Utilisateurs · Formateurs  
Commandes · Factures · Codes promo · Avis · Commentaires  
Notifications · Statistiques · Site/Builder · Thème

### Formateur (`/formateur`) — 6 pages
Dashboard · Mes cours · Créer cours · Éditer cours  
Travaux pratiques · Apprenants · Statistiques

### API
`/api/orders` · `/api/progress` · `/api/wishlist` · `/api/courses/[slug]`  
`/api/auth/callback` · `/api/auth/signout`

---

## Logo Koursio

Le logo est un placeholder `src/components/ui/logo-placeholder.tsx`.  
Pour intégrer le vrai logo, remplacer le `iconBox` dans le composant :

```tsx
// Exemple avec Image Next.js
import Image from "next/image";

const iconBox = (
  <Image src="/logo-koursio.svg" alt="Koursio" width={size} height={size} />
);
```

Le logo s'applique automatiquement à tous les emplacements :
- Navbar publique
- Footer
- Sidebar dashboard
- Sidebar admin
- Sidebar formateur
- Layout pages d'auth

---

## Design System

### Couleurs (palette Koursio officielle)
```css
--primary: #f84904         /* Orange principal */
--primary-dark: #c93800    /* Ombre 3D boutons */
--rose: #ff0072            /* Rose accent */
--gradient: #f84904 → #ff0072  /* Gradient brand */

/* Neutres brand guide */
--background: #ffffff      /* Fond clair */
--surface: #f8fafc         /* Surface secondaire */
--border: #e5e7eb          /* Bordures */
--text-primary: #0f172a    /* Texte principal */
--text-secondary: #334155  /* Texte secondaire */
```

### Utilitaires CSS
```css
.gradient-brand         /* Background gradient orange→rose */
.gradient-brand-text    /* Texte gradient */
.gradient-brand-subtle  /* Fond teinté léger */
.comic-card             /* Card avec bordure + ombre 3D */
.glass                  /* Glassmorphism */
.logo-placeholder       /* Emplacement logo (dashed border) */
.skeleton               /* Animation shimmer */
```

### Composants UI
Button · Input · Badge · Card · CourseCard · Avatar  
Progress · Skeleton · SearchBar · ThemeSwitch · StatCard  
EmptyState · LogoPlaceholder · PromoPopup · FloatingCTA

---

## Rôles utilisateurs

| Rôle | Accès |
|---|---|
| `student` | Dashboard, cours achetés, certificats |
| `instructor` | Espace formateur, création de cours, correction TP |
| `admin` | Accès total, back-office complet |

Le rôle `student` est assigné automatiquement à l'inscription (trigger Supabase).

---

## Prochaines étapes recommandées

1. **Logo** — Intégrer le SVG Koursio dans `logo-placeholder.tsx`
2. **Stripe** — Brancher dans `/api/orders` (structure prête)
3. **Vidéos** — Supabase Storage + signed URLs dans le lecteur
4. **Favicon** — Ajouter `/public/favicon.ico` avec le logo Koursio
5. **Types Supabase** — Régénérer avec `supabase gen types typescript`
6. **Domaine** — Mettre à jour `NEXT_PUBLIC_APP_URL=https://koursio.fr`
7. **Email transactionnel** — Intégrer Resend/SendGrid

---

## Licence

Propriétaire — © {year} Koursio. Tous droits réservés.
