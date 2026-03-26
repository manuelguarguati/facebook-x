"use server";

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect('/login?error=Invalid credentials');
  }
  
  return redirect('/dashboard');
}

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const supabase = await createClient();
  
  // 1. Create Auth User
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return redirect(`/register?error=${authError.message}`);
  }

  if (!authData.user) {
    return redirect('/register?error=Registration failed');
  }

  // 2. Insert into custom "users" table
  const { error: dbError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email: authData.user.email,
      name: name || authData.user.email?.split('@')[0],
      plan: 'free',
      created_at: new Date().toISOString()
    });

  if (dbError) {
    console.error("Failed to create user profile:", dbError);
  }

  // 3. Handle session (if email confirmation is on, session will be null)
  if (!authData.session) {
    return redirect('/login?message=Check your email to confirm your account');
  }

  return redirect('/dashboard');
}

export async function signInWithFacebookAction() {
  const host = (await headers()).get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const origin = `${protocol}://${host}`;
  const redirectUrl = `${origin}/auth/callback?next=/dashboard/pages&sync=true`;

  console.log('DEBUG: Facebook OAuth Redirect URL:', redirectUrl);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: redirectUrl,
      scopes: 'pages_show_list,pages_read_engagement,pages_manage_posts,public_profile,email',
    },
  });

  if (error) {
    return redirect(`/login?error=${error.message}`);
  }

  if (data.url) {
    return redirect(data.url);
  }
}

export async function signInWithGoogleAction() {
  const host = (await headers()).get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const origin = `${protocol}://${host}`;
  const redirectUrl = `${origin}/auth/callback?next=/dashboard`;

  console.log('DEBUG: Google OAuth Redirect URL:', redirectUrl);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return redirect(`/login?error=${error.message}`);
  }

  if (data.url) {
    return redirect(data.url);
  }
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/');
}
