
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, AlertCircle, Lightbulb, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { suggestProducts, type SuggestProductsOutput } from '@/ai/flows/suggest-products-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import Link from 'next/link';

const GUEST_USAGE_LIMIT = 2;

export function ProductSuggester() {
  const [query, setQuery] = useState('');
  const [suggestionsOutput, setSuggestionsOutput] = useState<SuggestProductsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [usageCount, setUsageCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      // If user logs in, reset guest count logic for them
      if (user) {
        setUsageCount(0);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('suggestionUsageCount');
        }
      }
    });

    if (typeof window !== 'undefined' && !auth.currentUser) {
        const storedCount = localStorage.getItem('suggestionUsageCount');
        setUsageCount(storedCount ? parseInt(storedCount, 10) : 0);
    }

    return () => unsubscribe();
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuggestionsOutput(null);

    if (!currentUser && usageCount >= GUEST_USAGE_LIMIT) {
      setError("You've reached the free usage limit. Please log in for unlimited suggestions.");
      return;
    }
    
    if (!query.trim()) {
      setError("Please enter what you're looking for.");
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await suggestProducts({ query });
      setSuggestionsOutput(result);

      if (!currentUser) {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem('suggestionUsageCount', newCount.toString());
      }

    } catch (err) {
      console.error("Error getting product suggestions:", err);
      setError("Sorry, we couldn't get suggestions at this time. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasReachedLimit = !currentUser && usageCount >= GUEST_USAGE_LIMIT;

  return (
    <section className="mb-12">
      <Card className="bg-gray-50 shadow-md rounded-lg border border-gray-200">
        <CardHeader className="pt-4 pb-2 px-4 text-left">
          <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center">
            <Sparkles className="h-6 w-6 text-primary mr-2" />
            Get Product Recommendations
          </CardTitle>
          <CardDescription className="text-md text-muted-foreground mt-1">
            Tell us what you&apos;re looking for (e.g., &quot;healthy breakfast items&quot;, &quot;dinner for two&quot;, &quot;party snacks&quot;) and we&apos;ll suggest some items!
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 px-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (error && e.target.value.trim()) setError(null);
                }}
                placeholder="e.g., 'quick lunch ideas'"
                className="h-11 text-base border-gray-300 focus:border-primary focus:ring-primary flex-grow rounded-md"
                aria-label="Product suggestion query"
                disabled={hasReachedLimit || authLoading}
              />
              <Button
                type="submit"
                className="h-11 text-sm font-medium text-white px-4 rounded-md"
                style={{ backgroundColor: '#4F63AC' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#40529B'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4F63AC'}
                disabled={isLoading || hasReachedLimit || authLoading}
              >
                {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                 isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                 hasReachedLimit ? <Lock className="mr-1.5 h-4 w-4" /> :
                 <Sparkles className="mr-1.5 h-4 w-4" />
                }
                {authLoading ? 'Verifying...' : hasReachedLimit ? 'Login to Suggest' : 'Suggest Items'}
              </Button>
            </div>
            {!currentUser && !hasReachedLimit && (
              <p className="text-xs text-muted-foreground text-center">
                You have {GUEST_USAGE_LIMIT - usageCount} free suggestion(s) remaining. <Link href="/login" className="underline text-primary">Login</Link> for unlimited use.
              </p>
            )}
          </form>

          {isLoading && !authLoading && (
            <div className="mt-4 flex items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Getting suggestions...</span>
            </div>
          )}

          {error && !isLoading && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{hasReachedLimit ? "Usage Limit Reached" : "Oops!"}</AlertTitle>
              <AlertDescription>
                {error}
                {hasReachedLimit && (
                  <Button asChild variant="link" className="p-0 h-auto ml-1">
                    <Link href="/login">Click here to log in.</Link>
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !suggestionsOutput && !error && !query.trim() && !hasReachedLimit && (
             <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm text-left">
                Please enter a query for recommendations.
            </div>
          )}

          {suggestionsOutput && !isLoading && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow">
              {suggestionsOutput.message && (!suggestionsOutput.suggestedProducts || suggestionsOutput.suggestedProducts.length === 0) && (
                <Alert variant="default" className="border-primary/50">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">AI Suggestion</AlertTitle>
                  <AlertDescription>{suggestionsOutput.message}</AlertDescription>
                </Alert>
              )}
              {suggestionsOutput.suggestedProducts && suggestionsOutput.suggestedProducts.length > 0 && (
                <>
                  <ul className="space-y-1.5 list-disc list-inside bg-secondary/20 p-3 rounded-md">
                    {suggestionsOutput.suggestedProducts.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
