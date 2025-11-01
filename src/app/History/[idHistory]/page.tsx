// app/history/[id]/page.tsx
export default function HistoryDetailPage({ params }: { params: { id: string } }) {
    // Parameter 'id' akan berisi ID Topup (misalnya '4')
    const transactionId = params.id; 
    
    return (
        <div className="p-8 text-white min-h-screen">
            <h1 className="text-3xl font-bold">Detail Transaksi</h1>
            <p className="text-xl text-yellow-500">
                Langkah Berikutnya: Midtrans Snap telah berhasil.
            </p>
            <p className="mt-4">
                ID Transaksi yang dicari: 
                <span className="font-mono bg-gray-700 p-1 rounded ml-2">{transactionId}</span>
            </p>
            <p className="mt-4">
                Status transaksi ini masih perlu diverifikasi oleh Webhook dari Midtrans.
            </p>
        </div>
    );
}