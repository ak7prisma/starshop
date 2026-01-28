"use client";

import { useState } from "react";
import { Eye, ChevronDown, SearchX, Loader2, Check, X, Clock } from "lucide-react";
import { TopupData } from "@/datatypes/TopupData";
import { Badge, getBadgeVariant } from "../ui/Badge";

interface Props {
  data: (TopupData & { products?: { nameProduct: string } })[];
  isLoading: boolean;
  onView: (trx: any) => void;
  onStatusChange: (id: number, status: string) => void;
  formatRupiah: (val: any) => string;
}

export default function TransactionTable({ 
  data, 
  isLoading, 
  onView, 
  onStatusChange, 
  formatRupiah, 
}: Props) {
  
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-500">
      <Loader2 className="animate-spin text-blue-500" size={32} />
      <p className="text-sm">Loading transactions...</p>
    </div>
  );

  return (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-950 text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b border-gray-800">
          <tr>
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Game ID</th>
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Payment</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 text-gray-300">
          {data.length > 0 ? (
            data.map((trx) => (
              <tr key={trx.idTopup} className="hover:bg-gray-800/40 transition-colors group">
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold text-blue-400 border border-gray-700 group-hover:border-blue-500/50 transition-colors">
                      {trx.idTopup}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="font-medium text-white">{trx.idGame}</span>
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium text-white">
                    {trx.products?.nameProduct || "Unknown Product"}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {trx.amount?.toString()} items
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium text-emerald-400">
                    {formatRupiah(trx.price)}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">
                    {trx.paymentMethod}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <Badge variant={getBadgeVariant(trx.status)}>
                    {trx.status}
                  </Badge>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => onView(trx)} 
                      className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all"
                    >
                      <Eye size={16} />
                    </button>
                    
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === trx.idTopup ? null : trx.idTopup)}
                        className={`flex items-center justify-between w-28 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-[11px] font-medium capitalize transition-all hover:border-gray-500 focus:outline-none ${openDropdownId === trx.idTopup ? 'ring-1 ring-blue-500/50 border-blue-500' : ''}`}
                      >
                        <span className="text-white">
                          {trx.status || "Pending"}
                        </span>
                        <ChevronDown size={12} className={`text-gray-500 transition-transform duration-200 ${openDropdownId === trx.idTopup ? 'rotate-180 text-white' : ''}`} />
                      </button>

                      {openDropdownId === trx.idTopup && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                          
                          <div className="absolute right-0 mt-2 w-32 bg-[#0F172A] border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                            <div className="p-1 space-y-0.5">
                              {[
                                { id: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-400' },
                                { id: 'success', label: 'Success', icon: Check, color: 'text-emerald-400' },
                                { id: 'failed', label: 'Failed', icon: X, color: 'text-red-400' }
                              ].map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    onStatusChange(trx.idTopup, opt.id);
                                    setOpenDropdownId(null);
                                  }}
                                  className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] rounded-lg transition-colors text-left group/item ${trx.status === opt.id ? 'bg-gray-800/80' : 'hover:bg-gray-800'}`}
                                >
                                  <opt.icon size={12} className={opt.color} />
                                  <span className={trx.status === opt.id ? "text-white font-bold" : "text-gray-400 group-hover/item:text-gray-200"}>
                                    {opt.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-20 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <SearchX size={32} className="opacity-20 mb-2" />
                  <p className="text-sm">No transactions found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}