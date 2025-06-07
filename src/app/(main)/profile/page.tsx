
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListOrdered, MapPin, CreditCard, Heart, UserCircle, Edit3, LogOut, Settings, Shield, Bell, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation'; // For logout redirection

export default function ProfileDashboardPage() {
  const router = useRouter();

  // Mock user data for display
  const user = {
    name: 'Priya Sharma', // Replace with actual user data logic
    email: 'priya@example.com', // Replace with actual user data logic
    joinDate: 'Joined on January 15, 2023', // Example join date
  };

  const handleLogout = () => {
    // In a real app, this would call an authentication service
    // For now, we'll simulate logout and redirect
    console.log('User logging out...');
    // Here you would clear any auth tokens, user state, etc.
    alert('You have been logged out (simulated).');
    router.push('/'); // Redirect to homepage after logout
  };


  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-card rounded-lg shadow-md">
          <UserCircle className="h-20 w-20 sm:h-24 sm:w-24 text-primary" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-card-foreground">Welcome back, {user.name}!</h1>
            <p className="text-md sm:text-lg text-muted-foreground">{user.email}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{user.joinDate}</p>
            <Button variant="outline" size="sm" className="mt-4">
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Order Management */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Order Management</CardTitle>
            <ListOrdered className="h-7 w-7 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View complete order history with status tracking (processing/shipped/delivered).
            </p>
            <Button asChild className="w-full">
              <Link href="/profile/orders">View My Orders</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Address Book */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Address Book</CardTitle>
            <MapPin className="h-7 w-7 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Save and manage multiple shipping addresses for faster checkout.
            </p>
            <Button asChild className="w-full">
              <Link href="/profile/addresses">Manage Addresses</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Payment Methods</CardTitle>
            <CreditCard className="h-7 w-7 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Securely store and manage your credit/debit cards or digital wallets.
            </p>
            <Button asChild className="w-full">
              <Link href="/profile/payments">Manage Payments</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Wishlists */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Wishlists</CardTitle>
            <Heart className="h-7 w-7 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create, view, and organize your saved items into multiple lists.
            </p>
            <Button asChild className="w-full">
              <Link href="/profile/wishlist">My Wishlists</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">Account Settings</CardTitle>
            <Settings className="h-7 w-7 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage notifications, security (2FA, password), and preferences.
            </p>
            <Button asChild className="w-full">
              <Link href="/profile/settings">Go to Settings</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Logout Section */}
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
      </div>

      <Separator className="my-12" />

      <div className="text-center">
        <p className="text-muted-foreground mb-1">Need help or have questions about your account?</p>
        <Button variant="link" asChild className="text-primary text-lg">
          <Link href="/support"><HelpCircle className="mr-2 h-5 w-5" />Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
