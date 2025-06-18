
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ShieldCheck, Lock, Activity, MessageSquareQuote, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from 'react';

interface LoginActivity {
  id: string;
  device: string;
  location: string;
  time: string;
}

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const loginActivities: LoginActivity[] = [
    { id: 'la1', device: 'Chrome on Windows', location: 'Mumbai, India (Approx.)', time: '2023-11-02 10:30 AM' },
    { id: 'la2', device: 'iPhone App', location: 'Delhi, India (Approx.)', time: '2023-10-30 08:15 PM' },
  ];

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
          <ShieldCheck className="mr-3 h-8 w-8" /> Security & Support
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account security settings and access support resources.
        </p>
      </header>

      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><Lock className="mr-2 h-5 w-5 text-accent"/>Two-Factor Authentication (2FA)</CardTitle>
            <CardDescription>Add an extra layer of security to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Switch 
                id="two-factor-switch" 
                checked={twoFactorEnabled} 
                onCheckedChange={setTwoFactorEnabled}
              />
              <Label htmlFor="two-factor-switch" className="text-sm">
                {twoFactorEnabled ? '2FA is Enabled' : '2FA is Disabled'}
              </Label>
            </div>
            {twoFactorEnabled ? (
              <p className="text-sm text-muted-foreground">
                You will be asked for a verification code from your authenticator app when logging in.
                {/* Placeholder for managing 2FA methods or recovery codes */}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enable 2FA to significantly increase your account security. You'll typically use an authenticator app (like Google Authenticator or Authy) or SMS codes.
              </p>
            )}
            <Button variant="outline" className="mt-3" onClick={() => alert('Manage 2FA settings (e.g., setup, recovery codes) - to be implemented.')}>
              Manage 2FA Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><Activity className="mr-2 h-5 w-5 text-accent"/>Recent Login Activity</CardTitle>
            <CardDescription>Review recent sign-ins to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            {loginActivities.length > 0 ? (
              <ul className="space-y-3">
                {loginActivities.map(activity => (
                  <li key={activity.id} className="text-sm p-3 border rounded-md bg-secondary/30">
                    <p><strong>Device:</strong> {activity.device}</p>
                    <p><strong>Approx. Location:</strong> {activity.location}</p>
                    <p><strong>Time:</strong> {activity.time}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent login activity to display.</p>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              Feature to be implemented: Full login history, ability to "Sign out of all other sessions".
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><HelpCircle className="mr-2 h-5 w-5 text-accent"/>Customer Support</CardTitle>
            <CardDescription>Get help with your account or any issues you're facing.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">
              If you need assistance, have questions, or want to report an issue, our support team is here to help.
            </p>
            <Button asChild>
              <Link href="/support">Contact Support Center</Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Feature to be implemented: Direct links to FAQs, chat support, or a contact form within this section.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    