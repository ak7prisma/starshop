export default function HistoryDetailPage({ params }: { params: { id: string } }) {

    const transactionId = params.id; 
    
    return (
        <div className="p-8 text-white min-h-screen">
            <h1 className="text-3xl font-bold">Detail Transaksi</h1>
            <p className="mt-4">
                ID Transaksi yang dicari: 
                <span className="font-mono bg-gray-700 p-1 rounded ml-2">{transactionId}</span>
            </p>
        </div>
    );
}