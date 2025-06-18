
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, MessageSquare, HelpCircle, AlertTriangle, Info, User, Send, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { User as FirebaseUser } from 'firebase/auth';

const supportFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid 10-digit phone number.' }).max(15, { message: 'Phone number too long.' }),
  role: z.enum(['user', 'admin', 'deliveryBoy'], { required_error: "Please select your role."}),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long.' }),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

export default function SupportPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      // Reset form with current user's details if they log in/out while on the page
      form.reset({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: '', // Phone is not typically stored in auth.currentUser directly
        role: 'user', // Default role
        message: '',
      });
    });
    return () => unsubscribe();
  }, []);


  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: currentUser?.displayName || '',
      email: currentUser?.email || '',
      phone: '',
      role: 'user',
      message: '',
    },
  });
  
  // Effect to update form defaults when currentUser changes (e.g., after initial load)
  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: form.getValues('phone'), // Preserve phone if already entered
        role: form.getValues('role') || 'user', // Preserve role or default
        message: form.getValues('message'), // Preserve message
      });
    } else {
       form.reset({ name: '', email: '', phone: '', role: 'user', message: '' });
    }
  }, [currentUser, form]);


  async function onSubmit(values: SupportFormValues) {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'supportMessages'), {
        uid: currentUser?.uid || null,
        name: values.name,
        email: values.email,
        phoneNumber: values.phone, // Matching Firestore field name
        role: values.role,
        message: values.message,
        status: "open", // Default status
        createdAt: serverTimestamp(),
      });
      toast({
        title: <div className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Your message has been sent to support.</div>,
        description: "We'll get back to you shortly!",
        variant: 'default',
      });
      form.reset({
        name: currentUser?.displayName || '',
        email: currentUser?.email || '',
        phone: '',
        role: 'user',
        message: '',
      });
    } catch (error) {
      console.error("Error sending support message:", error);
      toast({
        title: 'Submission Failed',
        description: "Could not send your message. Please try again later.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-10">
        <HelpCircle className="mx-auto h-16 w-16 text-primary mb-3" />
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Need Help? Contact Support
        </h1>
        <p className="mt-3 text-xl text-muted-foreground sm:mt-4 max-w-3xl mx-auto">
          We're here to help! Facing issues with your order, delivery, or app functionality? Reach out to our support team — we're available 24/7.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center"><Info className="mr-2 h-6 w-6 text-accent"/>Support Options</CardTitle>
            <CardDescription>Here are the ways you can reach us:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start p-3 border rounded-md bg-secondary/30">
              <Phone className="mr-3 h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-sm text-muted-foreground">+91-XXXXXXXXXX (Mon-Sun, 9 AM - 9 PM)</p>
              </div>
            </div>
            <div className="flex items-start p-3 border rounded-md bg-secondary/30">
              <Mail className="mr-3 h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@speedyshop.proto</p>
              </div>
            </div>
            <div className="flex items-start p-3 border rounded-md bg-secondary/30">
              <MessageSquare className="mr-3 h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Available in the bottom-right corner (Mon-Sun, 24/7 - Simulated).</p>
              </div>
            </div>
            <div className="flex items-start p-3 border rounded-md bg-secondary/30">
              <HelpCircle className="mr-3 h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Help Center & FAQs</h3>
                <p className="text-sm text-muted-foreground">Visit: <Link href="/walkthrough" className="text-primary hover:underline">speedyshop.proto/help</Link></p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded-md">
                <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <h4 className="font-semibold text-yellow-700">For Order-Specific Issues</h4>
                </div>
                <p className="text-sm text-yellow-600 mt-1">
                    Please keep your Order ID and Registered Phone Number handy when contacting us for faster assistance.
                </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg sticky top-24">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center"><Send className="mr-2 h-6 w-6 text-accent"/>Send Us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name" className="font-medium">Your Name</Label>
                      <Input id="name" placeholder="e.g., Priya Sharma" {...field} className="text-base"/>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email" className="font-medium">Your Email</Label>
                      <Input id="email" type="email" placeholder="e.g., priya@example.com" {...field} className="text-base"/>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="phone" className="font-medium">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="e.g., +91-9876543210" {...field} className="text-base"/>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="role" className="font-medium">Your Role</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger id="role" className="text-base">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="user">Customer / User</SelectItem>
                          <SelectItem value="deliveryBoy">Delivery Partner</SelectItem>
                          <SelectItem value="admin">Admin / Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="message" className="font-medium">Your Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your issue or query in detail..."
                        rows={5}
                        {...field}
                        className="text-base"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full py-3 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="mr-2 h-5 w-5" /> Send Message</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    
