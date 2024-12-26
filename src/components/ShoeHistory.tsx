import React from 'react';
import { format } from 'date-fns';
import { Trash2, Calendar } from 'lucide-react';
import type { ShoeHistoryEntry } from '../lib/types';

interface ShoeHistoryProps {
  entries: ShoeHistoryEntry[];
  onDelete: (entryId: string) => void;
  onEdit: (entry: ShoeHistoryEntry) => void;
}

export function ShoeHistory({ entries, onDelete, onEdit }: ShoeHistoryProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">History Log</h3>
      {entries.length === 0 ? (
        <p className="text-gray-500 text-sm">No history entries yet.</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  entry.type === 'worn'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {entry.type === 'worn' ? 'Worn' : 'Cleaned'}
                </span>
                <span className="text-sm text-gray-600">
                  {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(entry)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}