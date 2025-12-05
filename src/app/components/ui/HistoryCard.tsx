import React from 'react';
import HistoryStatusBadge from './HistoryStatusBadge';
import type { TopupData } from '@/datatypes/TopupData';
import Link from 'next/link';

interface HistoryItemProps {
    item: TopupData;
}

export default function HistoryCard({ item }: Readonly<HistoryItemProps>) {
    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

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
                        {item.amount > 0 && (
                            <p className="flex items-center gap-2">
                                <span className="opacity-50 min-w-20">{item.Products?.itemName}</span>
                                : {item.amount}
                            </p>
                        )}
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
                            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Lihat Bukti
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}