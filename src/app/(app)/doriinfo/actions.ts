"use server";

import { getDoriInfo, type DoriInfoInput } from '@/ai/flows/dori-info-flow';
import { z } from 'zod';

const doriInfoSchema = z.object({
  medicineName: z.string().min(2, 'Dori nomi kamida 2 harfdan iborat bo\'lishi kerak.'),
});

export async function getDoriInfoAction(data: DoriInfoInput) {
  const parsedData = doriInfoSchema.safeParse(data);
  if (!parsedData.success) {
    const error = parsedData.error.errors[0].message;
    return { success: false, error };
  }
  
  try {
    const result = await getDoriInfo(parsedData.data);
    if (!result.found) {
        return { success: false, error: `"${parsedData.data.medicineName}" nomli dori topilmadi.` };
    }
    return { success: true, data: result };
  } catch (e) {
    console.error("AI flow error:", e);
    return { success: false, error: 'Sun\'iy intellekt bilan bog\'lanishda xatolik yuz berdi.' };
  }
}
