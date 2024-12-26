import React, { useState } from 'react';
import { Upload, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CurrencyInput } from './CurrencyInput';
import { parseCurrency } from '../lib/formatters';
import toast from 'react-hot-toast';
import type { Shoe } from '../lib/types';

interface AddShoeFormProps {
  onSuccess?: () => void;
}

export function AddShoeForm({ onSuccess }: AddShoeFormProps) {
  const [formData, setFormData] = useState({
    modelName: '',
    releaseYear: '',
    colorway: '',
    nickname: '',
    purchaseDate: '',
    purchasePrice: '',
    size: '',
    category: 'Other' as Shoe['category'],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = '';
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('shoe-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('shoe-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('shoes')
        .insert([
          {
            name: formData.modelName,
            brand: 'Jordan',
            model: `${formData.releaseYear} Release`,
            image_url: imageUrl,
            colors: formData.colorway.split('/').map(c => c.trim()),
            nickname: formData.nickname || null,
            purchase_date: formData.purchaseDate || null,
            purchase_price: parseCurrency(formData.purchasePrice),
            size: formData.size ? parseFloat(formData.size) : null,
            category: formData.category,
          },
        ]);

      if (insertError) throw insertError;

      toast.success('Shoe added to collection!');
      setFormData({
        modelName: '',
        releaseYear: '',
        colorway: '',
        nickname: '',
        purchaseDate: '',
        purchasePrice: '',
        size: '',
        category: 'Other',
      });
      setImageFile(null);
      onSuccess?.();
      
    } catch (error) {
      console.error('Error adding shoe:', error);
      toast.error('Failed to add shoe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="modelName" className="block text-sm font-medium text-gray-700">
            Model Name
          </label>
          <input
            type="text"
            id="modelName"
            name="modelName"
            value={formData.modelName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Air Jordan 1 Retro High OG 'Chicago'"
            required
          />
        </div>

        <div>
          <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-700">
            Release Year
          </label>
          <input
            type="text"
            id="releaseYear"
            name="releaseYear"
            value={formData.releaseYear}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="2015"
            required
          />
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700">
            Size
          </label>
          <input
            type="number"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            step="0.5"
            min="4"
            max="18"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="10.5"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
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
          <label htmlFor="colorway" className="block text-sm font-medium text-gray-700">
            Colorway
          </label>
          <input
            type="text"
            id="colorway"
            name="colorway"
            value={formData.colorway}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Black/Red/White"
            required
          />
        </div>

        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
            Nickname
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Sick VGK shoes"
          />
        </div>

        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
            Purchase Date
          </label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">
            Purchase Price
          </label>
          <CurrencyInput
            value={formData.purchasePrice}
            onChange={(value) => setFormData(prev => ({ ...prev, purchasePrice: value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="$0.00"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Upload Picture
          </label>
          <div className="mt-1 flex items-center">
            <label className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500">
                    {imageFile ? imageFile.name : 'Upload a file'}
                  </span>
                </div>
              </div>
              <input
                id="image"
                name="image"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save and Add to Collection'}
        </button>
      </div>
    </form>
  );
}