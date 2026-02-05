import HistoryStatusBadge from './HistoryStatusBadge';
import type { TopupData } from '@/datatypes/TopupData';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';
import { formatRupiah } from '@/app/utils/formatRupiah';

interface HistoryItemProps {
    item: TopupData;
}

export default function HistoryCard({ item }: Readonly<HistoryItemProps>) {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-[#181B2B] rounded-2xl p-6 border-2 border-[#2D3142] hover:border-indigo-500/30 transition-all duration-300 shadow-xl group">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                
                <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-200 group-hover:text-indigo-400 duration-300 transition-colors">
                            {item.Products?.nameProduct}
                        </h3>
                        <HistoryStatusBadge status={item.status} />
                    </div>

                    <div className="text-sm text-gray-400 space-y-1">
                        <p className="flex items-center gap-2">
                            <span className="opacity-50 min-w-20">Id Game</span>
                            : {item.idGame}
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="opacity-50 min-w-20">Tanggal</span>
                            : {formatDate(item.created_at)}
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="opacity-50 min-w-20">Metode</span>
                            : {item.paymentMethod || '-'}
                        </p>
                         <p className="flex items-center gap-2">
                            <span className="opacity-50 min-w-20">{item.Products?.itemName}</span>
                            : {item.amount || '-'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:items-end justify-between gap-4 border-t md:border-t-0 border-[#2D3142] pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                        <p className="text-sm text-gray-500 mb-1">Total Bayar</p>
                        <p className="text-xl font-bold text-indigo-400">
                            {formatRupiah(item.price)}
                        </p>
                    </div>

                   {item.paymentProofUrl && (
                        <Link
                            href={item.paymentProofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-slate-300 transition-colors"
                        >
                            <FaEye size={16}/> 
                            Lihat Bukti
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}