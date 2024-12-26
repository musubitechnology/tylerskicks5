export function generateFileName(originalName: string): string {
  const fileExt = originalName.split('.').pop();
  return `${Math.random()}.${fileExt}`;
}

export function parseColorway(colorway: string): string[] {
  return colorway.split('/').map(color => color.trim());
}