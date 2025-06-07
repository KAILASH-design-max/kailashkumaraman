
'use server';
/**
 * @fileOverview AI agent that generates a recipe based on items in a shopping cart.
 *
 * - generateCartRecipe - A function that handles the recipe generation.
 * - GenerateCartRecipeInput - The input type for the generateCartRecipe function.
 * - GenerateCartRecipeOutput - The return type for the generateCartRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCartRecipeInputSchema = z.object({
  cartItems: z
    .array(z.string())
    .describe('A list of product names in the user\'s shopping cart.'),
});
export type GenerateCartRecipeInput = z.infer<
  typeof GenerateCartRecipeInputSchema
>;

const GenerateCartRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z
    .array(z.string())
    .describe(
      'A list of ingredients required for the recipe. These should primarily come from the cart items, but can include common pantry staples if necessary.'
    ),
  instructions: z
    .string()
    .describe(
      'Step-by-step instructions to prepare the recipe, formatted as a single string with newline characters separating steps.'
    ),
  notes: z
    .string()
    .optional()
    .describe(
      'Optional notes or tips for the recipe, e.g., serving suggestions, variations, or if a coherent recipe cannot be formed.'
    ),
  isPossible: z
    .boolean()
    .describe(
      'Set to false if a coherent recipe cannot be formed from the cart items. In this case, the recipeName, ingredients, and instructions might be minimal or reflect this impossibility, and notes should explain why.'
    ),
});
export type GenerateCartRecipeOutput = z.infer<
  typeof GenerateCartRecipeOutputSchema
>;

export async function generateCartRecipe(
  input: GenerateCartRecipeInput
): Promise<GenerateCartRecipeOutput> {
  return generateCartRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCartRecipePrompt',
  input: {schema: GenerateCartRecipeInputSchema},
  output: {schema: GenerateCartRecipeOutputSchema},
  prompt: `You are a creative chef. Based on the following items in the user's shopping cart, generate a delicious recipe.
Prioritize using the cart items. You can assume common pantry staples like salt, pepper, oil, and basic spices are available if needed.

Cart Items:
{{#each cartItems}}
- {{{this}}}
{{/each}}

Please provide the recipe name, a list of ingredients, step-by-step instructions (as a single string with clear steps, using newlines to separate steps), and any optional notes.
If the cart items don't seem to form a cohesive recipe, set the 'isPossible' output field to false. In this case, the recipeName, ingredients, and instructions might be minimal or reflect this impossibility, and the 'notes' field should explain why a recipe could not be formed or suggest very simple uses for the items. Otherwise, set 'isPossible' to true.
`,
});

const generateCartRecipeFlow = ai.defineFlow(
  {
    name: 'generateCartRecipeFlow',
    inputSchema: GenerateCartRecipeInputSchema,
    outputSchema: GenerateCartRecipeOutputSchema,
  },
  async input => {
    if (input.cartItems.length === 0) {
        return {
            recipeName: "No items in cart",
            ingredients: [],
            instructions: "Please add items to your cart to generate a recipe.",
            notes: "Add some items to your cart first!",
            isPossible: false,
        };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
