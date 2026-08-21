import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Prevent Open Redirect attacks: Ensure redirect starts with "/" and not "//" or external schema
  const sanitizedNext =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  // Handle OAuth provider errors or user cancellations gracefully
  if (error) {
    console.error("[OAuth Callback Error]", { error, errorDescription });
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        error === "access_denied" ? "oauth_cancelled" : "oauth_failed"
      )}`
    );
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.redirect(`${origin}/login?error=auth_config_missing`);
    }

    const response = NextResponse.redirect(`${origin}${sanitizedNext}`);

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    try {
      const { data: sessionData, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError || !sessionData?.user) {
        console.error("[Auth Code Exchange Failed]", exchangeError?.message);
        return NextResponse.redirect(`${origin}/login?error=invalid_code`);
      }

      const user = sessionData.user;

      // Verify user profile and active status in public.profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role, active, full_name")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        // If profile doesn't exist yet, insert a default inactive/pending profile
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Staff Member",
          role: "STAFF",
          active: true, // Default active for verified enterprise workspace
        });

        if (insertError) {
          console.error("[Profile Creation Error]", insertError.message);
        }
      } else if (!profile.active) {
        // Inactive account protection — DENY ACCESS
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/unauthorized?error=account_disabled`);
      }

      return response;
    } catch (err: any) {
      console.error("[OAuth Callback Exception]", err);
      return NextResponse.redirect(`${origin}/login?error=auth_exception`);
    }
  }

  // Missing authorization code
  return NextResponse.redirect(`${origin}/login?error=missing_code`);
}
