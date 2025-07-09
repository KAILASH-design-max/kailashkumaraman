
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Bell, Mail, MessageSquare, Settings, Truck, TrendingDown, Gift, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp, type Timestamp } from 'firebase/firestore';
import type { NotificationSettings, NotificationPreferences } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const defaultSettings: NotificationSettings = {
  orderUpdates: { email: true, sms: false, push: true },
  priceDropAlerts: { email: true, sms: false, push: false },
  promotions: { email: true, sms: true, push: true },
  accountActivity: { email: true, sms: false, push: true },
};

const settingCategories = [
  { id: 'orderUpdates', label: 'Order & Shipping Updates', description: 'Get notified about order confirmation, processing, shipping, and delivery.', icon: Truck },
  { id: 'priceDropAlerts', label: 'Price Drop Alerts', description: 'Receive alerts when items on your wishlist or previously viewed products have a price drop.', icon: TrendingDown },
  { id: 'promotions', label: 'Exclusive Promotions & Offers', description: 'Stay informed about special deals, new arrivals, and personalized offers.', icon: Gift },
  { id: 'accountActivity', label: 'Account Activity', description: 'Important alerts regarding your account security and changes.', icon: Settings },
] as const;


export default function NotificationsPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setIsLoading(false);
        setSettings(null);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    const settingsDocRef = doc(db, 'NotificationSettings', currentUser.uid);

    const unsubscribeFirestore = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as NotificationSettings);
      } else {
        setSettings(defaultSettings);
      }
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching notification settings:", err);
      setError("Could not load your notification settings. Please try again later.");
      setIsLoading(false);
    });

    return () => unsubscribeFirestore();
  }, [currentUser]);

  const handleToggle = (
    category: keyof Omit<NotificationSettings, 'lastUpdated'>,
    type: keyof NotificationPreferences
  ) => {
    if (!settings) return;
    
    setSettings(prevSettings => {
      if (!prevSettings) return null;
      return {
        ...prevSettings,
        [category]: {
          ...prevSettings[category],
          [type]: !prevSettings[category][type],
        }
      }
    });
  };

  const handleSavePreferences = async () => {
    if (!currentUser || !settings) {
      toast({ title: "Error", description: "You must be logged in to save settings.", variant: "destructive" });
      return;
    }
    
    setIsSaving(true);
    try {
      const settingsDocRef = doc(db, 'NotificationSettings', currentUser.uid);
      await setDoc(settingsDocRef, { ...settings, lastUpdated: serverTimestamp() }, { merge: true });
      toast({
        title: "Preferences Saved!",
        description: "Your notification settings have been updated.",
      });
    } catch (e) {
      console.error("Error saving preferences:", e);
      toast({ title: "Save Failed", description: "Could not save your preferences.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-6"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></div>;
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!currentUser) {
      return (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Please Log In</AlertTitle>
          <AlertDescription>You must be logged in to manage your notification settings. <Link href="/login" className="text-primary hover:underline font-semibold">Log in now</Link>.</AlertDescription>
        </Alert>
      );
    }

    if (!settings) {
      return <p>Could not load settings.</p>;
    }

    return (
      <>
        {settingCategories.map(({ id, label, description, icon: Icon }, index) => (
          <div key={id}>
            <div className="flex items-start gap-4">
              <Icon className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{label}</h3>
                <p className="text-sm text-muted-foreground mb-3">{description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-md bg-secondary/20">
                    <Label htmlFor={`${id}-email`} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Mail className="h-4 w-4 text-accent" /> Email Notifications
                    </Label>
                    <Switch
                      id={`${id}-email`}
                      checked={settings[id]?.email ?? false}
                      onCheckedChange={() => handleToggle(id, 'email')}
                      aria-label={`Toggle email notifications for ${label}`}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md bg-secondary/20 opacity-50 cursor-not-allowed">
                    <Label htmlFor={`${id}-sms`} className="flex items-center gap-2 text-sm text-muted-foreground/70">
                      <MessageSquare className="h-4 w-4 text-muted-foreground/50" /> SMS Alerts (Coming Soon)
                    </Label>
                    <Switch id={`${id}-sms`} checked={false} disabled />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md bg-secondary/20 opacity-50 cursor-not-allowed">
                    <Label htmlFor={`${id}-push`} className="flex items-center gap-2 text-sm text-muted-foreground/70">
                      <Bell className="h-4 w-4 text-muted-foreground/50" /> Push Notifications (Coming Soon)
                    </Label>
                    <Switch id={`${id}-push`} checked={false} disabled />
                  </div>
                </div>
              </div>
            </div>
            {index < settingCategories.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
        <Separator className="my-6" />
        <div className="text-right">
          <Button onClick={handleSavePreferences} disabled={isSaving || isLoading}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
            Save Preferences
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-primary flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Profile Dashboard
          </Link>
        </Button>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <Bell className="mr-3 h-8 w-8" /> Notification Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage how you receive updates and communications from SpeedyShop.
        </p>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Communication Channels</CardTitle>
          <CardDescription>Choose your preferred ways to stay informed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
