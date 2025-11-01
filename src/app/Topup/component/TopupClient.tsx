'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { Product } from '@/datatypes/productsType';
import type { PaymentMethodDetail } from '@/datatypes/paymentMethodDetailType';
import InputForm from '@/app/components/ui/InputForm';
import SubmitLoading from '@/app/components/ui/SubmitLoading';
import ProductDetailCard from '@/app/components/ui/ProductDetailCard';
import TopupHeaderForm from '@/app/components/ui/TopupHeaderForm';
import PaymentModal from '@/app/components/modals/PaymentModal';
import Image from 'next/image';

export default function TopupClient({product} : Readonly<{product: Product}>) {

    const router = useRouter();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [gameId, setGameId] = useState('');
    const [amount, setAmount] = useState<number | null>(null); 
    const [price, setPrice] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodDetail[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [loadingPaymentMethod, setLoadingPaymentMethod] = useState(true);

    const [snapToken, setSnapToken] = useState<string | null>(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [createdTopupId, setCreatedTopupId] = useState<string | null>(null);

    const totalBayar = price !== null 
        ? price + (paymentMethod.find(m => m.paymentMethod === selectedPaymentMethod)?.adminFee || 0) 
        : 0;

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSnapToken(null);
        // Setelah modal ditutup, user diarahkan ke halaman riwayat/status transaksi
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

    useEffect(() => {
        const fetchPaymentMethod = async () => {
            setLoadingPaymentMethod(true);
            const {data, error} = await supabase.from('PaymentMethodDetail').select('*');

            if(error){
                setError('Failed to load payment methods')
            }
            else if (data){
                setPaymentMethod(data as PaymentMethodDetail[]);
            }
            setLoadingPaymentMethod(false);
        };
        fetchPaymentMethod();
    }, []);

    const handleTopup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!gameId || !amount || !price || !selectedPaymentMethod) { 
            setError("Mohon lengkapi ID, Nominal, dan Metode Pembayaran.");
            return;
        }

        setLoading(true);
        setError(null);
        setSnapToken(null);

        let newTopupId: string | null = null; // Variabel untuk menyimpan ID transaksi

        try{
            // 1. Simpan Transaksi ke Supabase (Status: Pending)
            const { data: insertData, error: insertError } = await supabase.from('Topup').insert({
                idProduct: product.idProduct,
                idGame: gameId,
                amount: amount,
                price: price,
                status: 'Pending',
                paymentMethod: selectedPaymentMethod,
            }).select('idTopup').single();

            if(insertError) throw insertError;
            
            newTopupId = insertData.idTopup ?? null; // Simpan ID
            setCreatedTopupId(newTopupId);

            // 2. Panggil Next.js API untuk mendapatkan Snap Token
            const response = await fetch('/api/create-transaction', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    idTopup: newTopupId,
                    amount: price, 
                    adminFee: paymentMethod.find(m => m.paymentMethod === selectedPaymentMethod)?.adminFee || 0,
                    productName: `${amount} ${product.itemName} (${product.nameProduct})`,
                    // Tambahkan data customer jika diperlukan
                }),
            });

            const result = await response.json();

            if(!response.ok || result.error) {
                // Jika gagal mendapatkan token, update status di Supabase menjadi Failed
                await supabase.from('Topup').update({ status: 'Failed' }).eq('idTopup', newTopupId);
                throw new Error(result.error || 'Gagal membuat transaksi di Payment Gateway.');
            }

            // 3. Simpan Token dan Tampilkan Modal
            setSnapToken(result.token); 
            setIsModalOpen(true);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : (typeof error === 'string' ? error : 'Terjadi kesalahan saat membuat transaksi.');
            setError(message);
            // Jika transaksi gagal sebelum ditampilkan, arahkan ke halaman error/riwayat
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
                            <TopupHeaderForm no='3' label='Pilih Metode Pembayaran'/>
                            {loadingPaymentMethod ? (
                                <p className='text-center text-gray-400'>Memuat metode pembayaran...</p>
                            ) : (
                                <div className='grid gap-4'>
                                    {paymentMethod.map((method) => {
                                        
                                        const methodName = method.paymentMethod; 
                                        const logoUrl = method.imgUrl;           
                                        const logoAlt = method.imgAlt;

                                        const subTotal = price || 0;
                                        const adminFee = method.adminFee || 0; 
                                        const totalPayment = subTotal + adminFee;

                                        return (
                                            <label
                                                key={method.idPaymentMethod}
                                                className={`relative p-4 rounded-xl border cursor-pointer transition duration-200 flex items-center justify-between min-h-20 ${selectedPaymentMethod === methodName ? 
                                                'bg-indigo-700 border-indigo-700 text-white shadow-lg shadow-indigo-500/30' : 
                                                'bg-[#2D3142] border-[#2D3142] text-gray-300 hover:bg-[#3C4258] hover:border-slate-500/60'}`
                                                }
                                                aria-label={`Metode pembayaran ${methodName} dengan total pembayaran ${formatRupiah(totalPayment)}`}>
                                                
                                                <div className='flex items-center space-x-4'>
                                                    <input 
                                                        type="radio" 
                                                        name="paymentMethod" 
                                                        className='hidden'
                                                        onChange={() => setSelectedPaymentMethod(methodName)}/>

                                                    <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                                                        {logoUrl ? (
                                                            <Image 
                                                                src={logoUrl} 
                                                                alt={logoAlt} 
                                                                className="object-contain max-h-full w-auto rounded-md"
                                                            />
                                                        ) : (
                                                            <span className="text-xl font-bold">{methodName.slice(0, 1)}</span> 
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex-grow">
                                                        <p className="font-semibold">{methodName}</p>
                                                    </div>
                                                </div>

                                                <div className="text-right ml-4 flex-shrink-0">
                                                    <p className={`text-md font-bold ${price === null ? 'text-gray-500' : 'text-white'}`}>
                                                        {price === null ? 'Pilih Nominal' : formatRupiah(totalPayment)}
                                                    </p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        
                        {error && (
                            <p className="text-red-400 text-center p-4 bg-red-900/30 border border-red-700 rounded-xl font-medium shadow-md">
                                {error}
                            </p>
                        )}

                        <SubmitLoading 
                            label='Pay Now' 
                            loading={loading}
                            disabled={loading}/>
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