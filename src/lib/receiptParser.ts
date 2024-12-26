import { Shoe } from './types';

interface ParsedReceipt {
  name: string;
  size: number | null;
  price: number | null;
  orderNumber: string;
  orderDate: string | null;
}

export function parseNikeReceipt(text: string): ParsedReceipt | null {
  try {
    // Extract product name
    const nameMatch = text.match(/product\s*(.*?)(?=Men's|Women's|Size:|$)/s);
    const name = nameMatch?.[1]?.trim() || '';

    // Extract size
    const sizeMatch = text.match(/Size:\s*M\s*(\d+\.?\d*)/);
    const size = sizeMatch ? parseFloat(sizeMatch[1]) : null;

    // Extract price
    const priceMatch = text.match(/\$(\d+\.\d{2})/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : null;

    // Extract order number
    const orderMatch = text.match(/Order Number\s*([A-Z0-9]+)/);
    const orderNumber = orderMatch?.[1] || '';

    // Extract order date
    const dateMatch = text.match(/Order Date\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
    const orderDate = dateMatch?.[1] || null;

    if (!name || !orderNumber) {
      return null;
    }

    return {
      name,
      size,
      price,
      orderNumber,
      orderDate: orderDate ? new Date(orderDate).toISOString().split('T')[0] : null,
    };
  } catch (error) {
    console.error('Error parsing receipt:', error);
    return null;
  }
}