"use server";

import { generateArizaLetter, type ArizaLetterInput } from '@/ai/flows/ariza-letter-generator';
import { z } from 'zod';

const arizaSchema = z.object({
  letterType: z.enum([
    'Ishga kirish arizasi',
    'Oʻqishga kirish arizasi',
    'Moddiy yordam soʻrash',
    'Akademik taʼtil soʻrash',
    'Ishdan boʻshatish arizasi',
    'Tavsiyanoma olish',
    'Murojaat',
    'Boshqa'
  ]),
  applicantFullName: z.string(),
  applicantAddress: z.string(),
  applicantPhoneNumber: z.string(),
  applicantEmail: z.string().email(),
  recipientTitle: z.string(),
  recipientOrganization: z.string(),
  additionalDetails: z.string().optional(),
});


export async function generateLetterAction(data: ArizaLetterInput) {
  const parsedData = arizaSchema.safeParse(data);
  if (!parsedData.success) {
    console.error("Validation failed:", parsedData.error);
    return { success: false, error: 'Kiritilgan ma\'lumotlar yaroqsiz.' };
  }
  
  try {
    const result = await generateArizaLetter(parsedData.data);
    return { success: true, data: result };
  } catch (e) {
    console.error("AI flow error:", e);
    return { success: false, error: 'Sun\'iy intellekt bilan bog\'lanishda xatolik yuz berdi.' };
  }
}
