import Link from 'next/link';
import { Trophy, MoreHorizontal, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';

interface TopGame {
    name: string;
    count: number;
    revenue: number;
}

interface TopSellingListProps {
    games: TopGame[];
    totalTransactions: number;
    userRole: string;
}

export const TopSellingList = ({ games, totalTransactions, userRole }: TopSellingListProps) => {

    const formatRupiah = (val: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

    return (
        <Card className="h-fit">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <Trophy size={18} className="text-yellow-500" /> Top Selling
                    </h3>
                    <p className="text-xs text-gray-500">Calculated from success orders</p>
                </div>
                <button className="text-gray-400 hover:text-white">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="space-y-5">
                {games.length > 0 ? (
                    games.map((game, idx) => (
                        <div key={idx} className="flex items-center gap-4 group">
                            <div className="font-bold text-gray-600 text-lg w-4">{idx + 1}</div>
                            <div className={`w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                                {game.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-medium text-white text-sm group-hover:text-blue-400 transition-colors truncate w-24">{game.name}</h4>
                                    <span className={`text-xs font-bold ${userRole === 'boss' ? 'text-gray-400' : 'text-gray-600 blur-sm'}`}>
                                        {formatRupiah(game.revenue)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full bg-blue-500 opacity-80`}
                                        style={{ width: `${(game.count / (totalTransactions || 1)) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1 text-right">{game.count} sales</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-500 text-sm">
                        <AlertCircle className="mx-auto mb-2 opacity-50" />
                        No sales data yet.
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800">
                <Link href="/dashboard/products" className="block w-full text-center py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors border border-gray-700">
                    Manage Products
                </Link>
            </div>
        </Card>
    );
};
