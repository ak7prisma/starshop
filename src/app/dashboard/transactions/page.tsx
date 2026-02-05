"use client";

import { useState } from "react";
import { createClient } from "@/app/utils/client";
import { useTransactions } from "@/hooks/useTransaction";
import TransactionModal from "@/components/modals/TransactionDetailsModal";
import TransactionTable from "@/app/dashboard/component/TransactionTable";
import Toast from "@/components/ui/Toast";
import FilterTabs from "../component/FilterTabs";
import SearchBar from "../component/SearchBar";
import { formatRupiah } from "@/app/utils/formatRupiah";

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrx, setSelectedTrx] = useState<any>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false, message: '', type: 'success'
  });

  const supabase = createClient();
  const { transactions, isLoading, fetchTransactions, setTransactions } = useTransactions(activeTab);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase.from('topup').update({ status: newStatus.toLowerCase() }).eq('idTopup', id);
      if (error) throw error;
      
      setTransactions((prev) => prev.map((item) => item.idTopup === id ? { ...item, status: newStatus } : item));
      showToast(`Order #${id} updated to ${newStatus}`, "success");
    } catch (error: any) {
      console.error("Failed to update status:", error);
      showToast(`Gagal update status: ${error?.message || error}`, "error");
    }
  };

  // Filter Logic
  const filteredData = transactions.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.idGame?.toLowerCase().includes(term) || 
      t.products?.nameProduct?.toLowerCase().includes(term) ||
      t.idTopup?.toString().includes(term)
    );
  });

  return (
    <div className="space-y-6 relative min-h-screen pb-10">
      
      {/* Toast */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <TransactionModal 
        data={selectedTrx} 
        onClose={() => setSelectedTrx(null)} 
        formatRupiah={formatRupiah}
        copyToClipboard={(text, label) => { navigator.clipboard.writeText(text); showToast(`${label} Copied!`, 'success'); }}
      />

      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-gray-400 text-sm">Manage orders and status transactions.</p>
        </div>
        <button 
          onClick={fetchTransactions} 
          suppressHydrationWarning
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm border border-gray-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        
        {/* Controls Bar */}
        <div className="p-5 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-900/50">
          
          {/* FilterTabs */}
          <FilterTabs 
            tabs={["All", "Pending", "Success", "Failed"]} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          {/* SearchBar */}
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
          />
          
        </div>

        <TransactionTable 
          data={filteredData}
          isLoading={isLoading}
          onView={setSelectedTrx}
          onStatusChange={handleStatusChange}
          formatRupiah={formatRupiah}
        />
      </div>
    </div>
  );
}