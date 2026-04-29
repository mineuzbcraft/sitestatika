'use server';
/**
 * @fileOverview A Genkit flow for career suggestions.
 *
 * - suggestProfession - Suggests professions based on user input.
 * - KasbimInput - The input type for the function.
 * - KasbimOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const KasbimInputSchema = z.object({
  interests: z.string().describe('The user\'s interests, skills, and preferences.'),
});
export type KasbimInput = z.infer<typeof KasbimInputSchema>;

const KasbimOutputSchema = z.object({
  suggestion: z.string().describe("A markdown-formatted string containing career suggestions."),
});
export type KasbimOutput = z.infer<typeof KasbimOutputSchema>;

export async function suggestProfession(input: KasbimInput): Promise<KasbimOutput> {
  return kasbimFlow(input);
}

const kasbimPrompt = ai.definePrompt({
  name: 'kasbimPrompt',
  input: { schema: KasbimInputSchema },
  output: { schema: KasbimOutputSchema },
  prompt: `Siz kasb tanlash bo'yicha professional maslahatchisiz. Foydalanuvchining qiziqishlari, ko'nikmalari va xohishlariga asoslanib, unga mos keladigan kasblarni tavsiya qiling.
Har bir kasb uchun qisqacha tavsif, kerakli ko'nikmalar, va O'zbekistondagi o'rtacha maosh (taxminiy) haqida ma'lumot bering.
Javobingizni Markdown formatida, tushunarli va rag'batlantiruvchi tilda yozing.

Foydalanuvchi ma'lumotlari: {{{interests}}}
`,
});

const kasbimFlow = ai.defineFlow(
  {
    name: 'kasbimFlow',
    inputSchema: KasbimInputSchema,
    outputSchema: KasbimOutputSchema,
  },
  async (input) => {
    const { output } = await kasbimPrompt(input);
    if (!output) {
      return { suggestion: "Kechirasiz, hozirda tavsiya berishda muammo yuzaga keldi. Iltimos, keyinroq qayta urinib ko'ring." };
    }
    return output;
  }
);
