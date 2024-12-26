import React, { useState } from 'react';
import { Shuffle, Clock } from 'lucide-react';
import type { Shoe } from '../lib/types';
import { getRandomShoe, getLeastWornShoe } from '../lib/shoePicker';
import { format, formatDistanceToNow } from 'date-fns';

interface RandomShoePickerProps {
  shoes: Shoe[];
}

export function RandomShoePicker({ shoes }: RandomShoePickerProps) {
  const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);
  const [selectionType, setSelectionType] = useState<'random' | 'unworn'>('random');

  const pickShoe = (type: 'random' | 'unworn') => {
    setSelectionType(type);
    const picked = type === 'random' 
      ? getRandomShoe(shoes)
      : getLeastWornShoe(shoes);
    setSelectedShoe(picked);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => pickShoe('random')}
          className="flex items-center gap-2 px-4 py-2 bg-byu-navy text-white rounded-md hover:bg-opacity-90 transition-all"
        >
          <Shuffle className="w-5 h-5" />
          Pick me a random shoe
        </button>
        
        <button
          onClick={() => pickShoe('unworn')}
          className="flex items-center gap-2 px-4 py-2 bg-byu-royal text-white rounded-md hover:bg-opacity-90 transition-all"
        >
          <Clock className="w-5 h-5" />
          Pick me a shoe I haven't worn in a while
        </button>
      </div>

      {selectedShoe && (
        <div className="p-4 bg-white rounded-lg shadow-md border-2 border-byu-navy">
          <div className="flex items-center gap-4">
            <img
              src={selectedShoe.image_url}
              alt={selectedShoe.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-byu-navy">
                {selectionType === 'random' ? "Today's Random Pick:" : "Least Worn Pick:"}
              </h3>
              <p className="text-gray-800">{selectedShoe.name}</p>
              <p className="text-gray-600 text-sm">{selectedShoe.colors.join(' / ')}</p>
              {selectedShoe.last_worn ? (
                <p className="text-sm text-gray-500">
                  Last worn: {formatDistanceToNow(new Date(selectedShoe.last_worn), { addSuffix: true })}
                </p>
              ) : (
                <p className="text-sm text-byu-royal font-medium">Never worn</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}