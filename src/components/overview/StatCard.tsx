interface StatCardProps {
    label: string;
    value: string | number;
    accent?: 'default' | 'success' | 'error';
}

export default function StatCard({ label, value, accent = 'default' }: StatCardProps) {
    const accentClasses = {
        default: 'border-gray-200 text-gray-900',
        success: 'border-emerald-200 text-emerald-700',
        error: 'border-red-200 text-red-200'
    };

    return (
        <div className={`rounded-xl border bg-white p-5 shadow-sm ${accentClasses[accent]}`}>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
    );
}