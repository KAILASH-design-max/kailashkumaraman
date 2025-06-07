
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { generateSmartShoppingList, type GenerateSmartShoppingListInput, type GenerateSmartShoppingListOutput } from '@/ai/flows/generate-smart-shopping-list';
import { Loader2, ListChecks, Sparkles, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SmartShoppingListPage() {
  const [recentPurchases, setRecentPurchases] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState('');
  const [householdNeeds, setHouseholdNeeds] = useState('');
  const [shoppingListResult, setShoppingListResult] = useState<GenerateSmartShoppingListOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShoppingListResult(null);

    const purchasesArray = recentPurchases.split(/[\n,]+/).map(item => item.trim()).filter(item => item.length > 0);

    const input: GenerateSmartShoppingListInput = {
      recentPurchases: purchasesArray,
      upcomingEvents,
      householdNeeds,
    };

    try {
      const result = await generateSmartShoppingList(input);
      setShoppingListResult(result);
    } catch (err) {
      console.error("Error generating smart shopping list:", err);
      setError("Failed to generate shopping list. Please ensure your inputs are clear and try again. If the issue persists, the AI might be temporarily unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-10">
        <Sparkles className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          AI Smart Shopping List
        </h1>
        <p className="mt-3 text-xl text-muted-foreground sm:mt-4 max-w-2xl mx-auto">
          Tell us a bit about your current situation, and our AI will help you build a smart shopping list!
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Your Details</CardTitle>
            <CardDescription>Provide some context for the AI to generate a relevant list.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="recentPurchases" className="text-lg font-medium">Recent Purchases</Label>
                <p className="text-sm text-muted-foreground mb-1">List items you've bought recently, separated by commas or new lines.</p>
                <Textarea
                  id="recentPurchases"
                  value={recentPurchases}
                  onChange={(e) => setRecentPurchases(e.target.value)}
                  placeholder="e.g., Milk, Eggs, Bread, Apples, Chicken breast"
                  rows={4}
                  className="text-base"
                />
              </div>
              <div>
                <Label htmlFor="upcomingEvents" className="text-lg font-medium">Upcoming Events or Holidays</Label>
                 <p className="text-sm text-muted-foreground mb-1">Any special occasions coming up? (e.g., Birthday party, Diwali, Weekend BBQ)</p>
                <Textarea
                  id="upcomingEvents"
                  value={upcomingEvents}
                  onChange={(e) => setUpcomingEvents(e.target.value)}
                  placeholder="e.g., Weekend barbecue with friends, Son's birthday next week"
                  rows={3}
                  className="text-base"
                />
              </div>
              <div>
                <Label htmlFor="householdNeeds" className="text-lg font-medium">Current Household Needs</Label>
                <p className="text-sm text-muted-foreground mb-1">What are you running low on or need for the house?</p>
                <Textarea
                  id="householdNeeds"
                  value={householdNeeds}
                  onChange={(e) => setHouseholdNeeds(e.target.value)}
                  placeholder="e.g., Running low on toilet paper, need cleaning supplies for the kitchen, want to try a new pasta recipe"
                  rows={3}
                  className="text-base"
                />
              </div>
              <Button type="submit" className="w-full py-3 text-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate My Smart List
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="sticky top-24">
          <Card className={`shadow-lg ${isLoading || shoppingListResult || error ? 'min-h-[400px]' : 'min-h-[300px]'} flex flex-col justify-start`}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <ListChecks className="mr-3 h-7 w-7 text-primary" /> Your Generated List
              </CardTitle>
              <CardDescription>
                {isLoading ? "Our AI is thinking... 🧠 Please wait." : shoppingListResult ? "Here's what we came up with:" : "Your smart list will appear here once generated."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p>Crafting your personalized list...</p>
                </div>
              )}
              {error && !isLoading && (
                <Alert variant="destructive" className="my-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error Generating List</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {shoppingListResult && !isLoading && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-primary">Shopping List:</h3>
                    {shoppingListResult.shoppingList && shoppingListResult.shoppingList.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1.5 bg-secondary/30 p-4 rounded-md shadow-inner">
                        {shoppingListResult.shoppingList.map((item, index) => (
                          <li key={index} className="text-card-foreground text-base">{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No specific items were suggested based on your input. Try being more descriptive!</p>
                    )}
                  </div>
                  {shoppingListResult.reasoning && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-2 text-primary">Reasoning:</h3>
                      <p className="text-base text-muted-foreground bg-muted/30 p-4 rounded-md shadow-inner whitespace-pre-line">{shoppingListResult.reasoning}</p>
                    </div>
                  )}
                </div>
              )}
              {!isLoading && !shoppingListResult && !error && (
                <div className="text-center text-muted-foreground py-10">
                  <ListChecks className="mx-auto h-12 w-12 mb-4" />
                  <p>Fill in your details on the left and click "Generate My Smart List" to see your personalized shopping suggestions here.</p>
                </div>
              )}
            </CardContent>
             {shoppingListResult && !isLoading && (
              <CardFooter>
                <p className="text-xs text-muted-foreground italic"><Info className="inline h-3 w-3 mr-1"/>Remember, this is an AI suggestion. Always review and adjust to your specific needs!</p>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

    