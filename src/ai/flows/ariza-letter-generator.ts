'use server';
/**
 * @fileOverview A Genkit flow for generating formal Uzbek application letters.
 *
 * - generateArizaLetter - A function that handles the generation of application letters.
 * - ArizaLetterInput - The input type for the generateArizaLetter function.
 * - ArizaLetterOutput - The return type for the generateArizaLetter function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ArizaLetterInputSchema = z.object({
  letterType: z.enum([
    'Ishga kirish arizasi',
    'Oʻqishga kirish arizasi',
    'Moddiy yordam soʻrash',
    'Akademik taʼtil soʻrash',
    'Ishdan boʻshatish arizasi',
    'Tavsiyanoma olish',
    'Murojaat',
    'Boshqa'
  ]).describe('The type of application letter to generate.'),
  applicantFullName: z.string().describe('Full name of the applicant.'),
  applicantAddress: z.string().describe('Address of the applicant.'),
  applicantPhoneNumber: z.string().describe('Phone number of the applicant.'),
  applicantEmail: z.string().email().describe('Email address of the applicant.'),
  recipientTitle: z.string().describe('Title or position of the letter recipient (e.g., Rektor, Direktor).'),
  recipientOrganization: z.string().describe('Name of the organization the letter is addressed to.'),
  additionalDetails: z.string().describe('Any specific details or requests pertinent to the letter content.').optional()
});
export type ArizaLetterInput = z.infer<typeof ArizaLetterInputSchema>;

const ArizaLetterOutputSchema = z.object({
  generatedLetterContent: z.string().describe('The complete formal Uzbek application letter content.')
});
export type ArizaLetterOutput = z.infer<typeof ArizaLetterOutputSchema>;

export async function generateArizaLetter(input: ArizaLetterInput): Promise<ArizaLetterOutput> {
  return arizaLetterFlow(input);
}

const arizaLetterPrompt = ai.definePrompt({
  name: 'arizaLetterPrompt',
  input: { schema: ArizaLetterInputSchema },
  output: { schema: ArizaLetterOutputSchema },
  prompt: `Siz O'zbek tilidagi rasmiy xatlar yozish bo'yicha mutaxassissiz.\nSizga foydalanuvchining ma'lumotlari beriladi va siz shu ma'lumotlar asosida rasmiy O'zbek tilida ariza xatini tuzib berishingiz kerak.\nXat rasmiy, grammatik jihatdan to'g'ri va tuzilishiga rioya qilgan holda bo'lishi shart.\nXat tarkibiga quyidagilar kiradi:\n- Kimdan va kimga yo'naltirilganligi\n- Sana\n- Xatning sarlavhasi (ariza turi bo'yicha)\n- Xatning asosiy qismi (foydalanuvchi taqdim etgan "additionalDetails" ma'lumotlarini hisobga olgan holda)\n- Hurmat bilan, imzo\n\nFoydalanuvchi ma'lumotlari:\nAriza turi: {{{letterType}}}\nAriza beruvchining to'liq ismi: {{{applicantFullName}}}\nAriza beruvchining manzili: {{{applicantAddress}}}\nAriza beruvchining telefon raqami: {{{applicantPhoneNumber}}}\nAriza beruvchining elektron pochtasi: {{{applicantEmail}}}\nQabul qiluvchining lavozimi/unvoni: {{{recipientTitle}}}\nQabul qiluvchi tashkilot: {{{recipientOrganization}}}\nQo'shimcha ma'lumotlar (agar mavjud bo'lsa): {{{additionalDetails}}}\n\nIltimos, yuqoridagi ma'lumotlar asosida rasmiy O'zbek tilida ariza xatini yarating. Bugungi sana ham xatga qo'shilsin.\n`
});

const arizaLetterFlow = ai.defineFlow(
  {
    name: 'arizaLetterFlow',
    inputSchema: ArizaLetterInputSchema,
    outputSchema: ArizaLetterOutputSchema,
  },
  async (input) => {
    const { output } = await arizaLetterPrompt(input);
    if (!output) {
      throw new Error('Failed to generate letter content.');
    }
    return output;
  }
);
