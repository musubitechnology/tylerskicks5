import React, { useState } from 'react';
import { Search, Edit2 } from 'lucide-react';
import type { Shoe } from '../lib/types';
import { formatDate, formatCurrency } from '../lib/formatters';
import { EditShoeModal } from './EditShoeModal';

interface ShoeTableProps {
  shoes: Shoe[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onUpdate: () => void;
}

export function ShoeTable({ shoes, searchTerm, onSearchChange, onUpdate }: ShoeTableProps) {
  const [editingShoe, setEditingShoe] = useState<Shoe | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, color, or nickname..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colors</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wear Count</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shoes.map((shoe) => (
              <tr key={shoe.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {shoe.image_url && (
                    <img
                      src={shoe.image_url}
                      alt={shoe.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{shoe.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{shoe.model}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {shoe.colors.map((color, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shoe.size || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shoe.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shoe.purchase_price ? formatCurrency(shoe.purchase_price) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {shoe.purchase_date ? formatDate(shoe.purchase_date) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{shoe.wear_count}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setEditingShoe(shoe)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingShoe && (
        <EditShoeModal
          shoe={editingShoe}
          onClose={() => setEditingShoe(null)}
          onSave={() => {
            setEditingShoe(null);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}