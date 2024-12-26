import type { Shoe } from './types';

export function getRandomShoe(shoes: Shoe[]): Shoe | null {
  if (shoes.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * shoes.length);
  return shoes[randomIndex];
}

export function getLeastWornShoe(shoes: Shoe[]): Shoe | null {
  if (shoes.length === 0) return null;
  
  return shoes.reduce((leastWorn, current) => {
    if (!current.last_worn) return current;
    if (!leastWorn.last_worn) return leastWorn;
    
    const currentDate = new Date(current.last_worn);
    const leastWornDate = new Date(leastWorn.last_worn);
    
    return currentDate < leastWornDate ? current : leastWorn;
  });
}

export function getRandomShoes(shoes: Shoe[], count: number): Shoe[] {
  const shuffled = [...shoes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shoes.length));
}