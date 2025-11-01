'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { Product } from '@/datatypes/productsType';
import InputForm from '@/app/components/ui/InputForm';
import SubmitLoading from '@/app/components/ui/SubmitLoading';
import ProductDetailCard from '@/app/components/ui/ProductDetailCard';
import TopupHeaderForm from '@/app/components/ui/TopupHeaderForm';
import PaymentModal from '@/app/components/modals/PaymentModal';

export default function TopupClient({product} : Readonly<{product: Product}>) {

    const router = useRouter();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [gameId, setGameId] = useState('');
    const [amount, setAmount] = useState<number | null>(null); 
    const [price, setPrice] = useState<number | null>(null);

    const [snapToken, setSnapToken] = useState<string | null>(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [createdTopupId, setCreatedTopupId] = useState<string | null>(null);

    const ADMIN_FEE = 3000;

    const totalBayar = price === null 
        ? 0 
        : price + ADMIN_FEE;

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSnapToken(null);
        if (createdTopupId) {
            router.push(`/history/${createdTopupId}`); 
        } else {
            router.push("/");
        }
    }

    const formatRupiah = (value: number | null): string => {
        if (value === null) return 'Free';
        return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
    };

    let label ="";
    if (product.category === "Games"){
        label = "ID Game";
    }
    else{
        label = "No HP";
    }

    const handleTopup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!gameId || !amount || !price) { 
            setError("Mohon lengkapi ID dan Nominal Topup.");
            return;
        }

        setLoading(true);
        setError(null);
        setSnapToken(null);

        let newTopupId: string | null = null; 

        try{
            const { data: insertData, error: insertError } = await supabase.from('Topup').insert({
                idProduct: product.idProduct,
                idGame: gameId,
                amount: amount,
                price: price,
                status: 'Pending',
                paymentMethod: 'Midtrans Snap',
            }).select('idTopup').single();

            if(insertError) throw insertError;
            
            newTopupId = insertData.idTopup ?? null;
            setCreatedTopupId(newTopupId);

            const response = await fetch('/api/create-transaction', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    idTopup: newTopupId,
                    amount: price,
                    adminFee: ADMIN_FEE,
                    productName: `${amount} ${product.itemName} (${product.nameProduct})`,
                }),
            });

            const result = await response.json();

            if(!response.ok || result.error) {
                await supabase.from('Topup').update({ status: 'Failed' }).eq('idTopup', newTopupId);
                throw new Error(result.error || 'Gagal membuat transaksi di Payment Gateway.');
            }

            setSnapToken(result.token); 
            setIsModalOpen(true);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : (typeof error === 'string' ? error : 'Terjadi kesalahan saat membuat transaksi.');
            setError(message);
            if (newTopupId) {
                router.push(`/history/${newTopupId}`); 
            }
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="max-w-full mx-auto text-gray-200 min-h-screen px-10 pt-45 pb-15 ">

            <div className="flex flex-col lg:flex-row gap-8">

                <ProductDetailCard product={product} />

                <div className="lg:w-2/3 space-y-8">
                    <form onSubmit={handleTopup} className="space-y-8">

                        <div className="p-6 bg-[#181B2B] rounded-2xl shadow-xl border border-[#2D3142]">
                            <TopupHeaderForm no='1' label={`Masukkan ${label} Anda`}/>
                            <InputForm 
                                label='User ID / Game ID'
                                identity='user'
                                type='text'
                                placeholder='123456789'
                                value={gameId}
                                onChange={setGameId}/>
                        </div>

                        <div className='p-6 bg-[#181B2B] rounded-2xl shadow-xl border border-[#2D3142]'>
                            <TopupHeaderForm no='2' label='Pilih Nominal Topup'/>
                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                               {product.amount.map((amt, i: number) => (
                                    <label 
                                        key={`${amt}-${product.price[i]}`} 
                                        className={
                                            `relative p-4 rounded-lg border cursor-pointer transition duration-200 flex flex-col items-center justify-center space-y-2 h-24 
                                            ${amount === Number(amt) ? 'bg-indigo-700 border-indigo-700 text-white shadow-lg shadow-indigo-500/30' : 'bg-[#2D3142] border-[#2D3142] text-gray-300 hover:bg-[#3C4258] hover:border-slate-500/60'}`
                                            }
                                        aria-label={`${amt} dengan harga ${formatRupiah(Number(product.price[i]))}`}>
                                        <input 
                                            type="radio" 
                                            name="amount" 
                                            id="amount" 
                                            className='hidden'
                                            onChange={() => {
                                                setAmount(Number(amt));
                                                setPrice(Number(product.price[i]));
                                            }}/>
                                        <div className="text-center">
                                            <p className="text-lg font-semibold text-white">{amt} {product.itemName}</p>
                                            <p className="text-sm text-gray-400">
                                                Rp {Number(product.price[i]).toLocaleString("id-ID")}
                                            </p>
                                            </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className='p-6 bg-[#181B2B] rounded-2xl shadow-xl border border-[#2D3142]'>
                            <TopupHeaderForm no='3' label='Ringkasan Pembayaran'/>
                            <div className='space-y-3 text-sm'>
                                <div className='flex justify-between'>
                                    <p className='text-gray-400'>Subtotal</p>
                                    <p className='font-medium'>{formatRupiah(price)}</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p className='text-gray-400'>Biaya Admin</p>
                                    <p className='font-medium'>{formatRupiah(ADMIN_FEE)}</p>
                                </div>
                                <div className='flex justify-between pt-2 border-t border-[#2D3142]'>
                                    <p className='text-lg font-bold'>Total Bayar</p>
                                    <p className='text-lg font-bold text-indigo-400'>
                                        {formatRupiah(totalBayar)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-400 text-center p-4 bg-red-900/30 border border-red-700 rounded-xl font-medium shadow-md">
                                {error}
                            </p>
                        )}

                        <SubmitLoading 
                            label='Bayar Sekarang' 
                            loading={loading}
                            disabled={loading || price === null}/> 
                    </form>
                </div>
                
                <PaymentModal 
                isOpen={isModalOpen} 
                onClose={handleModalClose} 
                snapToken={snapToken}
                transactionId={createdTopupId || 'N/A'}
                totalPayment={totalBayar}
                />
            </div>
        </div>
    );
}