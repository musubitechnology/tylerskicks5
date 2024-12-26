import React, { useState, useEffect } from 'react';
import { formatCurrency, parseCurrency } from '../lib/formatters';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function CurrencyInput({
  value,
  onChange,
  className = '',
  placeholder = '$0.00',
  disabled = false,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value);
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Remove all non-numeric characters except decimal point
    const numericValue = input.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    // Format for display while typing
    const formattedValue = sanitizedValue ? `$${sanitizedValue}` : '';
    setDisplayValue(formattedValue);

    // Convert to proper currency format for state
    const parsed = parseCurrency(sanitizedValue);
    if (parsed !== null || !sanitizedValue) {
      onChange(parsed ? formatCurrency(parsed) : '');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Remove currency symbol and formatting when focused
    setDisplayValue(value.replace(/[^0-9.]/g, ''));
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Reformat on blur
    setDisplayValue(value || '');
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}