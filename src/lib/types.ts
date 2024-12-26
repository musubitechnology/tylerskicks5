export interface Shoe {
  id: string;
  name: string;
  brand: string;
  model: string;
  image_url?: string;
  colors: string[];
  nickname?: string;
  purchase_date?: string;
  purchase_price?: number;
  size?: number;
  last_worn?: string;
  last_cleaned?: string;
  wear_count: number;
  category: 'Basketball' | 'Casual' | 'Dress' | 'Golf' | 'Slides' | 'Other';
  created_at: string;
  updated_at: string;
}

export interface ShoeFormData {
  modelName: string;
  releaseYear: string;
  colorway: string;
  nickname: string;
  purchaseDate: string;
  purchasePrice: string;
  size: string;
  category: Shoe['category'];
}

export interface ShoeHistoryEntry {
  id: string;
  shoe_id: string;
  type: 'worn' | 'cleaned';
  timestamp: string;
  created_at: string;
}