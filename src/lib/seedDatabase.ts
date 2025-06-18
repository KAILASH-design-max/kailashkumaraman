// src/lib/seedDatabase.ts
import { db } from './firebase';
import { mockProducts } from './mockData';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Product } from './types';

/**
 * Seeds the Firestore 'products' collection with data from mockProducts.
 * This script will upload all product details, including imageUrl and price.
 * It uses the `createdAt` ISO string from mockData, which Firestore converts to a Timestamp.
 * If a truly server-generated timestamp is needed for the seed itself,
 * you would replace `product.createdAt` with `serverTimestamp()` for that specific field.
 */
export async function seedProducts() {
  console.log('Starting to seed products to Firestore...');
  const productsCollection = collection(db, 'products');
  let successCount = 0;
  let errorCount = 0;

  for (const product of mockProducts) {
    try {
      // The `id` field from mockProducts is not needed as Firestore auto-generates document IDs.
      // We create a new object without the 'id' property.
      const { id, ...productData } = product;

      // The product.createdAt from mockData is already an ISO string.
      // Firestore can automatically convert valid ISO 8601 date strings to Timestamp objects.
      await addDoc(productsCollection, productData);
      successCount++;
      console.log(`Successfully added product: ${product.name}`);
    } catch (e) {
      errorCount++;
      console.error(`Error adding product ${product.name}: `, e);
    }
  }

  console.log(`\nSeeding finished.`);
  console.log(`Successfully added ${successCount} products.`);
  if (errorCount > 0) {
    console.error(`Failed to add ${errorCount} products.`);
  }
}

// Example of how to potentially run this script (e.g., using a tool like tsx):
// npx tsx src/lib/seedDatabase.ts
// To make it directly runnable, you might uncomment the following:
/*
if (typeof require !== 'undefined' && require.main === module) {
  seedProducts()
    .then(() => {
      console.log('Database seeding script completed successfully.');
      // process.exit(0); // Typically needed for standalone scripts
    })
    .catch((error) => {
      console.error('Database seeding script failed:', error);
      // process.exit(1); // Typically needed for standalone scripts
    });
}
*/

// Note: For a Next.js app, you might integrate this into an API route
// or run it as a separate script during your deployment or setup process.
