import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { uploadImage } from '../lib/storage';
import { ImageUpload } from './ImageUpload';
import { ShoeHistory } from './ShoeHistory';
import { getShoeHistory, deleteHistoryEntry, updateHistoryEntry } from '../lib/history';
import { CurrencyInput } from './CurrencyInput';
import { parseCurrency, formatCurrency } from '../lib/formatters';
import toast from 'react-hot-toast';
import type { Shoe, ShoeHistoryEntry } from '../lib/types';

interface EditShoeModalProps {
  shoe: Shoe;
  onClose: () => void;
  onSave: () => void;
}

export function EditShoeModal({ shoe, onClose, onSave }: EditShoeModalProps) {
  const [formData, setFormData] = useState({
    name: shoe.name,
    model: shoe.model,
    colorway: shoe.colors.join('/'),
    nickname: shoe.nickname || '',
    purchase_date: shoe.purchase_date || '',
    purchase_price: shoe.purchase_price ? formatCurrency(shoe.purchase_price) : '',
    category: shoe.category || 'Other',
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<ShoeHistoryEntry[]>([]);
  const [editingHistoryEntry, setEditingHistoryEntry] = useState<ShoeHistoryEntry | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const entries = await getShoeHistory(shoe.id);
      setHistory(entries);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteHistory = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this history entry?')) return;
    
    try {
      await deleteHistoryEntry(entryId);
      toast.success('History entry deleted');
      loadHistory();
      onSave();
    } catch (error) {
      console.error('Error deleting history entry:', error);
      toast.error('Failed to delete history entry');
    }
  };

  const handleEditHistory = (entry: ShoeHistoryEntry) => {
    setEditingHistoryEntry(entry);
  };

  const handleUpdateHistory = async (timestamp: string) => {
    if (!editingHistoryEntry) return;
    
    try {
      await updateHistoryEntry(editingHistoryEntry.id, timestamp);
      toast.success('History entry updated');
      setEditingHistoryEntry(null);
      loadHistory();
      onSave();
    } catch (error) {
      console.error('Error updating history entry:', error);
      toast.error('Failed to update history entry');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this shoe?')) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('shoes')
        .delete()
        .eq('id', shoe.id);

      if (error) throw error;
      
      toast.success('Shoe deleted successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error deleting shoe:', error);
      toast.error('Failed to delete shoe');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = shoe.image_url;
      
      if (newImage) {
        imageUrl = await uploadImage(newImage);
      }

      const { error } = await supabase
        .from('shoes')
        .update({
          name: formData.name,
          model: formData.model,
          colors: formData.colorway.split('/').map(c => c.trim()),
          nickname: formData.nickname || null,
          purchase_date: formData.purchase_date || null,
          purchase_price: parseCurrency(formData.purchase_price),
          category: formData.category,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', shoe.id);

      if (error) throw error;

      toast.success('Changes saved successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating shoe:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Edit Shoe</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload
              currentImage={shoe.image_url}
              onImageChange={setNewImage}
              disabled={isSubmitting}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
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
                <label className="block text-sm font-medium text-gray-700">
                  Colorway
                </label>
                <input
                  type="text"
                  name="colorway"
                  value={formData.colorway}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Red/White/Black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nickname
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Price
                </label>
                <CurrencyInput
                  value={formData.purchase_price}
                  onChange={(value) => setFormData(prev => ({ ...prev, purchase_price: value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="$0.00"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete Shoe
              </button>
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

          <ShoeHistory
            entries={history}
            onDelete={handleDeleteHistory}
            onEdit={handleEditHistory}
          />
        </div>
      </div>

      {editingHistoryEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">
                Edit {editingHistoryEntry.type === 'worn' ? 'Wear' : 'Cleaning'} Date
              </h3>
              <button
                onClick={() => setEditingHistoryEntry(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <input
                type="datetime-local"
                defaultValue={editingHistoryEntry.timestamp.slice(0, 16)}
                onChange={(e) => handleUpdateHistory(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}