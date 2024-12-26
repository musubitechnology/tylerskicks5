import React, { useState, useEffect } from 'react';
import { Quote, getRandomQuote } from '../lib/quotes';

export function QuoteDisplay() {
  const [quote, setQuote] = useState<Quote>(getRandomQuote());

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(getRandomQuote());
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <blockquote>
        <p className="text-lg text-gray-700 italic mb-4">
          "{quote.text}"
        </p>
        <footer className="text-sm text-gray-600">
          — <cite className="font-medium">{quote.author}</cite>
        </footer>
      </blockquote>
    </div>
  );
}