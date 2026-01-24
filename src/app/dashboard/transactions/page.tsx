"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase"; 
import { TopupData } from "@/datatypes/TopupData"; 
import { 
  Search, ChevronDown, Check, X, Copy, Eye, FileText, XCircle, Loader2, SearchX
} from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TopupData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrx, setSelectedTrx] = useState<TopupData | null>(null);
  
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching transactions..."); 

      let query = supabase
        .from('topup') 
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Supabase Error:", error.message); 
        throw error;
      }
      
      console.log("Data fetched:", data); 

      let filteredResult = data || [];
      if (activeTab !== "All") {
        filteredResult = filteredResult.filter(t => 
          t.status?.toLowerCase() === activeTab.toLowerCase()
        );
      }

      setTransactions(filteredResult);

    } catch (error) {
      console.error("Error fetching transactions:", error);
      showToast("Gagal mengambil data transaksi. Cek Console.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [activeTab]); 

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
      console.error("Error updating status:", error);
      showToast("Gagal update status", "error");
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 3000);
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

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "processing": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "canceled": 
      case "failed": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400";
    }
  };

  const filteredData = transactions.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.uid?.toString().toLowerCase().includes(term) || 
      t.idGame?.toLowerCase().includes(term) ||
      t.idTopup?.toString().includes(term)
    );
  });

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
                Transaction Detail
              </h3>
              <button onClick={() => setSelectedTrx(null)} className="text-gray-400 hover:text-white transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Order ID</p>
                  <div className="flex items-center gap-2 text-white font-mono bg-gray-800/50 p-2 rounded border border-gray-700 text-sm">
                    #{selectedTrx.idTopup}
                    <button onClick={() => copyToClipboard(selectedTrx.idTopup.toString(), 'Order ID')} className="text-gray-400 hover:text-blue-400 ml-auto">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-semibold">User UID</p>
                  <div className="flex items-center gap-2 text-white font-mono bg-gray-800/50 p-2 rounded border border-gray-700 text-sm overflow-hidden">
                    <span className="truncate">{selectedTrx.uid}</span>
                    <button onClick={() => copyToClipboard(selectedTrx.uid, 'User UID')} className="text-gray-400 hover:text-blue-400 ml-auto flex-shrink-0">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-300 mb-1">Item Info</p>
                  <p className="font-bold text-white text-lg">{selectedTrx.amount ? selectedTrx.amount.toString() : "-"}</p>
                  <p className="text-sm text-gray-400">{selectedTrx.idGame || "Unknown Game"}</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-blue-300 mb-1">Total Paid</p>
                   <p className="font-bold text-emerald-400 text-lg">{formatRupiah(Number(selectedTrx.price))}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Payment Proof</p>
                {selectedTrx.paymentProofUrl ? (
                   <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-700 group">
                      <img src={selectedTrx.paymentProofUrl} alt="Proof" className="object-cover w-full h-full" />
                      <a href={selectedTrx.paymentProofUrl} target="_blank" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold cursor-pointer">
                        View Full Image
                      </a>
                   </div>
                ) : (
                  <div className="h-24 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed flex flex-col items-center justify-center text-gray-500 gap-2">
                     <Eye size={20} />
                     <span className="text-xs">No screenshot uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-gray-400 text-sm mt-1">Manage orders from database.</p>
        </div>
        <div className="flex gap-3">
            <button onClick={fetchTransactions} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-700 flex items-center gap-2">
                Refresh Data
            </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-gray-800 flex flex-col lg:flex-row gap-4 justify-between items-center bg-gray-900/50">
          <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800 overflow-x-auto max-w-full no-scrollbar">
            {["All", "Pending", "Processing", "Success", "Canceled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab 
                    ? "bg-gray-800 text-white shadow-sm ring-1 ring-gray-700" 
                    : "text-gray-400 hover:text-white"
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
              placeholder="Search ID / User / Game..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500">
                <Loader2 className="animate-spin text-blue-500" size={32} />
                <p className="text-sm">Loading transactions...</p>
             </div>
          ) : (
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-950 text-gray-400 uppercase text-xs font-semibold tracking-wider border-b border-gray-800">
                <tr>
                    <th className="px-6 py-4">Transaction Info</th>
                    <th className="px-6 py-4">Game Item</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                {filteredData.length > 0 ? (
                    filteredData.map((trx) => (
                    <tr key={trx.idTopup} className="hover:bg-gray-800/40 transition-colors group">
                        
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-700">
                                {trx.idGame ? trx.idGame.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div>
                            <div className="font-medium text-white flex items-center gap-2 max-w-[150px] truncate" title={trx.uid}>
                                {trx.uid}
                            </div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">#{trx.idTopup}</div>
                            </div>
                        </div>
                        </td>

                        <td className="px-6 py-4">
                        <div className="font-medium text-white">{trx.idGame}</div>
                        <div className="text-xs text-gray-500">{trx.amount?.toString()}</div>
                        </td>

                        <td className="px-6 py-4">
                        <div className="font-medium text-white">{formatRupiah(Number(trx.price))}</div>
                        <div className="text-xs text-gray-500 mt-0.5 uppercase">{trx.paymentMethod}</div>
                        </td>

                        <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusStyles(trx.status)}`}>
                            {trx.status}
                        </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <button 
                                onClick={() => setSelectedTrx(trx)}
                                className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all"
                                title="View Details"
                            >
                                <Eye size={16} />
                            </button>

                            <div className="relative group/dropdown">
                                <select
                                    value={trx.status || "pending"}
                                    onChange={(e) => handleStatusChange(trx.idTopup, e.target.value)}
                                    className="appearance-none bg-gray-800 border border-gray-700 text-white text-xs rounded-lg pl-3 pr-8 py-2 focus:outline-none cursor-pointer hover:border-gray-500 transition-all w-28 capitalize"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="success">Success</option>
                                    <option value="canceled">Canceled</option>
                                    <option value="failed">Failed</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="bg-gray-800/50 p-4 rounded-full mb-3">
                            <SearchX size={32} className="text-gray-600" />
                        </div>
                        <h3 className="text-lg font-medium text-white">No transactions found</h3>
                        <p className="text-sm max-w-xs mx-auto mt-1">
                            We couldn't find any orders in Supabase matching your criteria.
                        </p>
                        </div>
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}