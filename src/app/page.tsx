'use client'

import Overview from "@/components/overview/Overview";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">IntegraHub Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Real-time monitoring for the integrahub integration service
          </p>
        </header>

        <Overview />
      </div>
    </main>
  );
}
