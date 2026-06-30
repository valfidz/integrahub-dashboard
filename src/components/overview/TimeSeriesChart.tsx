'use client';

import {
    LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    YAxis
} from 'recharts'
import { TimeSeriesPoint } from '@/lib/api';

interface Props {
    data: TimeSeriesPoint[];
}

export default function TimeSeriesChart({ data }: Props) {
    const formatted = data.map((point) => ({
        ...point,
        label: new Date(point.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        }),
    }));

    return (
        <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
            <h3 className='text-sm font-medium text-gray-500 mb-4'>Events Over Time</h3>
            {data.length === 0 ? (
                <p className='text-gray-400 text-sm py-12 text-center'>
                    No events in this time range yet. Send a test webhook to see data here.
                </p>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={formatted}>
                            <CartesianGrid strokeDasharray="3 3" stroke='#f0f0f0' />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="success" stroke='#10b981' strokeWidth={2} name='Success' />
                            <Line type="monotone" dataKey="error" stroke='#ef4444' strokeWidth={2} name='Error' />
                        </LineChart>
                    </ResponsiveContainer>
                )
            }
        </div>
    );
}