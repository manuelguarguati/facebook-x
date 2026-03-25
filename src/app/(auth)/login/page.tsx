import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { LoginForm } from './LoginForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <AuthLayout 
      title="auth.login_title" 
      subtitle="auth.login_subtitle"
    >
      <LoginForm error={params.error} message={params.message} />
    </AuthLayout>
  );
}
