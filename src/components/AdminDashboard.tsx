import React, { useState } from 'react';
import { AddShoeForm } from './AddShoeForm';
import { CollectionView } from './CollectionView';
import { BulkImportModal } from './BulkImportModal';
import { DigitalReceiptModal } from './DigitalReceiptModal';
import { useShoes } from '../lib/hooks/useShoes';
import { Plus, LogOut, Upload, Receipt } from 'lucide-react';
import { signOut } from '../lib/auth';
import toast from 'react-hot-toast';

export function AdminDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showReceiptImport, setShowReceiptImport] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { shoes, loading } = useShoes(refreshTrigger);

  const handleUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLeave = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success('Logged out successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to log out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-byu-navy text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Shoe
          </button>

          <button
            onClick={() => setShowReceiptImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-byu-royal text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            <Receipt className="w-5 h-5" />
            Add from Receipt
          </button>

          <button
            onClick={() => setShowBulkImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-byu-royal text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Add Bulk Shoes
          </button>
        </div>

        <button
          onClick={handleLeave}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          {isLoggingOut ? 'Leaving...' : 'Leave'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Shoe</h2>
          <AddShoeForm
            onSuccess={() => {
              handleUpdate();
              setShowForm(false);
            }}
          />
        </div>
      )}

      {showBulkImport && (
        <BulkImportModal
          onClose={() => setShowBulkImport(false)}
          onSuccess={() => {
            setShowBulkImport(false);
            handleUpdate();
          }}
        />
      )}

      {showReceiptImport && (
        <DigitalReceiptModal
          onClose={() => setShowReceiptImport(false)}
          onSuccess={() => {
            setShowReceiptImport(false);
            handleUpdate();
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Collection</h2>
        <CollectionView
          shoes={shoes}
          refreshTrigger={refreshTrigger}
          loading={loading}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}