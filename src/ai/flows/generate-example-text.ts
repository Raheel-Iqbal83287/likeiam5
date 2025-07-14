'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating example complex texts and their simplified explanations.
 *
 * It includes:
 * - `generateExampleText`: An asynchronous function that generates example text and its simplified explanation.
 * - `GenerateExampleTextInput`: The input type for the generateExampleText function.
 * - `GenerateExampleTextOutput`: The output type for the generateExampleText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExampleTextInputSchema = z.object({
  complexText: z.string().describe('The complex text to be simplified.'),
});
export type GenerateExampleTextInput = z.infer<typeof GenerateExampleTextInputSchema>;

const GenerateExampleTextOutputSchema = z.object({
  simplifiedText: z.string().describe('The simplified explanation of the complex text.'),
});
export type GenerateExampleTextOutput = z.infer<typeof GenerateExampleTextOutputSchema>;

export async function generateExampleText(input: GenerateExampleTextInput): Promise<GenerateExampleTextOutput> {
  return generateExampleTextFlow(input);
}

const simplifyTextPrompt = ai.definePrompt({
  name: 'simplifyTextPrompt',
  input: {schema: GenerateExampleTextInputSchema},
  output: {schema: GenerateExampleTextOutputSchema},
  prompt: `You are an expert at simplifying complex text so that a 5-year-old can understand it.

  Pretend you are talking to a very young child. Use simple words. Use short sentences. Use analogies a 5-year-old would understand. For example, instead of "harness energy from sunlight", you could say "eat sunlight for food".

  Please simplify the following text:
  {{complexText}}`,
});

const generateExampleTextFlow = ai.defineFlow(
  {
    name: 'generateExampleTextFlow',
    inputSchema: GenerateExampleTextInputSchema,
    outputSchema: GenerateExampleTextOutputSchema,
  },
  async input => {
    const {output} = await simplifyTextPrompt(input);
    return output!;
  }
);
