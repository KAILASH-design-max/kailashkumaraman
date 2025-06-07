
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ListOrdered, MapPin, CreditCard, Heart, Settings, ShieldCheck, Bell, Repeat, RotateCcw, MessageSquareQuestion, LogOut, UserCircle, Edit3, Share2, Filter, Activity, PackageSearch, Sparkles, Info, ListChecks, Brain // Added ListChecks, Sparkles, Info, Brain
} from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast'; 

export default function ProfileDashboardPage() {
  const router = useRouter();
  const { toast } = useToast(); 

  const user = {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    joinDate: 'Joined on January 15, 2023',
  };

  const handleLogout = () => {
    console.log('User logging out...');
    if (typeof window !== 'undefined') {
        localStorage.removeItem('isMockLoggedIn'); 
    }
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/'); 
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-card rounded-lg shadow-md">
          <UserCircle className="h-20 w-20 sm:h-24 sm:w-24 text-primary" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-card-foreground">Welcome to your Dashboard, {user.name}!</h1>
            <p className="text-md sm:text-lg text-muted-foreground">{user.email}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{user.joinDate}</p>
            <Button variant="outline" size="sm" className="mt-4">
              <Edit3 className="mr-2 h-4 w-4" /> Update Profile/Preferences
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <ListOrdered className="mr-3 h-7 w-7 text-primary" /> Order Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>View complete order history with real-time status tracking. Filter by status, reorder, or initiate returns.</CardDescription>
            <Button asChild className="w-full mt-2">
              <Link href="/profile/orders">View Order History</Link>
            </Button>
             <div className="text-sm text-muted-foreground space-y-1 pt-2">
                <p className="flex items-center"><PackageSearch className="mr-2 h-4 w-4 text-accent" /> Track Status (Processing/Shipped/Delivered/Returned)</p>
                <p className="flex items-center"><Filter className="mr-2 h-4 w-4 text-accent" /> Filter Orders</p>
                <p className="flex items-center"><Repeat className="mr-2 h-4 w-4 text-accent" /> One-Click Reorder</p>
                <p className="flex items-center"><RotateCcw className="mr-2 h-4 w-4 text-accent" /> Initiate Returns</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <MapPin className="mr-3 h-7 w-7 text-primary" /> Address Book
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>Save home/work/other shipping addresses. Set a default for faster checkout, and easily edit or delete locations.</CardDescription>
            <Button asChild className="w-full mt-2">
              <Link href="/profile/addresses">Manage Addresses</Link>
            </Button>
            <div className="text-sm text-muted-foreground space-y-1 pt-2">
                <p className="flex items-center"><Edit3 className="mr-2 h-4 w-4 text-accent" /> Edit/Delete Addresses</p>
                <p className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-accent" /> Set Default Address</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <CreditCard className="mr-3 h-7 w-7 text-primary" /> Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>Securely store multiple credit/debit cards and digital wallets (e.g., PayPal, Apple Pay). Set your default payment option.</CardDescription>
            <Button asChild className="w-full mt-2">
              <Link href="/profile/payments">Manage Payments</Link>
            </Button>
             <div className="text-sm text-muted-foreground space-y-1 pt-2">
                <p className="flex items-center"><CreditCard className="mr-2 h-4 w-4 text-accent" /> Store Multiple Cards</p>
                <p className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent"><path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="m22 12-4-4-4 4"/><path d="M18 12h-8"/></svg> Add Digital Wallets</p>
                <p className="flex items-center"><Settings className="mr-2 h-4 w-4 text-accent" /> Set Default Payment</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Heart className="mr-3 h-7 w-7 text-primary" /> Wishlists
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>Create unlimited named lists (e.g., "Birthday Ideas"). Move items between lists or to your cart, and share wishlists via link.</CardDescription>
            <Button asChild className="w-full mt-2">
              <Link href="/profile/wishlists">My Wishlists</Link>
            </Button>
            <div className="text-sm text-muted-foreground space-y-1 pt-2">
                <p className="flex items-center"><Edit3 className="mr-2 h-4 w-4 text-accent" /> Create Named Lists</p>
                <p className="flex items-center"><Repeat className="mr-2 h-4 w-4 text-accent" /> Move Items (Lists/Cart)</p>
                <p className="flex items-center"><Share2 className="mr-2 h-4 w-4 text-accent" /> Share Wishlists</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <ListChecks className="mr-3 h-7 w-7 text-primary" /> AI Smart Shopping List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>Let our AI craft a personalized shopping list based on your recent purchases, upcoming events, and household needs.</CardDescription>
            <Button asChild className="w-full mt-2">
              <Link href="/profile/smart-list">Generate Smart List</Link>
            </Button>
             <div className="text-sm text-muted-foreground space-y-1 pt-2">
                <p className="flex items-center"><Sparkles className="mr-2 h-4 w-4 text-accent" /> Personalized Suggestions</p>
                <p className="flex items-center"><Info className="mr-2 h-4 w-4 text-accent" /> Get Reasoning</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Bell className="mr-3 h-7 w-7 text-primary" /> Subscription Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>Manage email/SMS notifications for order confirmations, shipping updates, price drop alerts, and exclusive promotions.</CardDescription>
            <Button asChild className="w-full mt-2">
              <Link href="/profile/notifications">Manage Notifications</Link>
            </Button>
             <div className="text-sm text-muted-foreground space-y-1 pt-2">
                <p className="flex items-center"><ListOrdered className="mr-2 h-4 w-4 text-accent" /> Order/Shipping Updates</p>
                <p className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent"><path d="M12 6V2H8"/><path d="M12 18v-4"/><path d="M12 12v-2"/><path d="M12 8V7"/><path d="M12 3v1"/><path d="M15 6.343A8.001 8.001 0 0 1 12 20a8 8 0 0 1 0-16"/><path d="m8 7 1.841 1.841A6.005 6.005 0 0 0 12 18V12H6l3-3"/></svg> Price Drop Alerts</p>
                <p className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/><polyline points="16 5 17.58 6.58"/><line x1="2" y1="22" x2="22" y2="2"/></svg> Exclusive Promotions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <ShieldCheck className="mr-3 h-7 w-7 text-primary" /> Security & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>Enable two-factor authentication, view recent login activity, and get quick access to customer support.</CardDescription>
            <Button asChild className="w-full mt-2">
              <Link href="/profile/security">Security Settings</Link>
            </Button>
             <div className="text-sm text-muted-foreground space-y-1 pt-2">
                <p className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-accent" /> Enable 2FA</p>
                <p className="flex items-center"><Activity className="mr-2 h-4 w-4 text-accent" /> View Login Activity</p>
                <p className="flex items-center"><MessageSquareQuestion className="mr-2 h-4 w-4 text-accent" /> Contact Support</p>
            </div>
          </CardContent>
        </Card>

      </div>
      
      <Separator className="my-8" />

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border-destructive/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold text-destructive">Logout</CardTitle>
            <LogOut className="h-7 w-7 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Securely sign out of your SpeedyShop Proto account.
            </p>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
                Log Out Now
            </Button>
          </CardContent>
        </Card>

      <footer className="mt-12 text-center">
        <p className="text-muted-foreground mb-1">Need help or have questions about your account?</p>
        <Button variant="link" asChild className="text-primary text-lg">
          <Link href="/support"><MessageSquareQuestion className="mr-2 h-5 w-5" />Contact Support Center</Link>
        </Button>
      </footer>
    </div>
  );
}

    