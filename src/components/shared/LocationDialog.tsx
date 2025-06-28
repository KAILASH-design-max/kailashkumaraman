
'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import type React from "react";

export interface Location {
  name: string;
  lat: number;
  lng: number;
}

const mockLocations: Location[] = [
    { name: 'Connaught Place, Delhi', lat: 28.6333, lng: 77.2167 },
    { name: 'Cyber Hub, Gurgaon', lat: 28.4965, lng: 77.0888 },
    { name: 'India Gate, Delhi', lat: 28.6129, lng: 77.2295 },
    { name: 'Sector 18, Noida', lat: 28.5706, lng: 77.3235 },
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
      <DialogContent className="sm:max-w-[480px] p-6 rounded-lg">
        <DialogHeader className="mb-3">
          <DialogTitle className="text-xl font-semibold text-left text-card-foreground">Change Delivery Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Button
            onClick={handleDetectLocation}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2.5 rounded-md"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Detect my location (Simulated)
          </Button>

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
                {location.name}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
