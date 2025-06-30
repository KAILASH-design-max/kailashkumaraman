
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Clock, Search, TrendingUp, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
        dataAiHint: data.dataAiHint,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString()
    };
}

export default function SearchPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    
    const [isLoadingTrending, setIsLoadingTrending] = useState(true);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    // --- Hooks and Data Fetching ---

    useEffect(() => {
        // Load recent searches from localStorage
        const storedSearches = localStorage.getItem('speedyShopRecentSearches');
        if (storedSearches) {
            setRecentSearches(JSON.parse(storedSearches));
        }

        // Fetch trending products on initial load
        const fetchTrending = async () => {
            setIsLoadingTrending(true);
            try {
                const q = query(collection(db, "products"), where('status', '==', 'active'), orderBy("popularity", "desc"), limit(10));
                const snapshot = await getDocs(q);
                const products = snapshot.docs.map(serializeProduct);
                setTrendingProducts(products);
            } catch (error) {
                console.error("Error fetching trending products:", error);
            } finally {
                setIsLoadingTrending(false);
            }
        };
        fetchTrending();
    }, []);

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Fetch live suggestions based on debounced search term
    useEffect(() => {
        if (debouncedSearchTerm.length > 1) {
            setIsLoadingSuggestions(true);
            const fetchSuggestions = async () => {
                try {
                    // Firestore is case-sensitive, so this will only match prefixes with the same case.
                    // A more robust solution would use a dedicated search service (e.g., Algolia)
                    // or a client-side search on a pre-fetched list for full case-insensitivity.
                    const searchTermLower = debouncedSearchTerm.toLowerCase();
                    const q = query(
                        collection(db, "products"),
                        orderBy('name'),
                        where('name', '>=', debouncedSearchTerm),
                        where('name', '<=', debouncedSearchTerm + '\uf8ff'),
                        limit(5)
                    );
                    const snapshot = await getDocs(q);
                    const suggestedProducts = snapshot.docs.map(serializeProduct);
                    setSuggestions(suggestedProducts);
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                    setSuggestions([]);
                } finally {
                    setIsLoadingSuggestions(false);
                }
            };
            fetchSuggestions();
        } else {
            setSuggestions([]);
            setIsLoadingSuggestions(false);
        }
    }, [debouncedSearchTerm]);

    // --- Helper Functions ---

    const addSearchTerm = (term: string) => {
        const cleanedTerm = term.trim();
        if (!cleanedTerm) return;
        
        const updatedSearches = [cleanedTerm, ...recentSearches.filter(s => s !== cleanedTerm)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('speedyShopRecentSearches', JSON.stringify(updatedSearches));
    };

    const handleSearchSubmit = (term: string) => {
        const cleanedTerm = term.trim();
        if (!cleanedTerm) return;

        addSearchTerm(cleanedTerm);
        router.push(`/products?q=${encodeURIComponent(cleanedTerm)}`);
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('speedyShopRecentSearches');
    };

    // --- Render Functions ---

    const renderInitialState = () => (
        <>
            {recentSearches.length > 0 && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold flex items-center"><Clock className="mr-2 h-5 w-5 text-muted-foreground"/> Recent Searches</h2>
                        <Button variant="link" size="sm" onClick={clearRecentSearches} className="text-primary">Clear</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {recentSearches.map(term => (
                            <Button key={term} variant="outline" size="sm" className="bg-secondary/50" onClick={() => handleSearchSubmit(term)}>{term}</Button>
                        ))}
                    </div>
                </div>
            )}
            <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-muted-foreground"/> Trending</h2>
                {isLoadingTrending ? renderTrendingSkeletons() : renderTrendingGrid()}
            </div>
        </>
    );

    const renderSuggestionsState = () => (
        <div>
            {isLoadingSuggestions ? (
                <div className="text-muted-foreground p-4 text-center">Loading suggestions...</div>
            ) : (
                suggestions.length > 0 ? (
                    suggestions.map(product => (
                        <Link key={product.id} href={`/products/${product.id}`} className="flex items-center gap-3 p-3 -mx-2 rounded-md hover:bg-muted" onClick={() => addSearchTerm(product.name)}>
                           <Search className="h-4 w-4 text-muted-foreground"/>
                           <span className="flex-grow">{product.name}</span>
                        </Link>
                    ))
                ) : (
                    <p className="text-muted-foreground p-4 text-center">No suggestions found for &quot;{debouncedSearchTerm}&quot;</p>
                )
            )}
        </div>
    );

    const renderTrendingGrid = () => (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {trendingProducts.map(product => (
                <Link key={product.id} href={`/products/${product.id}`} className="group block text-center" onClick={() => addSearchTerm(product.name)}>
                    <div className="relative aspect-square w-full bg-card p-2 rounded-lg border overflow-hidden">
                        <Image src={product.images[0]} alt={product.name} fill sizes="20vw" className="object-contain group-hover:scale-105 transition-transform" data-ai-hint={product.dataAiHint || 'trending product'}/>
                    </div>
                    <p className="text-xs mt-1.5 truncate text-muted-foreground group-hover:text-primary">{product.name}</p>
                </Link>
            ))}
        </div>
    );

    const renderTrendingSkeletons = () => (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                    <Skeleton className="w-full aspect-square rounded-lg" />
                    <Skeleton className="h-3 w-4/5 rounded" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="h-screen bg-background flex flex-col">
            <header className="p-3 border-b sticky top-0 bg-background z-10">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchTerm)}
                            placeholder="Search for atta, dal, coke..."
                            className="w-full pl-9"
                            autoFocus
                        />
                        {searchTerm && (
                             <Button variant="ghost" size="icon" onClick={() => setSearchTerm('')} className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7">
                                <X className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-grow overflow-y-auto p-4">
                {debouncedSearchTerm.length > 1 ? renderSuggestionsState() : renderInitialState()}
            </main>
        </div>
    );
}
