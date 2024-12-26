export interface Quote {
  author: string;
  text: string;
}

export const quotes: Quote[] = [
  { author: "Barack Obama", text: "Tyler King's collection of Jordans represents more than just sneakers—it symbolizes perseverance, creativity, and cultural influence." },
  { author: "Pope Francis", text: "Tyler King's collection is a testament to the power of shared passion. His collection reminds us that beauty can be found in every step." },
  { author: "Keanu Reeves", text: "Tyler King's Jordans remind us that sometimes, it's the simple things that make the biggest impact—his collection is proof of that." }
];

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}