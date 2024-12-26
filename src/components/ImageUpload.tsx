import React from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (file: File) => void;
  disabled?: boolean;
}

export function ImageUpload({ currentImage, onImageChange, disabled }: ImageUploadProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Shoe Image
      </label>
      <div className="flex items-center gap-4">
        {currentImage && (
          <img
            src={currentImage}
            alt="Current shoe"
            className="w-24 h-24 object-cover rounded-md"
          />
        )}
        <label className="flex-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500">
                Upload a new image
              </span>
            </div>
          </div>
          <input
            type="file"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageChange(file);
            }}
            accept="image/*"
            disabled={disabled}
          />
        </label>
      </div>
    </div>
  );
}