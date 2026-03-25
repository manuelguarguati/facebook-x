import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { RegisterForm } from './RegisterForm';

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <AuthLayout 
      title="auth.register_title" 
      subtitle="auth.register_subtitle"
    >
      <RegisterForm error={params.error} />
    </AuthLayout>
  );
}
