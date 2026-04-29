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

// Simplified output schema
const DoriInfoOutputSchema = z.object({
  found: z.boolean().describe("Whether information for the medicine was found."),
  info: z.string().describe("A markdown-formatted string containing the medicine's information, or an empty string if not found."),
});
export type DoriInfoOutput = z.infer<typeof DoriInfoOutputSchema>;

export async function getDoriInfo(input: DoriInfoInput): Promise<DoriInfoOutput> {
  return doriInfoFlow(input);
}

const doriInfoPrompt = ai.definePrompt({
  name: 'doriInfoPrompt',
  input: { schema: DoriInfoInputSchema },
  output: { schema: DoriInfoOutputSchema },
  prompt: `Siz farmatsevt bo'yicha mutaxassissiz. Sizga dori nomi beriladi va siz shu dori haqida batafsil ma'lumot taqdim etishingiz kerak. 
Agar dori topilmasa, "found" maydonini 'false' qilib, "info" maydonini bo'sh qoldiring.
Agar topilsa, "found" maydonini 'true' qiling va dori haqidagi ma'lumotni "info" maydoniga Markdown formatida, O'zbek tilida, ilmiy va tushunarli tilda yozib bering.
Ma'lumot quyidagilarni o'z ichiga olsin:
- **Umumiy tavsif**
- **Qo'llanilishi**
- **Nojo'ya ta'sirlari**
- **Qo'llash mumkin bo'lmagan holatlar**

Dori nomi: {{{medicineName}}}
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
      return { found: false, info: '' };
    }
    return output;
  }
);
