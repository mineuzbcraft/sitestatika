"use server";

import { answerHuquqimQuestion, type HuquqimQuestionInput } from '@/ai/flows/huquqim-flow';
import { z } from 'zod';

const questionSchema = z.object({
  question: z.string().min(5, 'Savol kamida 5 ta belgidan iborat bo\'lishi kerak.'),
});

export async function askQuestionAction(data: HuquqimQuestionInput) {
  const parsedData = questionSchema.safeParse(data);
  if (!parsedData.success) {
    const error = parsedData.error.errors[0].message;
    return { success: false, error };
  }
  
  try {
    const result = await answerHuquqimQuestion(parsedData.data);
    return { success: true, data: result };
  } catch (e) {
    console.error("AI flow error:", e);
    return { success: false, error: 'Sun\'iy intellekt bilan bog\'lanishda xatolik yuz berdi.' };
  }
}
