'use client'

import { useEffect, useState } from "react";
import { fetchStats, StatsResponse } from "@/lib/api";

export default function Home() {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
  }, []);
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-900">IntegraHub Dashboard</h1>
      <p className="text-gray-500 mt-2">{ JSON.stringify(stats, null, 2) }</p>
    </main>
  );
}
