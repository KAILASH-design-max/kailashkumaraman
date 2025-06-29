
import { ProductDetailClient } from '@/components/customer/ProductDetailClient';
import { mockCategories } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, limit, getDocs, Timestamp, orderBy } from 'firebase/firestore';

// Helper to convert Firestore Timestamps and shape the data
function serializeProduct(doc: any): Product {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        category: data.category || '',
        images: data.images || [],
        rating: data.rating,
        reviewsCount: data.reviewsCount,
        stock: data.stock || 0,
        lowStockThreshold: data.lowStockThreshold,
        weight: data.weight,
        status: data.status || 'inactive',
        origin: data.origin,
        popularity: data.popularity,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    };
}

async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      console.warn(`Product with ID ${id} not found.`);
      return undefined;
    }
    
    return serializeProduct(productSnap);
  } catch (error) {
    console.error(`Error fetching product by ID ${id}:`, error);
    return undefined;
  }
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
    if (!product.category) return [];
    try {
        const productsRef = collection(db, 'products');
        // Query for other products in the same category, sorted by popularity, excluding the current product.
        const q = query(
            productsRef, 
            where('category', '==', product.category), 
            where('status', '==', 'active'),
            orderBy('popularity', 'desc'),
            limit(5) // fetch 5 and filter out the current one
        );
        const querySnapshot = await getDocs(q);
        const related: Product[] = [];
        querySnapshot.forEach((doc) => {
            if (doc.id !== product.id) {
                related.push(serializeProduct(doc));
            }
        });
        return related.slice(0, 4); // return at most 4
    } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
    }
}

export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  const { productId } = params;
  
  if (!productId) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }
  
  // Fetch related products and category name in parallel
  const [relatedProducts, categoryNameResult] = await Promise.all([
    getRelatedProducts(product),
    Promise.resolve(mockCategories.find(c => c.id === product.category)?.name) // Still using mockCategories for this
  ]);

  return (
    <ProductDetailClient 
      product={product} 
      relatedProducts={relatedProducts} 
      categoryName={categoryNameResult}
    />
  );
}
