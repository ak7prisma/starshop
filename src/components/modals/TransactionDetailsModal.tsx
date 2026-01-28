import { FileText, XCircle, Copy, Eye } from "lucide-react";
import { TopupData } from "@/datatypes/TopupData";

interface Props {
  data: (TopupData & { products?: { nameProduct: string } }) | null;
  onClose: () => void;
  copyToClipboard: (text: string, label: string) => void;
  formatRupiah: (val: number | string) => string;
}

export default function TransactionModal({ data, onClose, copyToClipboard, formatRupiah }: Props) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B1120] border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText size={20} className="text-blue-500" /> Transaction Detail
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><XCircle size={24} /></button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase font-semibold">Order ID</p>
              <div className="flex items-center gap-2 text-white font-mono bg-gray-800/50 p-2 rounded border border-gray-700 text-sm">
                #{data.idTopup}
                <button onClick={() => copyToClipboard(data.idTopup.toString(), 'Order ID')} className="text-gray-400 hover:text-blue-400 ml-auto"><Copy size={14} /></button>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase font-semibold">User UID</p>
              <div className="flex items-center gap-2 text-white font-mono bg-gray-800/50 p-2 rounded border border-gray-700 text-sm overflow-hidden">
                <span className="truncate">{data.uid}</span>
                <button onClick={() => copyToClipboard(data.uid, 'User UID')} className="text-gray-400 hover:text-blue-400 ml-auto flex-shrink-0"><Copy size={14} /></button>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-300 mb-1">Product</p>
              <p className="font-bold text-white">{data.products?.nameProduct || "Unknown Product"}</p>
              <p className="text-sm text-gray-400">{data.idGame}</p>
            </div>
            <div className="text-right">
               <p className="text-xs text-blue-300 mb-1">Total Paid</p>
               <p className="font-bold text-emerald-400 text-lg">{formatRupiah(data.price)}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Payment Proof</p>
            {data.paymentProofUrl ? (
               <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-700 group">
                  <img src={data.paymentProofUrl} alt="Proof" className="object-cover w-full h-full" />
                  <a href={data.paymentProofUrl} target="_blank" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">View Full Image</a>
               </div>
            ) : (
              <div className="h-24 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed flex flex-col items-center justify-center text-gray-500">
                 <Eye size={20} /><span className="text-xs">No screenshot uploaded</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}