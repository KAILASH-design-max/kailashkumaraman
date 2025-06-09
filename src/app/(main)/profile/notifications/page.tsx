
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Bell, Mail, MessageSquare, Settings, Truck, TrendingDown, Gift } from 'lucide-react';
import Link from 'next/link';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  emailEnabled: boolean;
  smsEnabled: boolean; // For future use
  pushEnabled: boolean; // For future use
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    { 
      id: 'orderUpdates', 
      label: 'Order & Shipping Updates', 
      description: 'Get notified about order confirmation, processing, shipping, and delivery.',
      icon: Truck,
      emailEnabled: true, 
      smsEnabled: false,
      pushEnabled: true,
    },
    { 
      id: 'priceDrops', 
      label: 'Price Drop Alerts', 
      description: 'Receive alerts when items on your wishlist or previously viewed products have a price drop.',
      icon: TrendingDown,
      emailEnabled: true, 
      smsEnabled: false,
      pushEnabled: false,
    },
    { 
      id: 'promotions', 
      label: 'Exclusive Promotions & Offers', 
      description: 'Stay informed about special deals, new arrivals, and personalized offers.',
      icon: Gift,
      emailEnabled: true, 
      smsEnabled: true,
      pushEnabled: true,
    },
     { 
      id: 'accountActivity', 
      label: 'Account Activity', 
      description: 'Important alerts regarding your account security and changes.',
      icon: Settings,
      emailEnabled: true, 
      smsEnabled: false,
      pushEnabled: true,
    },
  ]);

  const toggleSetting = (id: string, type: 'email' | 'sms' | 'push') => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, [`${type}Enabled`]: !setting[`${type}Enabled`] } : setting
      )
    );
    // API call to update notification preferences would go here
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
          {settings.map(setting => (
            <div key={setting.id}>
              <div className="flex items-start gap-4">
                 <setting.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                 <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{setting.label}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{setting.description}</p>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-md bg-secondary/20">
                            <Label htmlFor={`${setting.id}-email`} className="flex items-center gap-2 text-sm cursor-pointer">
                                <Mail className="h-4 w-4 text-accent" /> Email Notifications
                            </Label>
                            <Switch
                                id={`${setting.id}-email`}
                                checked={setting.emailEnabled}
                                onCheckedChange={() => toggleSetting(setting.id, 'email')}
                                aria-label={`Toggle email notifications for ${setting.label}`}
                            />
                        </div>
                         {/* Placeholder for SMS and Push notifications, can be enabled later */}
                        <div className="flex items-center justify-between p-3 border rounded-md bg-secondary/20 opacity-50 cursor-not-allowed">
                            <Label htmlFor={`${setting.id}-sms`} className="flex items-center gap-2 text-sm text-muted-foreground/70">
                                <MessageSquare className="h-4 w-4 text-muted-foreground/50" /> SMS Alerts (Coming Soon)
                            </Label>
                            <Switch
                                id={`${setting.id}-sms`}
                                checked={setting.smsEnabled}
                                onCheckedChange={() => toggleSetting(setting.id, 'sms')}
                                disabled
                                aria-label={`Toggle SMS alerts for ${setting.label} (disabled)`}
                            />
                        </div>
                         <div className="flex items-center justify-between p-3 border rounded-md bg-secondary/20 opacity-50 cursor-not-allowed">
                            <Label htmlFor={`${setting.id}-push`} className="flex items-center gap-2 text-sm text-muted-foreground/70">
                                <Bell className="h-4 w-4 text-muted-foreground/50" /> Push Notifications (Coming Soon)
                            </Label>
                            <Switch
                                id={`${setting.id}-push`}
                                checked={setting.pushEnabled}
                                onCheckedChange={() => toggleSetting(setting.id, 'push')}
                                disabled
                                aria-label={`Toggle push notifications for ${setting.label} (disabled)`}
                            />
                        </div>
                    </div>
                 </div>
              </div>
              {settings.indexOf(setting) < settings.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
           <Separator className="my-6" />
            <div className="text-right">
                <Button onClick={() => alert('All notification preferences saved! (Simulated)')}>
                    Save Preferences
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
