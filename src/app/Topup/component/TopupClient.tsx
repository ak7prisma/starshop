'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { Product } from '@/datatypes/productsType';
import type { PaymentMethodDetail } from '@/datatypes/paymentMethodDetailType';
import InputForm from '@/app/components/ui/InputForm';
import SubmitLoading from '@/app/components/ui/SubmitLoading';
import ProductDetailCard from '@/app/components/ui/ProductDetailCard';

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

    const formatRupiah = (value: number | null): string => {
        if (value === null) return 'N/A';
        return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
    };

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

        if (!gameId || !amount || !price) {
            setError("Please complete all data before top up.");
            return;
        }

        setLoading(true);
        setError(null);

        try{
            const { data: insertData, error: insertError } = await supabase.from('Topup').insert({
                idProduct: product.idProduct,
                idGame: gameId,
                amount: amount, price,
                status: 'Pending',
                paymentMethod: selectedPaymentMethod,
            }).select('idTopup').single();

            if(insertError) throw insertError;

            alert(`Topup transaction is created ID: ${insertData.idTopup}. Continue to finish payment`)

            router.push("/");
        } catch(err: any){
            setError(err.massage || 'An error occurred while top up')
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
                            <h3 className="text-xl font-bold mb-4 text-indigo-300 flex items-center">
                                <span className="w-8 h-8 flex items-center justify-center bg-indigo-700 rounded-full text-white font-mono mr-3">1</span>
                                <p>Input your game id</p>
                            </h3>
                            <InputForm 
                                label='User ID / Game ID'
                                identity='user'
                                type='text'
                                placeholder='123456789'
                                value={gameId}
                                onChange={setGameId}
                            />
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
                
            </div>
        </div>
    );
}