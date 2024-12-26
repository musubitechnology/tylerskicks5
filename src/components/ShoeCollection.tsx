import React from 'react';
import { ShoeCard } from './ShoeCard';
import type { Shoe } from '../lib/types';

interface ShoeCollectionProps {
  shoes: Shoe[];
  onUpdate: () => void;
}

export function ShoeCollection({ shoes, onUpdate }: ShoeCollectionProps) {
  if (shoes.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <p className="text-gray-600">No shoes in the collection yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shoes.map((shoe) => (
        <ShoeCard key={shoe.id} shoe={shoe} onUpdate={onUpdate} />
      ))}
    </div>
  );
}