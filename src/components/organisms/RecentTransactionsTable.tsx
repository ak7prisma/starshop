import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { TopupData } from '@/datatypes/TopupData';

interface RecentTransactionsTableProps {
    transactions: TopupData[];
}

export const RecentTransactionsTable = ({ transactions }: RecentTransactionsTableProps) => {

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

    const getStatusVariant = (status: string) => {
        const s = status?.toLowerCase() || "";
        switch (s) {
            case "success": return "success";
            case "pending": return "warning";
            case "processing": return "info";
            case "canceled":
            case "failed": return "error";
            default: return "default";
        }
    };

    return (
        <Card className="lg:col-span-2 p-0! overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <div>
                    <h3 className="font-bold text-lg text-white">Recent Transactions</h3>
                    <p className="text-xs text-gray-500">Live data from 'topup' table</p>
                </div>
                <Link href="/dashboard/transactions" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors">
                    View All <ArrowRight size={16} />
                </Link>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-950/50 text-gray-400 uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">ID & Game</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                        {transactions.length > 0 ? (
                            transactions.slice(0, 5).map((trx) => (
                                <tr key={trx.idTopup} className="hover:bg-gray-800/40 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-700">
                                                {trx.idGame.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{trx.idGame}</div>
                                                <div className="text-xs text-gray-500 font-mono">#{trx.idTopup}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {trx.amount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={getStatusVariant(trx.status)}>
                                            {trx.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-white">
                                        {formatRupiah(Number(trx.price))}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};
