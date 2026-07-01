interface Props {
    status: 'success' | 'error';
}

export default function StatusBadge({ status }: Props) {
    const isSuccess = status === 'success';

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                isSuccess
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
            }`}
        >
            {isSuccess ? 'Success' : 'Error'}
        </span>
    )
}