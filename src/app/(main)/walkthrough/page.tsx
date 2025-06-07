
import { UserPlus, LogIn, MailCheck, Settings, ListOrdered, MapPin, CreditCard, Heart, Bell, Shield, Zap, ShoppingBasket, Repeat, MessageSquare, UserCog, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function WalkthroughPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          SpeedyShop Proto User Walkthrough
        </h1>
        <p className="mt-3 text-xl text-muted-foreground sm:mt-4">
          Your guide to getting started and making the most of our platform.
        </p>
      </header>

      <div className="space-y-10">
        {/* Step 1: Account Creation */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl">
              <UserPlus className="mr-3 h-8 w-8 text-primary" />
              Step 1: Account Creation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <p>Follow these simple steps to create your SpeedyShop Proto account:</p>
            <ol className="list-decimal space-y-3 pl-6">
              <li>
                <strong>Download &amp; Open:</strong> Get the SpeedyShop Proto mobile app from your app store.
              </li>
              <li>
                <strong>Click "Sign Up":</strong> Look for the "Sign Up" or "Create Account" button, often found in the top-right corner or on the initial screen.
                <div className="mt-2 pl-4">
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    Click here to go to the Sign Up page &rarr;
                  </Link>
                </div>
              </li>
              <li>
                <strong>Enter Details:</strong>
                <ul className="list-disc space-y-1 pl-6 mt-1">
                  <li><em>Required:</em> Email, Password, Full Name.</li>
                  <li><em>Optional:</em> Phone Number (for order updates and optional verification).</li>
                </ul>
              </li>
              <li>
                <strong>Verify Your Account:</strong> Check your email (or SMS if phone provided) for a verification link or One-Time Password (OTP). Click the link or enter the OTP to confirm.
              </li>
              <li>
                <strong>Complete Setup:</strong> Click "Finish" or a similar button to activate your account. You're all set!
              </li>
            </ol>
            <p className="text-md text-muted-foreground">
              <em>(Optional: We plan to add social login via Google/Facebook for even faster access in the future!)</em>
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Step 2: Exploring Account Features */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl">
              <Settings className="mr-3 h-8 w-8 text-primary" />
              Step 2: Exploring Account Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <p>Once logged in, explore these essential account functions, typically found in your dashboard or by clicking your profile icon:</p>
            <div className="space-y-4">
              <div>
                <h3 className="flex items-center text-xl font-semibold">
                  <ListOrdered className="mr-2 h-6 w-6 text-accent" />
                  1. Order Management
                </h3>
                <ul className="list-disc space-y-1 pl-8 mt-1">
                  <li><strong>Track Orders:</strong> View your order history and current order status (e.g., Confirmed, Processing, Shipped, Delivered).</li>
                  <li><strong>Reorder Purchases:</strong> Easily reorder items from your past purchases.</li>
                  <li><strong>Manage Returns:</strong> Initiate and track returns or exchanges (if applicable, often through order details).</li>
                </ul>
              </div>
              <div>
                <h3 className="flex items-center text-xl font-semibold">
                  <UserCog className="mr-2 h-6 w-6 text-accent" />
                  2. Profile & Preferences
                </h3>
                <ul className="list-disc space-y-1 pl-8 mt-1">
                  <li><strong>Update Profile:</strong> Keep your personal details like name and contact information up-to-date.</li>
                  <li><strong>Saved Addresses:</strong> Add and manage multiple delivery addresses (home, work) for faster checkout.</li>
                  <li><strong>Payment Options:</strong> Securely store and manage credit/debit card details or link services like PayPal (future). Set a default payment method.</li>
                  <li><strong>Preferences:</strong> Set your shopping preferences (e.g., favorite categories, dietary needs if applicable).</li>
                </ul>
              </div>
              <div>
                <h3 className="flex items-center text-xl font-semibold">
                  <Heart className="mr-2 h-6 w-6 text-accent" />
                  3. Wishlists & Notifications
                </h3>
                <ul className="list-disc space-y-1 pl-8 mt-1">
                  <li><strong>Create Wishlists:</strong> Save products you're interested in for later by clicking the heart icon (♡).</li>
                  <li><strong>Set Notifications:</strong> Manage email/SMS alerts for order updates, promotional deals, and when wishlisted items are back in stock or on sale.</li>
                  <li><strong>Manage Subscriptions:</strong> (If applicable) Manage any product subscriptions or recurring orders.</li>
                </ul>
              </div>
              <div>
                <h3 className="flex items-center text-xl font-semibold">
                  <Shield className="mr-2 h-6 w-6 text-accent" />
                  4. Account Security
                </h3>
                <ul className="list-disc space-y-1 pl-8 mt-1">
                  <li><strong>Password Management:</strong> Change your password securely. Utilize password reset options if you forget your password.</li>
                  <li><strong>Two-Factor Authentication (2FA):</strong> (Future Feature) Enable 2FA for an extra layer of security on your account.</li>
                  <li><strong>Email/Phone Verification:</strong> Ensure your primary email and phone number are verified for account recovery and important communications.</li>
                </ul>
              </div>
               <div>
                <h3 className="flex items-center text-xl font-semibold">
                  <HelpCircle className="mr-2 h-6 w-6 text-accent" />
                  5. Support
                </h3>
                <ul className="list-disc space-y-1 pl-8 mt-1">
                  <li><strong>Contact Support:</strong> Easily find ways to contact customer support for any login assistance, payment issues, or other queries.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Step 3: Using SpeedyShop Proto Efficiently */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-3xl">
              <Zap className="mr-3 h-8 w-8 text-primary" />
              Step 3: Using SpeedyShop Proto Efficiently
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Fast Checkout:</strong> Use your saved addresses and payment methods to breeze through checkout, skipping repetitive form-filling.
              </li>
              <li>
                <strong>Track Orders in Real-Time:</strong> Get instant updates on your order's progress via email or in-app notifications.
              </li>
              <li>
                <strong>Reorder Easily:</strong> Quickly find past purchases in your "Order History" to reorder your favorite items with just a few clicks.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-16 text-center">
        <p className="text-2xl font-semibold text-primary">
          Happy Shopping with SpeedyShop Proto! 🚀
        </p>
        <p className="mt-2 text-muted-foreground">
          If you have any questions, please visit our Help Center or contact support.
        </p>
        <div className="mt-6">
            <Link href="/" className="text-primary hover:underline">
                &larr; Back to Homepage
            </Link>
        </div>
      </footer>
    </div>
  );
}
