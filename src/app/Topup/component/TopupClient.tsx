'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import type { Product } from '@/datatypes/productsType';
import InputForm from '@/app/components/ui/InputForm';
import SubmitLoading from '@/app/components/ui/SubmitLoading';
import ProductDetailCard from '@/app/Topup/component/ProductDetailCard';
import TopupHeaderForm from '@/app/Topup/component/TopupHeaderForm';
import PaymentMethodChoice from '@/app/Topup/component/PaymentMethodChoice';
import PaymentProofUpload from '@/app/Topup/component/PaymentProof';
import CheckoutDetail from '@/app/Topup/component/CheckoutDetail';
import TopupSuccessModal from '@/app/components/modals/TopupSuccessModal';
import type { PaymentMethodDetail } from '@/datatypes/paymentMethodDetailType';
import { useRouter } from 'next/navigation';

const getErrorMessage = async (response: Response, defaultMessage: string) => {
    try {
        const data = await response.json();
        return data.error || data.details || defaultMessage;
    } catch {
        return `${defaultMessage} (Status: ${response.status})`;
    }
};

export default function TopupClient({ product }: Readonly<{ product: Product }>) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [gameId, setGameId] = useState('');
    const [amount, setAmount] = useState<number | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDetail[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successTopupId, setSuccessTopupId] = useState<number | null>(null);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            const { data, error } = await supabase
                .from('PaymentMethodDetail')
                .select('*')
                .order('idPaymentMethod');

            if (error) console.error('Error fetching payment methods:', error);
            else setPaymentMethods(data || []);
        };

        fetchPaymentMethods();
    }, []);

    const formatRupiah = (value: number | null): string => {
        if (value === null) return 'Free';
        return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('File harus berupa gambar');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Ukuran file maksimal 5MB');
            return;
        }

        setPaymentProof(file);
        const reader = new FileReader();
        reader.onloadend = () => setPaymentProofPreview(reader.result as string);
        reader.readAsDataURL(file);
        setError(null);
    };

    const uploadProofToApi = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload-proof', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response, 'Gagal upload bukti pembayaran'));
        }

        const data = await response.json();
        if (!data.url) throw new Error('Upload berhasil tapi URL tidak ditemukan');
        return data.url;
    };

    const createTopupRecord = async (payload: any) => {
        const response = await fetch('/api/create-topup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response, 'Gagal menyimpan data topup'));
        }

        return await response.json();
    };

    const resetFormState = () => {
        setGameId('');
        setAmount(null);
        setPrice(null);
        setSelectedPaymentMethod(null);
        setPaymentProof(null);
        setPaymentProofPreview(null);
    };

    const handleTopup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!gameId || !amount || !price) return setError("Mohon lengkapi ID dan Nominal Topup.");
        if (!selectedPaymentMethod) return setError("Mohon pilih metode pembayaran.");
        if (!paymentProof) return setError("Mohon upload bukti pembayaran.");

        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const proofUrl = await uploadProofToApi(paymentProof);

            const selectedMethod = paymentMethods.find(pm => pm.idPaymentMethod === selectedPaymentMethod);
            
            const payload = {
                userId: user?.id,
                idProduct: product.idProduct,
                idGame: gameId,
                amount: amount,
                price: price,
                paymentMethod: selectedMethod?.paymentMethod || 'Unknown',
                paymentProofUrl: proofUrl,
            };

            const topupData = await createTopupRecord(payload);

            setSuccessTopupId(topupData.idTopup ?? null);
            setShowSuccessModal(true);
            resetFormState();

        } catch (error: unknown) {
            console.error('Topup error:', error);
            const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat topup.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const label = product.category === "Games" ? "ID Game" : "No HP";

    return (
        <div className="max-w-full mx-auto text-gray-200 min-h-screen px-10 pt-40 pb-15 ">
            <div className="flex flex-col lg:flex-row gap-8">
                <ProductDetailCard product={product} />

                <div className="lg:w-2/3 space-y-8">
                    <form onSubmit={handleTopup} className="space-y-8">
                        <div className="p-6 bg-[#181B2B] rounded-2xl shadow-xl border border-[#2D3142]">
                            <TopupHeaderForm no='1' label={`Masukkan ${label} Anda`} />
                            <InputForm
                                label='User ID / Game ID'
                                identity='user'
                                type='text'
                                placeholder='123456789'
                                value={gameId}
                                onChange={setGameId} />
                        </div>

                        <div className='p-6 bg-[#181B2B] rounded-2xl shadow-xl border border-[#2D3142]'>
                            <TopupHeaderForm no='2' label='Pilih Nominal Topup' />
                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                                {product.amount.map((amt, i) => (
                                    <label
                                        key={`${amt}-${product.price[i]}`}
                                        className={`relative p-4 rounded-lg border cursor-pointer transition duration-200 flex flex-col items-center justify-center space-y-2 h-24 
                                        ${amount === Number(amt) ? 'bg-indigo-700 border-indigo-700 text-white shadow-lg shadow-indigo-500/30' : 'bg-[#2D3142] border-[#2D3142] text-gray-300 hover:bg-[#3C4258] hover:border-slate-500/60'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="amount"
                                            className='hidden'
                                            onChange={() => {
                                                setAmount(Number(amt));
                                                setPrice(Number(product.price[i]));
                                            }} />
                                        <div className="text-center">
                                            <p className="text-lg font-semibold text-white">{amt} {product.itemName}</p>
                                            <p className="text-sm text-gray-400">
                                                {formatRupiah(Number(product.price[i]))}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className='p-6 bg-[#181B2B] rounded-2xl shadow-xl border border-[#2D3142]'>
                            <TopupHeaderForm no='3' label='Pilih Metode Pembayaran' />
                            {paymentMethods.length > 0 ? (
                                <PaymentMethodChoice
                                    paymentMethods={paymentMethods}
                                    selectedPaymentMethod={selectedPaymentMethod}
                                    onSelect={setSelectedPaymentMethod}
                                    formatRupiah={formatRupiah}
                                />
                            ) : (
                                <p className="text-gray-400 text-center py-4">Memuat metode pembayaran...</p>
                            )}
                        </div>

                        <div className='p-6 bg-[#181B2B] rounded-2xl shadow-xl border border-[#2D3142]'>
                            <TopupHeaderForm no='4' label='Upload Bukti Pembayaran' />
                            <PaymentProofUpload
                                paymentProofPreview={paymentProofPreview}
                                onFileChange={handleFileChange}
                                onRemove={() => {
                                    setPaymentProof(null);
                                    setPaymentProofPreview(null);
                                }}
                            />
                        </div>

                        <div className='p-6 bg-[#181B2B] rounded-2xl shadow-xl border border-[#2D3142]'>
                            <TopupHeaderForm no='5' label='Ringkasan Pembayaran' />
                            <CheckoutDetail
                                price={price}
                                selectedPaymentMethod={selectedPaymentMethod}
                                paymentMethods={paymentMethods}
                                formatRupiah={formatRupiah}
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-center p-4 bg-red-900/30 border border-red-700 rounded-xl font-medium shadow-md">
                                {error}
                            </p>
                        )}

                        <SubmitLoading
                            label='Submit Topup'
                            loading={loading}
                            disabled={loading || price === null || !selectedPaymentMethod || !paymentProof} />
                    </form>
                </div>
            </div>

            <TopupSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                idTopup={successTopupId}
            />
        </div>
    );
}