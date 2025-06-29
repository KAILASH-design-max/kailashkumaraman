
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/customer/ProductCard';
import type { Product, Category } from '@/lib/types';
import { mockCategories } from '@/lib/mockData';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PackageSearch, AlertCircle, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, QueryConstraint, Timestamp } from 'firebase/firestore';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to safely serialize product data from Firestore
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

const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Rating: High to Low' },
    { value: 'newest', label: 'Newest First' },
];

export default function ProductsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const selectedCategory = searchParams.get('category') || 'all';
    const currentSort = searchParams.get('sort') || 'popularity';
    const searchQuery = searchParams.get('q') || '';

    const createQueryString = useCallback(
        (params: Record<string, string>) => {
            const newSearchParams = new URLSearchParams(searchParams.toString());
            for (const [key, value] of Object.entries(params)) {
                if (value === null || value === undefined || (key === 'category' && value === 'all') || (key === 'sort' && value === 'popularity')) {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, value);
                }
            }
            return newSearchParams.toString();
        },
        [searchParams]
    );

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const productsCollection = collection(db, 'products');
                const constraints: QueryConstraint[] = [where('status', '==', 'active')];

                if (selectedCategory && selectedCategory !== 'all') {
                    constraints.push(where('category', '==', selectedCategory));
                }

                switch (currentSort) {
                    case 'price-asc':
                        constraints.push(orderBy('price', 'asc'));
                        break;
                    case 'price-desc':
                        constraints.push(orderBy('price', 'desc'));
                        break;
                    case 'rating-desc':
                        constraints.push(orderBy('rating', 'desc'));
                        break;
                    case 'newest':
                        constraints.push(orderBy('createdAt', 'desc'));
                        break;
                    case 'popularity':
                    default:
                        constraints.push(orderBy('popularity', 'desc'));
                        break;
                }

                const q = query(productsCollection, ...constraints);
                const querySnapshot = await getDocs(q);
                
                const fetchedProducts: Product[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedProducts.push(serializeProduct(doc));
                });
                
                setProducts(fetchedProducts);
            } catch (e: any) {
                console.error("Error fetching products from Firestore:", e);
                if (e.code === 'failed-precondition' && e.message.includes('index')) {
                     setError(`A Firestore index is required for this filter/sort combination. Please check the server logs for a link to create the necessary index in your Firebase console. The query on the 'products' collection requires an index on fields used in 'where' and 'orderBy' clauses (e.g., 'category' and '${currentSort.split('-')[0]}').`);
                } else {
                    setError(`An unexpected error occurred while fetching products. Error: ${e.message}`);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, currentSort]);

    const handleFilterChange = (type: 'category' | 'sort', value: string) => {
        router.push(`/products?${createQueryString({ [type]: value })}`);
    };

    const handleClearFilters = () => {
        router.push('/products');
    };

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;
        return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [products, searchQuery]);
    
    const renderSkeletons = () => (
        Array.from({ length: 12 }).map((_, index) => (
             <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                 <Skeleton className="h-8 w-full" />
            </div>
        ))
    );

    // Dynamic heading logic
    const categoryInfo = selectedCategory !== 'all' 
        ? mockCategories.find(c => c.id === selectedCategory) 
        : null;
    let pageTitle = categoryInfo ? categoryInfo.name : 'All Products';
    let pageDescription = categoryInfo 
        ? `Browse our selection of fresh ${categoryInfo.name}.`
        : 'Browse our wide selection of available products.';

    if (searchQuery) {
        pageTitle = `Search results for "${searchQuery}"`;
        pageDescription = `${filteredProducts.length} products found.`;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-2">{pageTitle}</h1>
                <p className="text-muted-foreground">{pageDescription}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 bg-muted/50 rounded-lg border items-end">
                <div className="lg:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <Select value={selectedCategory} onValueChange={(value) => handleFilterChange('category', value)}>
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Filter by category..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {mockCategories.map((cat: Category) => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="lg:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Sort By</label>
                    <Select value={currentSort} onValueChange={(value) => handleFilterChange('sort', value)}>
                        <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Sort products..." />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {(selectedCategory !== 'all' || currentSort !== 'popularity' || searchQuery) && (
                     <div className="lg:col-span-4 flex justify-end">
                        <Button variant="ghost" onClick={handleClearFilters} className="w-full sm:w-auto h-10">Clear All Filters</Button>
                    </div>
                )}
            </div>
            
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {renderSkeletons()}
                </div>
            ) : error ? (
                <Alert variant="destructive" className="max-w-2xl mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Fetching Products</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap">{error}</AlertDescription>
                </Alert>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredProducts.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-4">No Products Found</h2>
                    <p className="text-muted-foreground">
                        {searchQuery ? `No products match your search for "${searchQuery}".` : "Try adjusting your filters or check back later."}
                    </p>
                </div>
            )}
        </div>
    );
}
