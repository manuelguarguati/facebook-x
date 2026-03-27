import { createClient } from '@/lib/supabase/server';

export interface GrowthStrategy {
  id?: string;
  user_id: string;
  page_id: string;
  niche: string;
  style: string;
  frequency: string;
  duration_days: number;
  strategy_json: any;
  created_at?: string;
}

export class GrowthRepository {
  async create(strategy: GrowthStrategy) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('growth_strategies')
      .insert(strategy)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getByPage(pageId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('growth_strategies')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('growth_strategies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}
