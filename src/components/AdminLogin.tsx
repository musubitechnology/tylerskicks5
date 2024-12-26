import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { signInAnonymously } from '../lib/auth';

const CORRECT_PASSWORD = '117';
const LARRY_QUOTES = [
  "Pretty, pretty, pretty wrong password!",
  "Do you respect wood? Because you certainly don't respect passwords!",
  "I'm trying to elevate small talk to medium talk here, and you're giving me wrong passwords!",
  "That password... not so good. Not so good at all.",
];

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsLoading(true);
      try {
        await signInAnonymously();
        onLogin();
      } catch (error) {
        console.error('Authentication error:', error);
        toast.error('Failed to authenticate. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      const randomQuote = LARRY_QUOTES[Math.floor(Math.random() * LARRY_QUOTES.length)];
      toast.error(randomQuote, {
        icon: '🤔',
        duration: 3000,
      });
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-6 h-6 text-byu-navy" />
        <h2 className="text-xl font-bold text-byu-navy">Tyler Access</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-byu-royal focus:ring-byu-royal"
            placeholder="Enter the secret password..."
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-byu-navy text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Authenticating...' : 'Enter Collection'}
        </button>
      </form>
    </div>
  );
}