import React from 'react';
import { Footprints, Sparkles } from 'lucide-react';
import { markShoeAsWorn, markShoeMaintained } from '../lib/tracking';
import toast from 'react-hot-toast';

interface TrackingButtonsProps {
  shoeId: string;
  onUpdate: () => void;
}

export function TrackingButtons({ shoeId, onUpdate }: TrackingButtonsProps) {
  const handleWorn = async () => {
    try {
      await markShoeAsWorn(shoeId);
      toast.success('Marked as worn');
      onUpdate();
    } catch (error) {
      console.error('Error marking shoe as worn:', error);
      toast.error('Failed to mark as worn');
    }
  };

  const handleCleaned = async () => {
    try {
      await markShoeMaintained(shoeId);
      toast.success('Marked as cleaned');
      onUpdate();
    } catch (error) {
      console.error('Error marking shoe as cleaned:', error);
      toast.error('Failed to mark as cleaned');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleWorn}
        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
      >
        <Footprints className="w-4 h-4" />
        Mark as Worn
      </button>
      <button
        onClick={handleCleaned}
        className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
      >
        <Sparkles className="w-4 h-4" />
        Mark as Cleaned
      </button>
    </div>
  );
}