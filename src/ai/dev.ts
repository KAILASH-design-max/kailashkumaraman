
import { config } from 'dotenv';
config();

import '@/ai/flows/personalize-product-recommendations.ts';
import '@/ai/flows/generate-smart-shopping-list.ts';
import '@/ai/flows/generate-dietary-recommendations.ts';
import '@/ai/flows/generate-cart-recipe-flow.ts';
import '@/ai/flows/suggest-products-flow.ts'; // Added new flow
