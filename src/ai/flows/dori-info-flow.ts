'use server';
/**
 * @fileOverview A Genkit flow for retrieving information about medicines.
 *
 * - getDoriInfo - A function that handles fetching medicine information.
 * - DoriInfoInput - The input type for the getDoriInfo function.
 * - DoriInfoOutput - The return type for the getDoriInfo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DoriInfoInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine to search for.'),
});
export type DoriInfoInput = z.infer<typeof DoriInfoInputSchema>;

const DoriInfoOutputSchema = z.object({
  found: z.boolean().describe("Whether information for the medicine was found."),
  name: z.string().describe("The name of the medicine."),
  description: z.string().describe("A general description of the medicine."),
  usage: z.string().describe("Instructions on how to use the medicine."),
  sideEffects: z.string().describe("Potential side effects of the medicine."),
  contraindications: z.string().describe("When not to use the medicine (contraindications)."),
});
export type DoriInfoOutput = z.infer<typeof DoriInfoOutputSchema>;

export async function getDoriInfo(input: DoriInfoInput): Promise<DoriInfoOutput> {
  return doriInfoFlow(input);
}

const doriInfoPrompt = ai.definePrompt({
  name: 'doriInfoPrompt',
  input: { schema: DoriInfoInputSchema },
  output: { schema: DoriInfoOutputSchema },
  prompt: `Siz farmatsevt bo'yicha mutaxassissiz. Sizga dori nomi beriladi va siz shu dori haqida batafsil ma'lumot taqdim etishingiz kerak. Agar dori topilmasa, "found" maydonini 'false' qilib, boshqa maydonlarni bo'sh qoldiring. Agar topilsa, "found" maydonini 'true' qiling va quyidagi ma'lumotlarni O'zbek tilida, ilmiy va tushunarli tilda taqdim eting:

Dori nomi: {{{medicineName}}}

Javobingizni quyidagi formatda tuzing:
- Dori nomi (name)
- Umumiy tavsif (description)
- Qo'llanilishi (usage)
- Nojo'ya ta'sirlari (sideEffects)
- Qo'llash mumkin bo'lmagan holatlar (contraindications)
`,
});

const doriInfoFlow = ai.defineFlow(
  {
    name: 'doriInfoFlow',
    inputSchema: DoriInfoInputSchema,
    outputSchema: DoriInfoOutputSchema,
  },
  async (input) => {
    const { output } = await doriInfoPrompt(input);
    if (!output) {
      throw new Error('Failed to get medicine information.');
    }
    return output;
  }
);
