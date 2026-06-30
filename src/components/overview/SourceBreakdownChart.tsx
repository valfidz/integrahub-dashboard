'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface Props {
    data: { source: string; count: number }[];
}

export default function SourceBreakdownChart({ data }: Props) {
    return (
        <div className='rounded-xl border border-gray-200 bg-white p-5 shadow-sm'>
            <h3 className='text-sm font-medium text-gray-500 mb-4'>Events by Source</h3>
            {data.length === 0 ? (
                <p className='text-gray-400 text-sm py-12 text-center'>No data yet.</p>
            ) : (
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={data} layout='vertical' margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke='#f0f0f0' />
                        <XAxis type='number' allowDecimals={false} tick={{ fontSize: 12 }} />
                        <YAxis type='category' dataKey="source" tick={{ fontSize: 12 }} width={80} />
                        <Tooltip />
                        <Bar dataKey="count" fill='#6366f1' radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}