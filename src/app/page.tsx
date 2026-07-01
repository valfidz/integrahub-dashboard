'use client'

import { useRef } from "react";
import Overview, { OverviewRef } from "@/components/overview/Overview";
import WebhookTester from "@/components/tester/WebhookTester";
import LogTable, {LogTableRef} from "@/components/logs/LogTable";

export default function Home() {
  const overviewRef = useRef<OverviewRef>(null);
  const logTableRef = useRef<LogTableRef>(null);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">IntegraHub Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Real-time monitoring for the integrahub integration service
          </p>
        </header>

        <Overview ref={overviewRef} />
        <WebhookTester onSent={() => overviewRef.current?.refresh()} />
        <LogTable ref={logTableRef} />
      </div>
    </main>
  );
}
