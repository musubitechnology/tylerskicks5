import React from 'react';
import { ClipboardCopy } from 'lucide-react';
import { formatCollectionForSpreadsheet } from '../lib/formatters';
import type { Shoe } from '../lib/types';
import toast from 'react-hot-toast';

interface CopyCollectionButtonProps {
  shoes: Shoe[];
}

export function CopyCollectionButton({ shoes }: CopyCollectionButtonProps) {
  const handleCopy = async () => {
    try {
      const formattedData = formatCollectionForSpreadsheet(shoes);
      await navigator.clipboard.writeText(formattedData);
      toast.success('Collection copied to clipboard');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy collection');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
    >
      <ClipboardCopy className="w-5 h-5" />
      Copy Collection
    </button>
  );
}