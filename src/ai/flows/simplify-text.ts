
// src/ai/flows/simplify-text.ts
'use server';
/**
 * @fileOverview A text simplification AI agent.
 *
 * - simplifyText - A function that simplifies complex text.
 * - SimplifyTextInput - The input type for the simplifyText function.
 * - SimplifyTextOutput - The return type for the simplifyText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimplifyTextInputSchema = z.object({
  complexText: z
    .string()
    .describe('The complex text that needs to be simplified.'),
});
export type SimplifyTextInput = z.infer<typeof SimplifyTextInputSchema>;

const SimplifyTextOutputSchema = z.object({
  simplifiedText: z
    .string()
    .describe('The simplified text, easy to understand for a 5-year-old.'),
});
export type SimplifyTextOutput = z.infer<typeof SimplifyTextOutputSchema>;

export async function simplifyText(input: SimplifyTextInput): Promise<SimplifyTextOutput> {
  return simplifyTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simplifyTextPrompt',
  input: {schema: SimplifyTextInputSchema},
  output: {schema: SimplifyTextOutputSchema},
  prompt: `You are an expert at explaining complicated things to a five-year-old.

Your goal is to make the explanation happy, exciting, and super easy to understand.

Here are your rules:
1.  **Use Simple Words:** Only use words a small child would know.
2.  **Use Short Sentences:** Keep your sentences short and sweet.
3.  **Use Fun Comparisons:** Compare the topic to things a kid loves, like animals, toys, or yummy food.
4.  **Be Cheerful:** Use a happy and excited tone! Add fun sounds if it helps!
5.  **Explain a Little More:** Make sure your answer is a few sentences long. Don't just give one sentence.
6.  **Use Emojis:** Add fun emojis like ✨, 🚀, or 🍎 to make it even more exciting!

**Good Example:**
If the text is: "Photosynthesis is how plants use sunlight to create food."
Your answer should be something like: "Wow! ☀️ Plants eat sunshine for lunch! It's like they're munching on sunbeams to get strong. It's their own special superpower! Zap! 💥"

Now, explain this to a five-year-old in a simple, happy way:

{{{complexText}}}`,
});

const simplifyTextFlow = ai.defineFlow(
  {
    name: 'simplifyTextFlow',
    inputSchema: SimplifyTextInputSchema,
    outputSchema: SimplifyTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

