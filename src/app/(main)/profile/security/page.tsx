
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, ShieldCheck, Lock, Activity, HelpCircle, Loader2, AlertTriangle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, setDoc, type Timestamp } from 'firebase/firestore';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { SecurityData, LoginActivity } from '@/lib/types';

export default function SecurityPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [securityData, setSecurityData] = useState<SecurityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setIsLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    const securityDocRef = doc(db, 'SecuritySupport', currentUser.uid);

    const unsubscribeFirestore = onSnapshot(securityDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSecurityData({
          twoFactorEnabled: data.twoFactorEnabled || false,
          loginActivity: (data.loginActivity || []).map((activity: any) => ({
            ...activity,
            timestamp: activity.timestamp as Timestamp // Ensure it's treated as a Timestamp
          })),
          activeSessions: data.activeSessions || []
        });
      } else {
        // If no document exists, set default state
        setSecurityData({
          twoFactorEnabled: false,
          loginActivity: [],
          activeSessions: []
        });
      }
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching security data:", err);
      setError("Could not load your security settings. Please try again later.");
      setIsLoading(false);
    });

    return () => unsubscribeFirestore();
  }, [currentUser]);

  const handleToggle2FA = async (enabled: boolean) => {
    if (!currentUser) return;

    try {
      const securityDocRef = doc(db, 'SecuritySupport', currentUser.uid);
      await setDoc(securityDocRef, { twoFactorEnabled: enabled }, { merge: true });
      toast({
        title: "Security setting updated",
        description: `Two-Factor Authentication has been ${enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (e) {
      console.error("Error updating 2FA status:", e);
      toast({
        title: "Update Failed",
        description: "Could not update your security settings.",
        variant: "destructive",
      });
      // Revert UI state on failure
      setSecurityData(prev => prev ? { ...prev, twoFactorEnabled: !enabled } : null);
    }
  };

  const handleSignOutAll = () => {
    // In a real app, this would trigger a secure server function.
    // This function would use the Firebase Admin SDK to revoke all refresh tokens
    // for the current user, effectively signing them out of all devices.
    toast({
      title: "Simulating 'Sign Out Everywhere'",
      description: "This action is simulated. In a real application, all other sessions would now be invalidated.",
      duration: 5000,
    });
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading security settings...</p>
        </div>
      );
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
           <AlertDescription>
             You need to be logged in to view your security settings. <Link href="/login?redirect=/profile/security" className="font-semibold text-primary hover:underline">Log in now</Link>.
           </AlertDescription>
         </Alert>
       );
    }
    
    return (
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
                checked={securityData?.twoFactorEnabled || false} 
                onCheckedChange={handleToggle2FA}
              />
              <Label htmlFor="two-factor-switch" className="text-sm">
                {securityData?.twoFactorEnabled ? '2FA is Enabled' : '2FA is Disabled'}
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              {securityData?.twoFactorEnabled ?
                "You will be asked for a verification code from your authenticator app when logging in." :
                "Enable 2FA to significantly increase your account security."
              }
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><Activity className="mr-2 h-5 w-5 text-accent"/>Recent Login Activity</CardTitle>
            <CardDescription>Review recent sign-ins to your account. This list shows the last 5 activities.</CardDescription>
          </CardHeader>
          <CardContent>
            {securityData?.loginActivity && securityData.loginActivity.length > 0 ? (
              <ul className="space-y-3">
                {securityData.loginActivity.map((activity, index) => (
                  <li key={index} className="text-sm p-3 border rounded-md bg-secondary/30">
                    <p><strong>Device:</strong> {(activity.device || 'Unknown').substring(0, 100)}</p>
                    <p><strong>Approx. Location:</strong> {activity.location}</p>
                    <p><strong>Time:</strong> {formatDate(activity.timestamp)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent login activity to display.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><LogOut className="mr-2 h-5 w-5 text-accent"/>Manage Active Sessions</CardTitle>
            <CardDescription>For your security, you can sign out of all other devices.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mb-3">
                If you notice any suspicious activity, it's a good practice to sign out everywhere and change your password.
            </p>
            <Button variant="destructive" onClick={handleSignOutAll}>
              Sign Out of All Other Sessions
            </Button>
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
          </CardContent>
        </Card>
      </div>
    );
  }

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
      
      {renderContent()}
    </div>
  );
}
