// src/ai/flows/generate-smart-shopping-list.ts
'use server';
/**
 * @fileOverview Generates a smart shopping list based on user data.
 *
 * - generateSmartShoppingList - A function that generates a personalized shopping list.
 * - GenerateSmartShoppingListInput - The input type for the generateSmartShoppingList function.
 * - GenerateSmartShoppingListOutput - The return type for the generateSmartShoppingList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSmartShoppingListInputSchema = z.object({
  recentPurchases: z
    .array(z.string())
    .describe('A list of the user recent purchases (item names).'),
  upcomingEvents: z
    .string()
    .describe('A description of any upcoming events or holidays.'),
  householdNeeds: z
    .string()
    .describe('Description of current household needs or deficiencies.'),
});
export type GenerateSmartShoppingListInput = z.infer<
  typeof GenerateSmartShoppingListInputSchema
>;

const GenerateSmartShoppingListOutputSchema = z.object({
  shoppingList: z
    .array(z.string())
    .describe('A list of items to purchase.'),
  reasoning: z
    .string()
    .describe('Explanation of why each item is included in the list.'),
});
export type GenerateSmartShoppingListOutput = z.infer<
  typeof GenerateSmartShoppingListOutputSchema
>;

export async function generateSmartShoppingList(
  input: GenerateSmartShoppingListInput
): Promise<GenerateSmartShoppingListOutput> {
  return generateSmartShoppingListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSmartShoppingListPrompt',
  input: {schema: GenerateSmartShoppingListInputSchema},
  output: {schema: GenerateSmartShoppingListOutputSchema},
  prompt: `You are a helpful shopping assistant. Based on the user's recent purchases, upcoming events, and stated household needs, generate a comprehensive shopping list. Provide a brief explanation for each item included in the list.

Recent Purchases: {{#each recentPurchases}}{{{this}}}, {{/each}}
Upcoming Events: {{{upcomingEvents}}}
Household Needs: {{{householdNeeds}}}

Shopping List:
`, // Ensure the AI provides the output in the requested JSON format
});

const generateSmartShoppingListFlow = ai.defineFlow(
  {
    name: 'generateSmartShoppingListFlow',
    inputSchema: GenerateSmartShoppingListInputSchema,
    outputSchema: GenerateSmartShoppingListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
