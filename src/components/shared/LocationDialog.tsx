
'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MapPin, Search as SearchIcon } from "lucide-react";
import type React from "react";

interface LocationDialogProps {
  children: React.ReactNode; // This will be the trigger element
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onLocationUpdate?: (location: string) => void; // Callback to update navbar
}

export function LocationDialog({ children, open, onOpenChange, onLocationUpdate }: LocationDialogProps) {
  const handleDetectLocation = () => {
    console.log("Detecting location...");
    // Mock: set location
    const detectedLocation = "Mumbai, 400001"; // Simplified mock
    if (onLocationUpdate) onLocationUpdate(detectedLocation);
    if (onOpenChange) onOpenChange(false); // Close dialog
  };

  const handleSearchFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('searchLocation') as string;
    if (searchQuery.trim()) {
        console.log("Searching location:", searchQuery);
        if (onLocationUpdate) onLocationUpdate(searchQuery.trim());
        if (onOpenChange) onOpenChange(false); // Close dialog
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-6 rounded-lg">
        <DialogHeader className="mb-3">
          <DialogTitle className="text-xl font-semibold text-left text-card-foreground">Change Location</DialogTitle>
          {/* DialogClose 'X' is automatically added by ShadCN DialogContent */}
        </DialogHeader>
        <div className="space-y-5">
          <Button
            onClick={handleDetectLocation}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2.5 rounded-md"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Detect my location
          </Button>

          <div className="flex items-center space-x-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="text-muted-foreground text-xs font-medium">OR</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <form onSubmit={handleSearchFormSubmit} className="space-y-3">
            <div className="relative">
              <Input
                type="text"
                name="searchLocation"
                placeholder="Search delivery location"
                className="h-10 pl-9 text-sm rounded-md border-input focus:border-primary"
                required
              />
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button type="submit" variant="outline" className="w-full text-sm py-2.5">
              Use Entered Location
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
