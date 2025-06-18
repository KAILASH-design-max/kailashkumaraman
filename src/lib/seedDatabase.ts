
// src/lib/seedDatabase.ts
import { db } from './firebase';
import { mockProducts } from './mockData';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore'; // Added Timestamp
import type { Product } from './types';

/**
 * Seeds the Firestore 'products' collection with data from mockProducts.
 * It aligns with the new schema including 'stock', 'status', and 'weight'.
 * It converts the 'createdAt' ISO string from mockData to a Firestore Timestamp.
 */
export async function seedProducts() {
  console.log('Starting to seed products to Firestore...');
  const productsCollection = collection(db, 'products');
  let successCount = 0;
  let errorCount = 0;

  for (const mockProduct of mockProducts) {
    try {
      // The `id` field from mockProducts is used for client-side keying but
      // Firestore will auto-generate its own document IDs.
      // We destructure to exclude `id` and potentially other client-only fields if any.
      const { id, dataAiHint, ...productDataToSeed } = mockProduct;

      // Prepare the data ensuring `createdAt` is a Firestore Timestamp
      const finalProductData: Omit<Product, 'id' | 'dataAiHint'> & { createdAt: Timestamp } = {
        ...productDataToSeed,
        createdAt: Timestamp.fromDate(new Date(productDataToSeed.createdAt)), // Convert ISO string to Timestamp
      };
      
      // Ensure all fields from Product type (matching schema) are present
      // and undefined optional fields are handled correctly by Firestore.
      const dataForFirestore = {
        name: finalProductData.name,
        category: finalProductData.category,
        description: finalProductData.description,
        price: finalProductData.price,
        imageUrl: finalProductData.imageUrl,
        rating: finalProductData.rating,
        reviewsCount: finalProductData.reviewsCount,
        stock: finalProductData.stock,
        weight: finalProductData.weight,
        status: finalProductData.status,
        origin: finalProductData.origin,
        createdAt: finalProductData.createdAt,
        // Explicitly set optional fields to null if undefined, or omit them.
        // Firestore handles omitted fields fine.
      };

      await addDoc(productsCollection, dataForFirestore);
      successCount++;
      console.log(`Successfully added product: ${mockProduct.name}`);
    } catch (e) {
      errorCount++;
      console.error(`Error adding product ${mockProduct.name}: `, e);
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
/*
if (typeof require !== 'undefined' && require.main === module) {
  seedProducts()
    .then(() => {
      console.log('Database seeding script completed successfully.');
      process.exit(0); // Typically needed for standalone scripts
    })
    .catch((error) => {
      console.error('Database seeding script failed:', error);
      process.exit(1); // Typically needed for standalone scripts
    });
}
*/
