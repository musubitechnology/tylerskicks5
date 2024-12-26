import React, { useState } from 'react';
import { X, Download, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateEmptyCSV, parseCSVFile } from '../lib/csv';
import toast from 'react-hot-toast';

interface BulkImportModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function BulkImportModal({ onClose, onSuccess }: BulkImportModalProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleDownloadTemplate = () => {
    const csvContent = generateEmptyCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shoe-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const shoes = await parseCSVFile(file);
      
      const { error } = await supabase
        .from('shoes')
        .insert(shoes.map(shoe => ({
          ...shoe,
          brand: 'Jordan',
          wear_count: 0,
        })));

      if (error) throw error;

      toast.success('Shoes imported successfully');
      onSuccess();
    } catch (error) {
      console.error('Error importing shoes:', error);
      toast.error('Failed to import shoes');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Bulk Import Shoes</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <Download className="w-5 h-5" />
              Download CSV Template
            </button>
          </div>

          <div className="border-t border-b border-gray-200 py-6">
            <label className="block text-center">
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload CSV file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".csv"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {isUploading && (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}