'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import type { Product } from '@/datatypes/productsType';
import InputForm from '@/app/components/ui/InputForm';
import SubmitLoading from '@/app/components/ui/SubmitLoading';
import ProductDetailCard from '@/app/components/ui/ProductDetailCard';
import TopupHeaderForm from '@/app/components/ui/TopupHeaderForm';
import PaymentMethodChoice from '@/app/components/ui/PaymentMethodChoice';
import PaymentProofUpload from '@/app/components/ui/PaymentProof';
import CheckoutDetail from '@/app/components/ui/CheckoutDetail';
import TopupSuccessModal from '@/app/components/modals/TopupSuccessModal';

interface PaymentMethod {
    idPaymentMethod: number;
    paymentMethod: string | null;
    imgUrl: string | null;
    imgAlt: string | null;
    adminFee: number | null;
}

export default function TopupClient({product} : Readonly<{product: Product}>) {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [gameId, setGameId] = useState('');
    const [amount, setAmount] = useState<number | null>(null); 
    const [price, setPrice] = useState<number | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
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

            if (error) {
                console.error('Error fetching payment methods:', error);
            } else {
                setPaymentMethods(data || []);
            }
        };

        fetchPaymentMethods();
    }, []);

    const formatRupiah = (value: number | null): string => {
        if (value === null) return 'Free';
        return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
            reader.onloadend = () => {
                setPaymentProofPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
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

        if (!selectedPaymentMethod) {
            setError("Mohon pilih metode pembayaran.");
            return;
        }

        if (!paymentProof) {
            setError("Mohon upload bukti pembayaran.");
            return;
        }

        setLoading(true);
        setError(null);

        try{
            const selectedMethod = paymentMethods.find(pm => pm.idPaymentMethod === selectedPaymentMethod);
            const paymentMethodName = selectedMethod?.paymentMethod || 'Unknown';

            let proofUrl: string | null = null;
            if (paymentProof) {
                const formData = new FormData();
                formData.append('file', paymentProof);

                const uploadResponse = await fetch('/api/upload-proof', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    let errorMessage = 'Gagal mengupload bukti pembayaran';
                    try {
                        const errorData = await uploadResponse.json();
                        errorMessage = errorData.error || errorData.details || errorMessage;
                    } catch {
                        errorMessage = `Upload failed dengan status ${uploadResponse.status}`;
                    }
                    throw new Error(errorMessage);
                }

                const uploadData = await uploadResponse.json();
                proofUrl = uploadData.url;
                
                if (!proofUrl) {
                    throw new Error('Upload berhasil tapi URL tidak ditemukan');
                }
            }

            const createTopupResponse = await fetch('/api/create-topup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idProduct: product.idProduct,
                    idGame: gameId,
                    amount: amount,
                    price: price,
                    paymentMethod: paymentMethodName,
                    paymentProofUrl: proofUrl,
                }),
            });

            if (!createTopupResponse.ok) {
                let errorMessage = 'Gagal menyimpan data topup';
                try {
                    const errorData = await createTopupResponse.json();
                    errorMessage = errorData.error || errorData.details || errorMessage;
                } catch {
                    errorMessage = `Create failed dengan status ${createTopupResponse.status}`;
                }
                throw new Error(errorMessage);
            }

            const createTopupData = await createTopupResponse.json();
            const newTopupId = createTopupData.idTopup ?? null;

            setSuccessTopupId(newTopupId);
            setShowSuccessModal(true);
            
            setGameId('');
            setAmount(null);
            setPrice(null);
            setSelectedPaymentMethod(null);
            setPaymentProof(null);
            setPaymentProofPreview(null);
        } catch (error: unknown) {
            console.error('Topup error:', error);
            let message = 'Terjadi kesalahan saat membuat topup.';
            
            if (error instanceof Error) {
                message = error.message;
            } else if (typeof error === 'string') {
                message = error;
            }
            
            setError(message);
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
                            <TopupHeaderForm no='4' label='Upload Bukti Pembayaran'/>
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
                            <TopupHeaderForm no='5' label='Ringkasan Pembayaran'/>
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
                            disabled={loading || price === null || !selectedPaymentMethod || !paymentProof}/> 
                    </form>
                </div>
                
            </div>

            <TopupSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onTopupAgain={() => {
                    setShowSuccessModal(false);
                }}
                idTopup={successTopupId}
            />
        </div>
    );
}
