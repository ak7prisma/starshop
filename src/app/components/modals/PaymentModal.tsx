'use client';
import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface PaymentModalProps {
   isOpen: boolean;
   onClose: () => void;
   snapToken: string | null;
   transactionId: string;
   totalPayment: number;
}

const formatRupiah = (value: number): string => {
   return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
};

export default function PaymentModal({ isOpen, onClose, snapToken, transactionId, totalPayment }: PaymentModalProps) {
  
   // Fungsi untuk memicu pop-up Midtrans Snap
   const handleSnapPayment = useCallback(() => {
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     if (snapToken && (window as any).snap) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).snap.pay(snapToken, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: function(_result: any){ // Perbaikan: ganti result ke _result
             // Note: Walaupun sukses, status final harus dicek via Webhook
             alert("Pembayaran berhasil! Menunggu konfirmasi akhir.");
             onClose(); // Tutup modal dan redirect
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onPending: function(_result: any){ // Perbaikan: ganti result ke _result
             alert("Pembayaran tertunda. Silakan selesaikan pembayaran di jendela yang muncul.");
             // Tidak menutup modal karena user masih bisa kembali
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: function(_result: any){ // Perbaikan: ganti result ke _result
             alert("Pembayaran gagal!");
             onClose();
          },
          onClose: function(){
             // Dipanggil saat user menutup pop-up tanpa menyelesaikan
             alert('Anda menutup jendela pembayaran.');
             // Tidak perlu onClose() di sini jika Anda ingin user mencoba lagi.
          }
        });
     }
   }, [snapToken, onClose]);

   useEffect(() => {
     // Otomatis panggil Snap saat token tersedia
     if (isOpen && snapToken) {
          // Tambahkan delay kecil untuk memastikan script Midtrans sudah siap
          const timer = setTimeout(() => {
               handleSnapPayment();
          }, 300); 
          return () => clearTimeout(timer);
     }
   }, [isOpen, snapToken, handleSnapPayment]);

   if (!isOpen) return null;

   const modalContent = (
     <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#181B2B] p-8 rounded-2xl max-w-lg w-full shadow-2xl border border-indigo-700 text-gray-200 animate-fade-in">
               <h3 className="text-2xl font-bold mb-4 text-indigo-400">
                    Langkah Terakhir: Bayar Transaksi
               </h3>
               <div className="space-y-3 mb-6 p-4 border border-[#2D3142] rounded-lg">
                    <p className="flex justify-between">
                         <span className="text-gray-400">ID Pesanan:</span> 
                         <span className="font-mono text-white">{transactionId}</span>
                    </p>
                    <p className="flex justify-between text-lg font-semibold">
                         <span>Total Pembayaran:</span> 
                         <span className="text-green-400 font-bold">{formatRupiah(totalPayment)}</span>
                    </p>
               </div>
               
               <p className="text-sm text-gray-400 mb-6">
                    Jendela pembayaran (Snap) dari Midtrans akan terbuka secara otomatis. Jika tidak, klik tombol di bawah ini.
               </p>
               
               <button
                    onClick={handleSnapPayment}
                    disabled={!snapToken}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 disabled:opacity-50"
               >
                    {snapToken ? 'Buka Halaman Pembayaran' : 'Memuat Pembayaran...'}
               </button>
               <button 
                    onClick={onClose} 
                    className="w-full mt-3 text-gray-400 hover:text-white hover:bg-[#2D3142] py-2 rounded-xl transition duration-150"
               >
                    Tutup / Kembali
               </button>
          </div>
     </div>
   );

   // Menggunakan createPortal
   return createPortal(modalContent, document.body); 
}