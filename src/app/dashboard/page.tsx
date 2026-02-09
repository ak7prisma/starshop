"use client";

import { useEffect, useState } from "react";
import { Loader2, Download } from "lucide-react";
import { exportExcel } from "../lib/exportExcel";
import { createClient } from "@/app/utils/client";
import type { TopupData } from "@/datatypes/TopupData";
import { StatsCard } from "./component/StatsCard";
import { RecentTransactionsTable } from "./component/RecentTransactionsTable";
import { TopSellingList } from "./component/TopSellingList";
import { getStatsList } from "../utils/dashboardStats";
import { formatRupiah } from "../utils/formatRupiah";
import { greetingTime, today} from "@/app/utils/greetingTime"

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

        const { data: topupData } = await supabase
          .from('topup')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        const { count: prodCount } = await supabase
          .from('Products')
          .select('*', { count: 'exact', head: true });
        
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

  const statsList = getStatsList({
    userRole,
    totalRevenue,
    pendingCount,
    successCount,
    transactionsCount: transactions.length,
    productCount,
    formatRupiah
  });

  if (isLoading) {
    return (
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="text-gray-400 animate-pulse">Syncing with database...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1 font-medium">
             <span>{today}</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {greetingTime()}, {userRole === 'boss' ? 'Boss' : 'Admin'}
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
        {statsList.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        
        {/* Table */}
        <RecentTransactionsTable transactions={transactions} />

        {/* Sidebar */}
        <TopSellingList 
            games={topGames} 
            totalTransactions={transactions.length} 
            userRole={userRole} 
        />

      </div>
    </div>
  );
}