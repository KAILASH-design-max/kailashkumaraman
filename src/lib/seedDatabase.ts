
// src/lib/seedDatabase.ts
import { db } from './firebase';
import { mockProducts } from './mockData';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
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
      // We destructure to exclude `id` and other client-only fields like `dataAiHint`.
      const { id, dataAiHint, ...productDataToSeed } = mockProduct;

      // Prepare the data ensuring createdAt and updatedAt are Firestore Timestamps
      const finalProductData: Omit<Product, 'id' | 'dataAiHint'> & { createdAt: Timestamp; updatedAt?: Timestamp } = {
        ...productDataToSeed,
        createdAt: Timestamp.fromDate(new Date(productDataToSeed.createdAt)),
        ...(productDataToSeed.updatedAt && { updatedAt: Timestamp.fromDate(new Date(productDataToSeed.updatedAt)) }),
      };
      
      const dataForFirestore = {
        name: finalProductData.name,
        category: finalProductData.category,
        description: finalProductData.description,
        price: finalProductData.price,
        images: finalProductData.images,
        rating: finalProductData.rating,
        reviewsCount: finalProductData.reviewsCount,
        stock: finalProductData.stock,
        lowStockThreshold: finalProductData.lowStockThreshold,
        weight: finalProductData.weight,
        status: finalProductData.status,
        origin: finalProductData.origin,
        popularity: finalProductData.popularity,
        createdAt: finalProductData.createdAt,
        updatedAt: finalProductData.updatedAt,
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
