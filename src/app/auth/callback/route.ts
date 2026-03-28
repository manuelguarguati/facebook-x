import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { syncFacebookPagesAction } from '@/features/pages/actions';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const sync = searchParams.get('sync') === 'true';

  if (code) {
    console.log("DEBUG [AuthCallback]: Code received, exchanging for session...");
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("DEBUG [AuthCallback]: Session exchange error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
    }

    if (session) {
      console.log("DEBUG [AuthCallback]: Session exchange successful for user:", session.user.email);
      
      if (sync) {
        try {
          console.log("DEBUG [AuthCallback]: Triggering Facebook sync...");
          await syncFacebookPagesAction();
        } catch (syncError: any) {
          console.error('DEBUG [AuthCallback]: Auto-sync failed:', syncError);
          const errorMessage = encodeURIComponent(syncError?.message || 'Sync failed');
          return NextResponse.redirect(`${origin}${next}?error=${errorMessage}`);
        }
      }
      
      console.log("DEBUG [AuthCallback]: Redirecting to:", next);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  console.warn("DEBUG [AuthCallback]: No code found in URL or exchange failed without error");
  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Authentication failed or session missing`);
}
