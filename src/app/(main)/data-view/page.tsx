
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import type { Product, PromoCode } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Helper function to convert Firestore Timestamps to ISO strings for serialization
function serializeObject(obj: any): any {
  if (obj instanceof Timestamp) {
    return obj.toDate().toISOString();
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeObject);
  }
  if (typeof obj === 'object' && obj !== null) {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      newObj[key] = serializeObject(obj[key]);
    }
    return newObj;
  }
  return obj;
}


async function fetchActiveFruitProducts(): Promise<Partial<Product>[]> {
  const productsRef = collection(db, 'products');
  // Firestore does not support inequality checks on multiple fields.
  // We'll query for category and then filter for status in the code if needed.
  // A composite index would be required for this query in production.
  // For now, let's assume we can query both. If this fails, we will need to adjust.
  const q = query(productsRef, where('category', '==', 'Fruits'), where('status', '==', 'active'));
  
  const querySnapshot = await getDocs(q);

  const products: Partial<Product>[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    products.push({
      id: doc.id,
      name: data.name,
      price: data.price,
      stock: data.stock,
      rating: data.rating,
      popularity: data.popularity,
      weight: data.weight,
      origin: data.origin,
      images: data.images,
      lowStockThreshold: data.lowStockThreshold,
    });
  });

  return products;
}

async function fetchAllPromoCodes(): Promise<Partial<PromoCode>[]> {
    const promoCodesRef = collection(db, 'promoCodes');
    const querySnapshot = await getDocs(promoCodesRef);

    const promoCodes: Partial<PromoCode>[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Serialize the document data to handle Timestamps
        const serializedData = serializeObject(data);
        
        promoCodes.push({
            id: doc.id,
            code: serializedData.code,
            description: serializedData.description,
            discountType: serializedData.discountType,
            value: serializedData.value,
            minOrderValue: serializedData.minOrderValue,
            status: serializedData.status,
            usageLimit: serializedData.usageLimit,
            createdAt: serializedData.createdAt,
            updatedAt: serializedData.updatedAt,
            expiresAt: serializedData.expiresAt,
        });
    });
    
    return promoCodes;
}


export default async function DataViewPage() {
    let products: Partial<Product>[] = [];
    let promoCodes: Partial<PromoCode>[] = [];
    let productError: string | null = null;
    let promoCodeError: string | null = null;

    try {
        products = await fetchActiveFruitProducts();
    } catch (e: any) {
        console.error("Error fetching products:", e);
        productError = "Failed to fetch products. This might be due to a missing Firestore index. Please check the server logs for an index creation link and create the required index in your Firebase console. The query requires a composite index on 'category' (ascending) and 'status' (ascending).";
    }

    try {
        promoCodes = await fetchAllPromoCodes();
    } catch (e: any) {
        console.error("Error fetching promo codes:", e);
        promoCodeError = e.message || "An unknown error occurred while fetching promo codes.";
    }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Firestore Data View</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Fruit Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productError ? (
                <p className="text-destructive whitespace-pre-wrap">{productError}</p>
            ) : products.length > 0 ? (
              <pre className="text-xs bg-muted p-4 rounded-md overflow-x-auto max-h-[600px]">
                {JSON.stringify(products, null, 2)}
              </pre>
            ) : (
              <p>No active fruit products found.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>All Promo Codes</CardTitle>
          </CardHeader>
          <CardContent>
            {promoCodeError ? (
                <p className="text-destructive">{promoCodeError}</p>
            ) : promoCodes.length > 0 ? (
              <pre className="text-xs bg-muted p-4 rounded-md overflow-x-auto max-h-[600px]">
                {JSON.stringify(promoCodes, null, 2)}
              </pre>
            ) : (
              <p>No promo codes found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
