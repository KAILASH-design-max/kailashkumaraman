'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, AlertCircle, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { suggestProducts, type SuggestProductsOutput } from '@/ai/flows/suggest-products-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function ProductSuggester() {
  const [query, setQuery] = useState('');
  const [suggestionsOutput, setSuggestionsOutput] = useState<SuggestProductsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter what you're looking for.");
      setSuggestionsOutput(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestionsOutput(null);

    try {
      const result = await suggestProducts({ query });
      setSuggestionsOutput(result);
    } catch (err) {
      console.error("Error getting product suggestions:", err);
      setError("Sorry, we couldn't get suggestions at this time. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mb-12">
      <Card className="shadow-xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20">
        <CardHeader className="text-center pt-8 pb-4">
          <div className="flex items-center justify-center mb-3">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Get Product Recommendations
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2 px-2">
            Tell us what you&apos;re looking for (e.g., &quot;healthy breakfast items&quot;, &quot;dinner for two&quot;, &quot;party snacks&quot;) and we&apos;ll suggest some items!
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-xl mx-auto pb-8 px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error && e.target.value.trim()) setError(null); // Clear error on new input
              }}
              placeholder="e.g., 'quick lunch ideas'"
              className="h-12 text-base border-border focus:border-primary focus:ring-primary"
              aria-label="Product suggestion query"
            />
            <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              Suggest Items ✨
            </Button>
          </form>

          {isLoading && (
            <div className="mt-6 flex items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Getting suggestions...</span>
            </div>
          )}

          {error && !isLoading && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Oops!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {suggestionsOutput && !isLoading && (
            <div className="mt-8 p-6 bg-background rounded-lg shadow-md">
              {suggestionsOutput.message && (!suggestionsOutput.suggestedProducts || suggestionsOutput.suggestedProducts.length === 0) && (
                <Alert variant="default" className="border-primary/50">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">AI Suggestion</AlertTitle>
                  <AlertDescription>{suggestionsOutput.message}</AlertDescription>
                </Alert>
              )}
              {suggestionsOutput.suggestedProducts && suggestionsOutput.suggestedProducts.length > 0 && (
                <>
                  <h3 className="text-xl font-semibold mb-3 text-center text-primary">Here are some ideas:</h3>
                  <ul className="space-y-2 list-disc list-inside bg-secondary/30 p-4 rounded-md">
                    {suggestionsOutput.suggestedProducts.map((item, index) => (
                      <li key={index} className="text-card-foreground">{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
          
          {!isLoading && !suggestionsOutput && !error && !query.trim() && (
             <p className="mt-6 text-center text-muted-foreground italic">
                Type a query above to get suggestions.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
