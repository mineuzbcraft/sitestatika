'use server';
/**
 * @fileOverview A Genkit flow for answering questions about Uzbek law.
 *
 * - answerHuquqimQuestion - A function that answers legal questions.
 * - HuquqimQuestionInput - The input type for the function.
 * - HuquqimQuestionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HuquqimQuestionInputSchema = z.object({
  question: z.string().describe('The legal question from the user.'),
});
export type HuquqimQuestionInput = z.infer<typeof HuquqimQuestionInputSchema>;

const HuquqimQuestionOutputSchema = z.object({
  answer: z.string().describe("A markdown-formatted string containing the answer to the legal question."),
});
export type HuquqimQuestionOutput = z.infer<typeof HuquqimQuestionOutputSchema>;

export async function answerHuquqimQuestion(input: HuquqimQuestionInput): Promise<HuquqimQuestionOutput> {
  return huquqimFlow(input);
}

const huquqimPrompt = ai.definePrompt({
  name: 'huquqimPrompt',
  input: { schema: HuquqimQuestionInputSchema },
  output: { schema: HuquqimQuestionOutputSchema },
  prompt: `Siz O'zbekiston qonunchiligi bo'yicha mutaxassis yuristsiz. Sizning vazifangiz yoshlarga oid huquqiy savollarga oddiy va tushunarli tilda javob berish. 
Javobingizni Markdown formatida, aniq va batafsil yozing. Iloji bo'lsa, O'zbekiston Respublikasining tegishli qonun hujjatlariga havolalar keltiring.

Foydalanuvchi savoli: {{{question}}}
`,
});

const huquqimFlow = ai.defineFlow(
  {
    name: 'huquqimFlow',
    inputSchema: HuquqimQuestionInputSchema,
    outputSchema: HuquqimQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await huquqimPrompt(input);
    if (!output) {
      return { answer: "Kechirasiz, hozirda javob berishda muammo yuzaga keldi. Iltimos, keyinroq qayta urinib ko'ring." };
    }
    return output;
  }
);
