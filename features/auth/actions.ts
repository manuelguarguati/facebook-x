"use server";

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

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

  if (authError || !authData.user) {
    return redirect(`/register?error=${authError?.message || 'Registration failed'}`);
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
    // Even if profile fails, auth succeeded. We might want to handle this gracefully.
  }

  return redirect('/dashboard');
}
