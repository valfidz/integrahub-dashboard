interface ResultPanelProps {
    title: string;
    data: Record<string, any> | null;
    variant?: 'default' | 'success' | 'error';
}

export default function ResultPanel({ title, data, variant = 'default' }: ResultPanelProps) {
    const variantClasses = {
        default: 'border-gray-200',
        success: 'border-emerald-300 bg-emerald-50',
        error: 'border-red-300 bg-red-50',
    };

    return (
        <div className={`rounded-lg border p-4 ${variantClasses[variant]}`}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {title}
            </h4>
            {data ? (
                <pre className="text-xs font-mono whitespace-pre-wrap wrap-break-word text-gray-800">
                    {JSON.stringify(data, null, 2)}
                </pre>
            ) : (
                <p className="text-gray-400 text-sm">Nothing sent yet.</p>
            )}
        </div>
    );
} 