import React from 'react';
import CompetitorForm from '@/components/CompetitorForm';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Competitor Earnings Tracker
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Set up automated tracking and analysis for your competitors' earnings reports
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <CompetitorForm />
      </main>
    </div>
  );
}