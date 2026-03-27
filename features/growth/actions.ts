'use server';

import { GrowthAIService, GrowthHeaderParams } from '@/services/ai/growth.service';
import { GrowthRepository, GrowthStrategy } from '@/repositories/growth.repository';
import { ScheduledPostRepository } from '@/repositories/scheduled-post.repository';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const growthRepo = new GrowthRepository();
const growthAI = new GrowthAIService();
const scheduledRepo = new ScheduledPostRepository();

export async function generateGrowthStrategyAction(params: GrowthHeaderParams & { pageId: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('No autorizado');

  try {
    // 1. Generate with AI
    const strategyJson = await growthAI.generateStrategy(params);

    // 2. Save to DB
    const strategy: GrowthStrategy = {
      user_id: user.id,
      page_id: params.pageId,
      niche: params.niche,
      style: params.style,
      frequency: params.frequency,
      duration_days: params.days,
      strategy_json: strategyJson,
    };

    const saved = await growthRepo.create(strategy);
    
    revalidatePath('/dashboard/growth-studio');
    return { success: true, data: saved };
  } catch (error: any) {
    console.error('Error generating growth strategy:', error);
    return { success: false, error: error.message };
  }
}

export async function syncToCalendarAction(data: {
  pageId: string;
  content: string;
  dayNumber: number;
  timeStr: string;
}) {
  try {
    // Calcular fecha: Hoy + dayNumber días
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + data.dayNumber);
    
    // Parsear hora (ej: "10:00 AM")
    const timeParts = data.timeStr.split(' ');
    const time = timeParts[0];
    const modifier = timeParts[1];

    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    scheduledDate.setHours(hours || 10, minutes || 0, 0, 0);

    const result = await scheduledRepo.scheduleNewPost({
      page_id: data.pageId,
      content: data.content,
      scheduled_for: scheduledDate.toISOString(),
      ai_generated: true
    });

    if (!result.success) throw new Error(result.error);

    revalidatePath('/dashboard/schedule');
    return { success: true };
  } catch (error: any) {
    console.error('Error syncing to calendar:', error);
    return { success: false, error: error.message };
  }
}

export async function getGrowthStrategiesAction(pageId: string) {
  try {
    const strategies = await growthRepo.getByPage(pageId);
    return { success: true, data: strategies };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
