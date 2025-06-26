
import { ProductCard } from '@/components/customer/ProductCard';
import type { Product } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PackageSearch } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

// Helper to safely serialize product data from Firestore, handling Timestamps
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
        status: data.status || 'inactive',
        lowStockThreshold: data.lowStockThreshold,
        weight: data.weight,
        origin: data.origin,
        popularity: data.popularity,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : String(data.createdAt || ''),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : String(data.updatedAt || ''),
        dataAiHint: data.dataAiHint,
    };
}

async function fetchActiveProducts(): Promise<Product[]> {
  const productsCollection = collection(db, 'products');
  // Query for products where status is 'active'
  const q = query(productsCollection, where('status', '==', 'active'));
  
  const querySnapshot = await getDocs(q);
  const products: Product[] = [];
  querySnapshot.forEach((doc) => {
    products.push(serializeProduct(doc));
  });

  return products;
}

export default async function ProductsPage() {
    let products: Product[] = [];
    let productError: string | null = null;

    try {
        products = await fetchActiveProducts();
    } catch (e: any) {
        console.error("Error fetching products from Firestore:", e);
        if (e.code === 'failed-precondition') {
            productError = "A Firestore index is required to query products by status. Please check the server logs for a link to create the necessary index in your Firebase console. The query requires a single-field index on the 'status' field in the 'products' collection.";
        } else if (e.code === 'permission-denied') {
            productError = "Permission denied. Please check your Firestore security rules to ensure that you have permission to read from the 'products' collection.";
        } else {
            productError = `An unexpected error occurred while fetching products. Please check the console for more details. Error: ${e.message}`;
        }
    }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">All Products</h1>
        <p className="text-muted-foreground">Browse our wide selection of available products.</p>
      </div>
      
      {productError ? (
         <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTitle>Error Fetching Products</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">{productError}</AlertDescription>
        </Alert>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-4">No Products Found</h2>
          <p className="text-muted-foreground">
            There are currently no active products available. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}
