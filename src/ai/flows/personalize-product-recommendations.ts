// src/ai/flows/personalize-product-recommendations.ts
'use server';
/**
 * @fileOverview AI-powered flow to provide personalized product recommendations based on user history.
 *
 * - personalizeProductRecommendations - A function that generates personalized product recommendations for a user.
 * - PersonalizeProductRecommendationsInput - The input type for the personalizeProductRecommendations function.
 * - PersonalizeProductRecommendationsOutput - The return type for the personalizeProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeProductRecommendationsInputSchema = z.object({
  userId: z.string().describe('The unique identifier of the user.'),
  pastPurchases: z.string().describe('A list of the user\'s past purchases, as a comma-separated string of product names.'),
  browsingHistory: z.string().describe('A list of the user\'s browsing history, as a comma-separated string of product names.'),
  preferences: z.string().describe('A list of the user\'s stated preferences, as a comma-separated string of product categories.'),
});
export type PersonalizeProductRecommendationsInput = z.infer<typeof PersonalizeProductRecommendationsInputSchema>;

const PersonalizeProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z.array(z.string()).describe('A list of personalized product recommendations for the user.'),
});
export type PersonalizeProductRecommendationsOutput = z.infer<typeof PersonalizeProductRecommendationsOutputSchema>;

export async function personalizeProductRecommendations(input: PersonalizeProductRecommendationsInput): Promise<PersonalizeProductRecommendationsOutput> {
  return personalizeProductRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeProductRecommendationsPrompt',
  input: {schema: PersonalizeProductRecommendationsInputSchema},
  output: {schema: PersonalizeProductRecommendationsOutputSchema},
  prompt: `You are an AI assistant specializing in generating personalized product recommendations for e-commerce users.

  Based on the user's past purchases, browsing history, and stated preferences, you will generate a list of product recommendations that the user is likely to be interested in.

  Past Purchases: {{{pastPurchases}}}
  Browsing History: {{{browsingHistory}}}
  Preferences: {{{preferences}}}

  Recommended Products:`, // The LLM will complete the list of recommended products.
});

const personalizeProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizeProductRecommendationsFlow',
    inputSchema: PersonalizeProductRecommendationsInputSchema,
    outputSchema: PersonalizeProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      recommendedProducts: output!.recommendedProducts,
    };
  }
);
