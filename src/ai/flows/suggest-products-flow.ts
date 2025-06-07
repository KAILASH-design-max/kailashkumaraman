'use server';
/**
 * @fileOverview AI agent that suggests products based on a user's query.
 *
 * - suggestProducts - A function that handles product suggestions.
 * - SuggestProductsInput - The input type for the suggestProducts function.
 * - SuggestProductsOutput - The return type for the suggestProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductsInputSchema = z.object({
  query: z.string().describe('The user\'s query for product suggestions (e.g., "healthy breakfast items", "dinner for two").'),
});
export type SuggestProductsInput = z.infer<typeof SuggestProductsInputSchema>;

const SuggestProductsOutputSchema = z.object({
  suggestedProducts: z.array(z.string()).describe('A list of suggested product names or brief descriptions relevant to the query.'),
  message: z.string().optional().describe('An optional message, e.g., if no specific products could be found or to provide context.')
});
export type SuggestProductsOutput = z.infer<typeof SuggestProductsOutputSchema>;

export async function suggestProducts(input: SuggestProductsInput): Promise<SuggestProductsOutput> {
  return suggestProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductsPrompt',
  input: {schema: SuggestProductsInputSchema},
  output: {schema: SuggestProductsOutputSchema},
  prompt: `You are a helpful shopping assistant for SpeedyShop, an online grocery store.
A user is looking for product suggestions based on their query.
Your goal is to provide a list of 3-5 relevant product names or short descriptions that would typically be found in a grocery store.

User Query: "{{{query}}}"

Based on this query, suggest suitable products. If the query is too vague or doesn't directly map to grocery items, provide a helpful message in the 'message' field and an empty 'suggestedProducts' list.
Ensure your suggestions are concise and directly address the query.
Do not suggest categories, but specific types of products. For example, if the query is "fruit", suggest "Apples, Bananas, Oranges" not "Fresh Produce".
`,
});

const suggestProductsFlow = ai.defineFlow(
  {
    name: 'suggestProductsFlow',
    inputSchema: SuggestProductsInputSchema,
    outputSchema: SuggestProductsOutputSchema,
  },
  async (input: SuggestProductsInput) => {
    if (!input.query.trim()) {
      return {
        suggestedProducts: [],
        message: 'Please enter a query to get product suggestions.'
      };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
