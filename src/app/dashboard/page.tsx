"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CreditCard, Clock, CheckCircle, Gamepad2, Loader2, Download, 
  Lock, Trophy, MoreHorizontal, ArrowRight, AlertCircle 
} from "lucide-react";

import { createClient } from "@/app/utils/client";
import type { TopupData } from "@/datatypes/TopupData";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const [transactions, setTransactions] = useState<TopupData[]>([]);
  const [productCount, setProductCount] = useState(0);
  
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [topGames, setTopGames] = useState<any[]>([]);

  const userRole = "boss"; 
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const { data: topupData, error: topupError } = await supabase
          .from('topup')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (topupError) throw topupError;

        const { count: prodCount, error: prodError } = await supabase
          .from('Products')
          .select('*', { count: 'exact', head: true });
        
        if (prodError) throw prodError;

        if (topupData) {
          const data = topupData as TopupData[];
          setTransactions(data);

          const normalize = (s: string) => (s || "").trim().toLowerCase();

          const pending = data.filter(t => {
            const s = normalize(t.status);
            return s === 'pending' || s === 'processing';
          }).length;
          setPendingCount(pending);

          const success = data.filter(t => normalize(t.status) === 'success').length;
          setSuccessCount(success);

          const revenue = data
            .filter(t => normalize(t.status) === 'success')
            .reduce((acc, curr) => acc + Number(curr.price), 0);
          setTotalRevenue(revenue);

          const gameSales: Record<string, { count: number; revenue: number }> = {};
          data.forEach((t) => {
            if (normalize(t.status) === 'success') {
                const gameName = t.idGame || "Unknown";
                if (!gameSales[gameName]) {
                    gameSales[gameName] = { count: 0, revenue: 0 };
                }
                gameSales[gameName].count += 1;
                gameSales[gameName].revenue += Number(t.price);
            }
          });

          const sortedGames = Object.entries(gameSales)
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3); 
            
          setTopGames(sortedGames);
        }

        if (prodCount !== null) setProductCount(prodCount);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatRupiah = (val: number) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const getStatusStyle = (status: string | undefined) => {
    const s = (status || "").trim().toLowerCase();
    switch(s) {
      case "success": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "processing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "canceled": 
      case "failed": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  if (isLoading) {
    return (
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="text-gray-400 animate-pulse">Syncing with database...</p>
        </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: userRole === "boss" ? formatRupiah(totalRevenue) : "Rp ••••••••", 
      trend: "Calculated from 'Success' orders only", 
      isPositive: true,
      icon: CreditCard,
      color: "blue",
      isRestricted: userRole !== "boss",
    },
    {
      title: "Pending Orders",
      value: `${pendingCount} Orders`,
      trend: "Needs immediate attention",
      isPositive: false,
      icon: Clock,
      color: "yellow",
      isRestricted: false,
    },
    {
      title: "Success Transactions",
      value: `${successCount}`,
      trend: `${transactions.length > 0 ? ((successCount / transactions.length) * 100).toFixed(1) : 0}% Success Rate`,
      isPositive: true,
      icon: CheckCircle,
      color: "green",
      isRestricted: false,
    },
    {
      title: "Active Products",
      value: `${productCount} Games`,
      trend: "Total games in catalog",
      isPositive: true,
      icon: Gamepad2,
      color: "purple",
      isRestricted: false,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1 font-medium">
             <span>{today}</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {greeting}, {userRole === 'boss' ? 'Boss' : 'Admin'}
          </h1>
          <p className="text-gray-400 mt-1">Real-time business insights</p>
        </div>
        <div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
                <Download size={18} /> Download Report
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-all duration-300 group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${
                stat.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                stat.color === 'yellow' ? 'bg-amber-500/10 text-amber-500' :
                stat.color === 'green' ? 'bg-emerald-500/10 text-emerald-500' :
                'bg-purple-500/10 text-purple-500'
              }`}>
                {stat.isRestricted ? <Lock size={24} /> : <stat.icon size={24} />}
              </div>
              
              {!stat.isRestricted && (
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-800 text-gray-400`}>
                   <span>Live</span>
                </div>
              )}
            </div>
            
            <h3 className={`text-2xl font-bold mb-1 tracking-tight ${
                stat.isRestricted ? "text-gray-600 blur-[2px] select-none" : "text-white"
            }`}>
                {stat.value}
            </h3>

            <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
            <p className={`text-xs mt-3 border-t border-gray-800 pt-3 text-gray-500`}>
               {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
            <div>
               <h3 className="font-bold text-lg text-white">Recent Transactions</h3>
               <p className="text-xs text-gray-500">Real-time transaction records</p>
            </div>
            <Link href="/dashboard/transactions" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
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
                                {trx.idGame ? trx.idGame.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div>
                                <div className="font-medium text-white">{trx.idGame}</div>
                                <div className="text-xs text-gray-500 font-mono">#{trx.idTopup}</div>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                            {trx.amount?.toString()}
                        </td>
                        <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusStyle(trx.status)}`}>
                            {trx.status}
                        </span>
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
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl h-fit">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <Trophy size={18} className="text-yellow-500" /> Top Selling
                    </h3>
                    <p className="text-xs text-gray-500">Products with highest sales performance</p>
                </div>
                <button className="text-gray-400 hover:text-white">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="space-y-5">
                {topGames.length > 0 ? (
                    topGames.map((game, idx) => (
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
                                        style={{ width: `${(game.count / (transactions.length || 1)) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1 text-right">{game.count} sales</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-500 text-sm">
                        <AlertCircle className="mx-auto mb-2 opacity-50" />
                        No sales data yet (Wait for success orders).
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800">
                <Link href="/dashboard/products" className="block w-full text-center py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors border border-gray-700">
                    Manage Products
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}