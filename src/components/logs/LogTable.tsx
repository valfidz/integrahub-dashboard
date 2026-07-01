'use client';

import { useEffect, useState, useCallback, forwardRef, useImperativeHandle, Fragment } from "react";
import { fetchLogs, IntegrationLog } from "@/lib/api";
import StatusBadge from "./StatusBadge";

export interface LogTableRef {
    refresh: () => void;
}

const STATUS_OPTIONS = ['all', 'success', 'error'];

const LogTable = forwardRef<LogTableRef>((_, ref) => {
    const [logs, setLogs] = useState<IntegrationLog[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sourceFilter, setSourceFilter] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [debouncedSource, setDebouncedSource] = useState(sourceFilter);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSource(sourceFilter);
        }, 400);

        return () => clearTimeout(timer);
    }, [sourceFilter])

    const loadLogs = useCallback(async () => {
        setLoading(true);

        try {
            const data = await fetchLogs({
                status: statusFilter === 'all' ? undefined : statusFilter,
                source: debouncedSource.trim() === '' ? undefined : debouncedSource.trim(),
                limit: 50
            })

            setLogs(data.logs);
            setTotal(data.total);
        } catch (err) {
            console.error('Failed to load logs', err);
        } finally {
            setLoading(false);
        }

    }, [statusFilter, debouncedSource]);

    useImperativeHandle(ref, () => ({
        refresh: loadLogs,
    }));

    useEffect(() => {
        loadLogs();
    }, [loadLogs]);

    function formatTime(iso: string) {
        return new Date(iso).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-medium text-gray-500">
                    Integration Logs {total > 0 && <span className="text-gray-400">({total} total)</span>}
                </h3>

                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700"
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt === 'all' ? 'All statuses' : opt}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Filter by source..."
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white w-40 text-gray-700"
                    />
                </div>
            </div>

            {loading ? (
                <p className="text-gray-400 text-sm py-8 text-center">Loading logs...</p>
            ) : logs.length === 0 ? (
                <p className="text-gray-400 text-sm py-8 text-center">
                    No logs match these filters yet.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-400 border-b border-gray-100">
                                <th className="py-2 pr-4 font-medium">Status</th>
                                <th className="py-2 pr-4 font-medium">Event</th>
                                <th className="py-2 pr-4 font-medium">Source</th>
                                <th className="py-2 pr-4 font-medium">Summary</th>
                                <th className="py-2 pr-4 font-medium">Time</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.map((log) => (
                                <Fragment key={log.id}>
                                    <tr
                                        key={log.id}
                                        onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                                        className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition"
                                    >
                                        <td className="py-2 pr-4"><StatusBadge status={log.status} /></td>
                                        <td className="py-2 pr-4 font-mono text-xs text-gray-700">{log.event}</td>
                                        <td className="py-2 pr-4 text-gray-600">{log.source}</td>
                                        <td className="py-2 pr-4 text-gray-600 max-w-xs truncate">{log.summary}</td>
                                        <td className="py-2 pr-4 text-gray-600 whitespace-nonwrap">{formatTime(log.createdAt)}</td>
                                    </tr>

                                    {expandedId === log.id && (
                                        <tr key={`${log.id}-expanded`} className="bg-gray-50">
                                            <td colSpan={5} className="px-4 py-3">
                                                {log.errorMsg && (
                                                    <p className="text-xs text-red-600 mb-2">
                                                        <span className="font-medium">Error:</span> {log.errorMsg}
                                                    </p>
                                                )}
                                                <pre className="text-xs font-mono bg-gray-900 text-gray-100 rounded-lg p-3 overfol-x-auto">
                                                    {JSON.stringify(log.rawPayload, null, 2)}
                                                </pre>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
});

LogTable.displayName = 'LogTable';

export default LogTable;