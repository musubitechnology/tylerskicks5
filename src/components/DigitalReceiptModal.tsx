import React, { useState } from 'react';
import { X, Receipt, Save } from 'lucide-react';
import { parseNikeReceipt } from '../lib/receiptParser';
import { supabase } from '../lib/supabase';
import { CurrencyInput } from './CurrencyInput';
import { formatCurrency, parseCurrency } from '../lib/formatters';
import toast from 'react-hot-toast';
import type { Shoe } from '../lib/types';

interface DigitalReceiptModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function DigitalReceiptModal({ onClose, onSuccess }: DigitalReceiptModalProps) {
  const [receiptText, setReceiptText] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    purchasePrice: '',
    purchaseDate: '',
    category: 'Basketball' as Shoe['category'],
    colorway: '',
    nickname: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleParse = () => {
    const parsed = parseNikeReceipt(receiptText);
    if (parsed) {
      setFormData({
        ...formData,
        name: parsed.name,
        size: parsed.size?.toString() || '',
        purchasePrice: parsed.price ? formatCurrency(parsed.price) : '',
        purchaseDate: parsed.orderDate || '',
      });
      toast.success('Receipt parsed successfully');
    } else {
      toast.error('Could not parse receipt. Please check the format.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('shoes')
        .insert([
          {
            name: formData.name,
            brand: 'Jordan',
            model: formData.name.includes('Jordan') ? formData.name.split('Jordan')[1]?.trim() : formData.name,
            colors: formData.colorway.split('/').map(c => c.trim()),
            size: formData.size ? parseFloat(formData.size) : null,
            category: formData.category,
            nickname: formData.nickname || null,
            purchase_date: formData.purchaseDate || null,
            purchase_price: parseCurrency(formData.purchasePrice),
            wear_count: 0,
          },
        ]);

      if (error) throw error;

      toast.success('Shoe added successfully');
      onSuccess();
    } catch (error) {
      console.error('Error adding shoe:', error);
      toast.error('Failed to add shoe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Add Shoe from Digital Receipt</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Receipt Text
            </label>
            <textarea
              value={receiptText}
              onChange={(e) => setReceiptText(e.target.value)}
              className="w-full h-64 p-3 border rounded-md"
              placeholder="Paste your digital receipt here..."
            />
            <button
              onClick={handleParse}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-byu-royal text-white rounded-md hover:bg-opacity-90"
            >
              <Receipt className="w-5 h-5" />
              Parse Receipt
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <input
                type="number"
                value={formData.size}
                onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                step="0.5"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Shoe['category'] }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="Basketball">Basketball</option>
                <option value="Casual">Casual</option>
                <option value="Dress">Dress</option>
                <option value="Golf">Golf</option>
                <option value="Slides">Slides</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Colorway</label>
              <input
                type="text"
                value={formData.colorway}
                onChange={(e) => setFormData(prev => ({ ...prev, colorway: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Red/White/Black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nickname</label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
              <CurrencyInput
                value={formData.purchasePrice}
                onChange={(value) => setFormData(prev => ({ ...prev, purchasePrice: value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-byu-navy text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : 'Save Shoe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}