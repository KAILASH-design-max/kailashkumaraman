
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
      <Card className="bg-gray-50 shadow-md rounded-lg border border-gray-200">
        <CardHeader className="text-center pt-4 pb-2">
          <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary mr-2" />
            Get Product Recommendations
          </CardTitle>
          <CardDescription className="text-md text-muted-foreground max-w-2xl mx-auto mt-1 px-2">
            Tell us what you&apos;re looking for (e.g., &quot;healthy breakfast items&quot;, &quot;dinner for two&quot;, &quot;party snacks&quot;) and we&apos;ll suggest some items!
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-xl mx-auto pb-4 px-4">
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
              />
              <Button 
                type="submit" 
                className="h-11 text-sm font-medium text-white px-4 rounded-md" 
                style={{ backgroundColor: '#4F63AC' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#40529B'} // Darken color on hover
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4F63AC'} // Reset color on mouse out
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1.5 h-4 w-4" />
                )}
                Suggest Items
              </Button>
            </div>
          </form>

          {isLoading && (
            <div className="mt-4 flex items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Getting suggestions...</span>
            </div>
          )}

          {error && !isLoading && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Oops!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!isLoading && !suggestionsOutput && !error && !query.trim() && (
             <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm">
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
                  <h3 className="text-lg font-semibold mb-2 text-center text-primary">Here are some ideas:</h3>
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
