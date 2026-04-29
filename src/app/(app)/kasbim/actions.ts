"use server";

import { suggestProfession, type KasbimInput } from '@/ai/flows/kasbim-flow';
import { z } from 'zod';

const inputSchema = z.object({
  interests: z.string().min(10, 'Qiziqishlaringizni batafsilroq yozing (kamida 10 belgi).'),
});

export async function getProfessionSuggestionAction(data: KasbimInput) {
  const parsedData = inputSchema.safeParse(data);
  if (!parsedData.success) {
    const error = parsedData.error.errors[0].message;
    return { success: false, error };
  }
  
  try {
    const result = await suggestProfession(parsedData.data);
    return { success: true, data: result };
  } catch (e) {
    console.error("AI flow error:", e);
    return { success: false, error: 'Sun\'iy intellekt bilan bog\'lanishda xatolik yuz berdi.' };
  }
}
