"use client";

import { useState, useEffect, useCallback } from "react";
import { TopupData } from "@/datatypes/TopupData";
import {
  Search, ChevronDown, Check, X, Copy, Eye, FileText, XCircle, Loader2, SearchX
} from "lucide-react";
import { createClient } from "@/app/utils/client";
import { Badge, getBadgeVariant } from "@/components/ui/Badge";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TopupData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrx, setSelectedTrx] = useState<TopupData | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  const supabase = createClient();

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('topup')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      let filteredResult = data || [];
      if (activeTab !== "All") {
        filteredResult = filteredResult.filter(t =>
          t.status?.toLowerCase() === activeTab.toLowerCase()
        );
      }
      setTransactions(filteredResult);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      showToast("Gagal mengambil data transaksi.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [supabase, activeTab, showToast]);

  useEffect(() => {
    setIsMounted(true);
    fetchTransactions();
  }, [fetchTransactions]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('topup')
        .update({ status: newStatus.toLowerCase() })
        .eq('idTopup', id);

      if (error) throw error;

      setTransactions((prev) =>
        prev.map((item) => item.idTopup === id ? { ...item, status: newStatus } : item)
      );
      showToast(`Order #${id} updated to ${newStatus}`, "success");
    } catch (error) {
      showToast("Gagal update status", "error");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showToast(`${label} Copied!`, 'success');
  };

  const formatRupiah = (val: number | string) => {
    const num = Number(val);
    if (isNaN(num)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
  }

  const filteredData = transactions.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.uid?.toString().toLowerCase().includes(term) ||
      t.idGame?.toLowerCase().includes(term) ||
      t.idTopup?.toString().includes(term)
    );
  });

  if (!isMounted) {
    return <div className="min-h-screen bg-[#0B1120]" />;
  }

  return (
    <div className="space-y-6 relative min-h-screen pb-10">
      {toast?.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
          <div className="bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3">
            <div className={`p-1 rounded-full ${toast.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
              {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
            </div>
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {selectedTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B1120] border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

             <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 <FileText size={20} className="text-blue-500" />
                 Detail
               </h3>
               <button onClick={() => setSelectedTrx(null)} className="text-gray-400 hover:text-white">
                 <XCircle size={24} />
               </button>
             </div>
             <div className="p-6">

                <p className="text-white">ID: {selectedTrx.idTopup}</p>
                <button onClick={() => setSelectedTrx(null)} className="mt-4 bg-blue-600 px-4 py-2 rounded">Close</button>
             </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-gray-400 text-sm mt-1">Manage orders from database.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchTransactions} 
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-700 flex items-center gap-2"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        {/* Search & Tabs */}
        <div className="p-5 border-b border-gray-800 flex flex-col lg:flex-row gap-4 justify-between items-center bg-gray-900/50">
          <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800">
            {["All", "Pending", "Processing", "Success"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table content */}
        <div className="overflow-x-auto">
           {isLoading ? (
             <div className="p-20 flex justify-center"><Loader2 className="animate-spin" /></div>
           ) : (
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-950 text-gray-400">
                   <tr>
                     <th className="px-6 py-4">Transaction Info</th>
                     <th className="px-6 py-4">Game Item</th>
                     <th className="px-6 py-4">Payment</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                   {filteredData.map(trx => (
                     <tr key={trx.idTopup} className="hover:bg-gray-800/40">
                        <td className="px-6 py-4">#{trx.idTopup}</td>
                        <td className="px-6 py-4">{trx.idGame}</td>
                        <td className="px-6 py-4">{formatRupiah(trx.price)}</td>
                        <td className="px-6 py-4">
                           <Badge variant={getBadgeVariant(trx.status)}>{trx.status}</Badge>
                        </td>
                        <td className="px-6 py-4">
                           <button onClick={() => setSelectedTrx(trx)}><Eye size={16} /></button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           )}
        </div>
      </div>
    </div>
  );
}