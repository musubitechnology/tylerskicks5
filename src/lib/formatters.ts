import { format } from 'date-fns';
import type { Shoe } from './types';

export function formatDate(date: string | null | undefined): string {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy');
}

export function parseDate(dateStr: string): string | null {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function parseCurrency(value: string): number | null {
  if (!value) return null;
  const number = Number(value.replace(/[^0-9.-]+/g, ''));
  return isNaN(number) ? null : number;
}

export function formatCollectionForSpreadsheet(shoes: Shoe[]): string {
  const headers = [
    'Name',
    'Brand',
    'Model',
    'Colors',
    'Size',
    'Category',
    'Nickname',
    'Purchase Date',
    'Purchase Price',
    'Last Worn',
    'Last Cleaned',
    'Wear Count'
  ].join('\t');

  const rows = shoes.map(shoe => [
    shoe.name,
    shoe.brand,
    shoe.model,
    shoe.colors.join(' / '),
    shoe.size || '',
    shoe.category,
    shoe.nickname || '',
    shoe.purchase_date ? formatDate(shoe.purchase_date) : '',
    shoe.purchase_price ? formatCurrency(shoe.purchase_price) : '',
    shoe.last_worn ? formatDate(shoe.last_worn) : '',
    shoe.last_cleaned ? formatDate(shoe.last_cleaned) : '',
    shoe.wear_count
  ].join('\t'));

  return [headers, ...rows].join('\n');
}