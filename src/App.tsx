import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { PublicCollectionView } from './components/PublicCollectionView';
import { QuoteDisplay } from './components/QuoteDisplay';
import { Footprints } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useShoes } from './lib/hooks/useShoes';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { shoes, loading } = useShoes(refreshTrigger);

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    setIsAdmin(!!session);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      <header className="bg-byu-navy shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Footprints className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Tyler's Shoe Collection</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!isAdmin ? (
          <div className="space-y-8">
            <QuoteDisplay />
            <AdminLogin onLogin={() => setIsAdmin(true)} />
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-byu-navy mb-6">Collection Preview</h2>
              <PublicCollectionView shoes={shoes} loading={loading} />
            </div>
          </div>
        ) : (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}