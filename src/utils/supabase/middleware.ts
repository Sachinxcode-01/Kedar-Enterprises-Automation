import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // 1. Define Public routes that never require authentication
  const isPublicRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/unauthorized") ||
    pathname.startsWith("/api/whatsapp/webhook") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico");

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase environment variables are missing (e.g. initial development build), pass through
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Retrieve active authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // If user is not authenticated and trying to access a protected route
    if (!isPublicRoute && (!user || userError)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If authenticated user is visiting /login, redirect to dashboard
    if (user && pathname.startsWith("/login")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }

    // If authenticated, perform role check on sensitive administrative routes
    if (user && !isPublicRoute) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, active")
        .eq("id", user.id)
        .single();

      // Check inactive account
      if (profile && profile.active === false) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/unauthorized";
        redirectUrl.searchParams.set("error", "account_disabled");
        return NextResponse.redirect(redirectUrl);
      }

      // Check admin-only route permissions
      const isAdminRoute =
        pathname.startsWith("/users") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/audit-logs") ||
        pathname.startsWith("/errors") ||
        pathname.startsWith("/automation");

      if (isAdminRoute && profile && profile.role !== "ADMIN") {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/unauthorized";
        redirectUrl.searchParams.set("error", "admin_only");
        return NextResponse.redirect(redirectUrl);
      }
    }
  } catch (err) {
    console.error("[Auth Middleware Error]", err);
  }

  return supabaseResponse;
};
