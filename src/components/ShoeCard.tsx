import React, { useState } from 'react';
import { Clock, Droplets, Edit2, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { EditShoeModal } from './EditShoeModal';
import { TrackingButtons } from './TrackingButtons';
import { DateTimeModal } from './DateTimeModal';
import { formatDate, formatCurrency } from '../lib/formatters';
import type { Shoe } from '../lib/types';

interface ShoeCardProps {
  shoe: Shoe;
  onUpdate: () => void;
}

export function ShoeCard({ shoe, onUpdate }: ShoeCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [dateTimeModal, setDateTimeModal] = useState<{
    type: 'worn' | 'maintained';
    date: string | null;
  } | null>(null);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <img
            src={shoe.image_url}
            alt={shoe.name}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={() => setShowEditModal(true)}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold">{shoe.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{shoe.model}</p>
          
          <div className="flex gap-2 mt-2">
            {shoe.colors.map((color, index) => (
              <span
                key={index}
                className="px-2 py-1 text-sm rounded-full bg-gray-100"
              >
                {color}
              </span>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last worn: {shoe.last_worn 
                  ? formatDistanceToNow(new Date(shoe.last_worn), { addSuffix: true })
                  : 'Never'}
              </div>
              <button
                onClick={() => setDateTimeModal({ type: 'worn', date: shoe.last_worn })}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Last cleaned: {shoe.last_cleaned
                  ? formatDistanceToNow(new Date(shoe.last_cleaned), { addSuffix: true })
                  : 'Never'}
              </div>
              <button
                onClick={() => setDateTimeModal({ type: 'maintained', date: shoe.last_cleaned })}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Worn {shoe.wear_count} times
            </div>
            {shoe.purchase_date && (
              <div className="text-sm text-gray-600">
                Purchased: {formatDate(shoe.purchase_date)}
              </div>
            )}
            {shoe.purchase_price && (
              <div className="text-sm text-gray-600">
                Price: {formatCurrency(shoe.purchase_price)}
              </div>
            )}
            {shoe.size && (
              <div className="text-sm text-gray-600">
                Size: {shoe.size}
              </div>
            )}
          </div>

          <div className="mt-4">
            <TrackingButtons shoeId={shoe.id} onUpdate={onUpdate} />
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditShoeModal
          shoe={shoe}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            setShowEditModal(false);
            onUpdate();
          }}
        />
      )}

      {dateTimeModal && (
        <DateTimeModal
          shoeId={shoe.id}
          type={dateTimeModal.type}
          currentDate={dateTimeModal.date}
          onClose={() => setDateTimeModal(null)}
          onSave={() => {
            setDateTimeModal(null);
            onUpdate();
          }}
        />
      )}
    </>
  );
}