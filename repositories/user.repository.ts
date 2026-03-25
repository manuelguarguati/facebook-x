import { createClient } from '@/lib/supabase/server';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro';
  created_at: string;
}

export class UserRepository {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return data as UserProfile;
  }
}
