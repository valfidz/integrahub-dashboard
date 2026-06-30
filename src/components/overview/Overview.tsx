'use client';

import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import StatCard from "./StatCard";
import TimeSeriesChart from "./TimeSeriesChart";
import SourceBreakdownChart from "./SourceBreakdownChart";
import { fetchStats, fetchTimeSeries, StatsResponse, TimeSeriesPoint } from "@/lib/api";

export interface OverviewRef {
    refresh: () => void;
}

const Overview = forwardRef<OverviewRef>((_, ref) => {
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            const [statsData, timeSeriesData] = await Promise.all([
                fetchStats(),
                fetchTimeSeries(24),
            ]);
            setStats(statsData);
            setTimeSeries(timeSeriesData);
        } catch (err) {
            console.error('Failed to load overview data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useImperativeHandle(ref, () => ({
        refresh: loadData,
    }));

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) {
        return <p className="text-gray-400 text-sm">Loading overview...</p>
    }

    return (
        <section className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Events" value={stats?.total ?? 0} />
                <StatCard label="Success" value={stats?.success ?? 0} accent="success" />
                <StatCard label="Errors" value={stats?.error ?? 0} accent="error" />
                <StatCard label="Success Rate" value={stats?.successRate ?? "0%"} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <TimeSeriesChart data={timeSeries} />
                <SourceBreakdownChart data={stats?.bySource ?? []} />
            </div>
        </section>
    );
});

Overview.displayName = 'Overview';

export default Overview;