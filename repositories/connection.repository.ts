import { createClient } from '@/lib/supabase/server';

export interface FacebookConnection {
  id: string;
  user_id: string;
  facebook_user_id: string;
  access_token: string;
  token_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export class ConnectionRepository {
  async upsertConnection(data: {
    user_id: string;
    facebook_user_id: string;
    access_token: string;
    token_expires_at?: string;
  }): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('facebook_connections')
      .upsert({
        ...data,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
        console.error('[ConnectionRepository] Upsert error:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
  }

  async getConnection(userId: string): Promise<FacebookConnection | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('facebook_connections')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;
    return data as FacebookConnection;
  }

  async deleteConnection(userId: string): Promise<void> {
    const supabase = await createClient();
    await supabase
      .from('facebook_connections')
      .delete()
      .eq('user_id', userId);
  }
}
