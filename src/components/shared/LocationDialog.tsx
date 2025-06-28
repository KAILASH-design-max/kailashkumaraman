
'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MapPin, LocateFixed } from "lucide-react";
import type React from "react";

export interface Location {
  name: string;
  lat: number;
  lng: number;
}

const mockLocations: Location[] = [
    { name: 'Laheriasarai, Darbhanga', lat: 26.10, lng: 85.91 },
    { name: 'Darbhanga Medical College', lat: 26.16, lng: 85.89 },
    { name: 'Darbhanga Tower', lat: 26.165, lng: 85.9 },
    { name: 'Donar, Darbhanga', lat: 26.14, lng: 85.88 },
];

interface LocationDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onLocationUpdate?: (location: Location) => void;
}

export function LocationDialog({ children, open, onOpenChange, onLocationUpdate }: LocationDialogProps) {
  const handleLocationSelect = (location: Location) => {
    if (onLocationUpdate) onLocationUpdate(location);
    if (onOpenChange) onOpenChange(false);
  };

  const handleDetectLocation = () => {
    // Pick a random location from our mock list to simulate detection
    const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    handleLocationSelect(randomLocation);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-lg">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-left text-card-foreground">Choose Your Delivery Location</DialogTitle>
          <DialogDescription className="text-left">Select a location to see accurate delivery times and product availability.</DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6 space-y-4">
            <Button
                onClick={handleDetectLocation}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2.5 rounded-md"
            >
                <LocateFixed className="mr-2 h-4 w-4" />
                Detect my location (Simulated)
            </Button>
            <div style={{ width: '100%', height: '250px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57302.63291536073!2d85.86197830599366!3d26.15062508977816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39edb835434acdb1%3A0x70ec31d04822699e!2sDarbhanga%2C%20Bihar!5e0!3m2!1sen!2sin!4v1749675032868!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Delivery Map (Static Placeholder)"
                    data-ai-hint="static map embed"
                ></iframe>
            </div>

            <div className="flex items-center space-x-2">
                <div className="flex-grow border-t border-border"></div>
                <span className="text-muted-foreground text-xs font-medium">OR SELECT A LOCATION</span>
                <div className="flex-grow border-t border-border"></div>
            </div>

            <div className="space-y-2">
                {mockLocations.map(location => (
                <Button 
                    key={location.name}
                    variant="outline" 
                    className="w-full justify-start text-sm py-2.5"
                    onClick={() => handleLocationSelect(location)}
                >
                    <MapPin className="mr-2 h-4 w-4 text-primary"/> {location.name}
                </Button>
                ))}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
