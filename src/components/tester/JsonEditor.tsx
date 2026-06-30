'use client';

interface Props {
    value: string;
    onChange: (value: string) => void;
    error: string | null;
}

export default function JsonEditor({ value, onChange, error }: Props) {
    return (
        <div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={10}
                spellCheck={false}
                className={`w-full font-mono text-sm rounded-lg border p-3 bg-gray-900 text-gray-100 focus:outline-none focus: ring-2 ${
                    error ? 'border-red-400 focus:ring-red-300' : 'border-gray-700 focus:ring-indigo-300'
                }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}