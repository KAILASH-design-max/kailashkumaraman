// src/ai/flows/generate-dietary-recommendations.ts
'use server';
/**
 * @fileOverview AI agent that suggests personalized product recommendations and smart shopping lists to simplify user shopping.
 *
 * - generateDietaryRecommendations - A function that handles the generation of dietary recommendations.
 * - GenerateDietaryRecommendationsInput - The input type for the generateDietaryRecommendations function.
 * - GenerateDietaryRecommendationsOutput - The return type for the generateDietaryRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDietaryRecommendationsInputSchema = z.object({
  taste: z.string().describe('The user\u2019s taste preferences.'),
  dietaryRequirements: z.string().describe('The user\u2019s dietary requirements.'),
});
export type GenerateDietaryRecommendationsInput = z.infer<typeof GenerateDietaryRecommendationsInputSchema>;

const GenerateDietaryRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('A list of dietary recommendations based on the user\u2019s taste and dietary requirements.'),
});
export type GenerateDietaryRecommendationsOutput = z.infer<typeof GenerateDietaryRecommendationsOutputSchema>;

export async function generateDietaryRecommendations(input: GenerateDietaryRecommendationsInput): Promise<GenerateDietaryRecommendationsOutput> {
  return generateDietaryRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDietaryRecommendationsPrompt',
  input: {schema: GenerateDietaryRecommendationsInputSchema},
  output: {schema: GenerateDietaryRecommendationsOutputSchema},
  prompt: `You are a dietary expert. Generate dietary recommendations based on the user's taste and dietary requirements.

Taste: {{{taste}}}
Dietary Requirements: {{{dietaryRequirements}}}

Recommendations:`,
});

const generateDietaryRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateDietaryRecommendationsFlow',
    inputSchema: GenerateDietaryRecommendationsInputSchema,
    outputSchema: GenerateDietaryRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
