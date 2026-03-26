import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { syncFacebookPagesAction } from '@/features/pages/actions';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const sync = searchParams.get('sync') === 'true';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      if (sync) {
        try {
          await syncFacebookPagesAction();
        } catch (syncError) {
          console.error('Auto-sync failed:', syncError);
          // We still redirect, but maybe with an error param
          return NextResponse.redirect(`${origin}${next}?error=Sync failed`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Authentication failed`);
}
