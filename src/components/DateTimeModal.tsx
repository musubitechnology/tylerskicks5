import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface DateTimeModalProps {
  shoeId: string;
  type: 'worn' | 'maintained';
  currentDate: string | null;
  onClose: () => void;
  onSave: () => void;
}

export function DateTimeModal({ shoeId, type, currentDate, onClose, onSave }: DateTimeModalProps) {
  const [dateTime, setDateTime] = useState(currentDate || new Date().toISOString().slice(0, 16));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (type === 'worn') {
        // Get current wear count
        const { data: shoe } = await supabase
          .from('shoes')
          .select('wear_count')
          .eq('id', shoeId)
          .single();

        updateData = {
          ...updateData,
          last_worn: dateTime,
          wear_count: (shoe?.wear_count || 0) + 1,
        };
      } else {
        updateData.last_cleaned = dateTime;
      }

      const { error } = await supabase
        .from('shoes')
        .update(updateData)
        .eq('id', shoeId);

      if (error) throw error;

      toast.success('Date updated successfully');
      onSave();
    } catch (error) {
      console.error('Error updating date:', error);
      toast.error('Failed to update date');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            Edit {type === 'worn' ? 'Wear' : 'Cleaning'} Date
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date and Time
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}