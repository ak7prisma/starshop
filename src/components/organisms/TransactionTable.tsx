"use client";

import { Eye, Loader2, SearchX } from "lucide-react";
import { TopupData } from "@/datatypes/TopupData";
import { Badge, getBadgeVariant } from "../ui/Badge";
import DropdownMenu from "../ui/DropdownMenu";
import { STATUS_OPTIONS } from "@/constant/menu";

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
}: Readonly<Props>) {

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
                <td className="px-6 py-4"><span className="font-medium text-white">{trx.idGame}</span></td>
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{trx.products?.nameProduct || "Unknown"}</div>
                  <div className="text-[10px] text-gray-500">{trx.amount?.toString()} items</div>
                </td>
                <td className="px-6 py-4">
                   <div className="font-medium text-emerald-400">{formatRupiah(trx.price)}</div>
                   <div className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">{trx.paymentMethod}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getBadgeVariant(trx.status)}>{trx.status}</Badge>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onView(trx)}
                      className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-all"
                    >
                      <Eye size={16} />
                    </button>

                    <DropdownMenu
                      value={trx.status}
                      onChange={(newStatus) => onStatusChange(trx.idTopup, newStatus)}
                      options={STATUS_OPTIONS}                  />

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