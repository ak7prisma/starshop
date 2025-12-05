export default function HistoryStatusBadge({ status }: Readonly<{ status: string }>) {
    const getStatusStyle = (s: string) => {
        switch (s?.toLowerCase()) {
            case 'success':
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'failed':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
            {status || 'Unknown'}
        </span>
    );
}