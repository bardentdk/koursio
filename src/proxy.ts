import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const hasSupabase = SUPABASE_URL?.startsWith("http") && !!SUPABASE_ANON_KEY;

const AUTH_PAGES = [
  "/connexion",
  "/inscription",
  "/mot-de-passe-oublie",
  "/reinitialisation",
];
const PROTECTED_DASHBOARD = ["/dashboard", "/formateur", "/admin"];
// panier/checkout don't require auth — guest checkout allowed

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Inject pathname header so layouts can detect current path
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (!hasSupabase) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const { createServerClient } = await import("@supabase/ssr");
  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request: { headers: requestHeaders },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect core dashboard routes
  const isProtected = PROTECTED_DASHBOARD.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (isProtected && !user) {
    const redirectUrl = new URL("/connexion", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect logged-in users away from auth pages
  if (user && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*) ",
  ],
};
