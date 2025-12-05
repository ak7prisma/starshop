'use client';

interface PaymentMethod {
    idPaymentMethod: number;
    adminFee: number | null;
}

interface ChekoutDetailProps {
    price: number | null;
    selectedPaymentMethod: number | null;
    paymentMethods: PaymentMethod[];
    formatRupiah: (value: number | null) => string;
}

export default function CheckoutDetail({ price,  selectedPaymentMethod, paymentMethods, formatRupiah }: Readonly<ChekoutDetailProps>) {
    const selectedMethod = selectedPaymentMethod 
        ? paymentMethods.find(pm => pm.idPaymentMethod === selectedPaymentMethod)
        : null;
    
    const adminFee = selectedMethod?.adminFee || 0;
    const total = price && selectedPaymentMethod ? price + adminFee : price;

    return (
        <div className='space-y-3 text-sm mt-4'>
            <div className='flex justify-between'>
                <p className='text-gray-400'>Subtotal</p>
                <p className='font-medium'>{formatRupiah(price)}</p>
            </div>
            {adminFee > 0 && (
                <div className='flex justify-between'>
                    <p className='text-gray-400'>Biaya Admin</p>
                    <p className='font-medium'>{formatRupiah(adminFee)}</p>
                </div>
            )}
            <div className='flex justify-between pt-2 border-t border-[#2D3142]'>
                <p className='text-lg font-bold'>Total Bayar</p>
                <p className='text-lg font-bold text-indigo-400'>
                    {formatRupiah(total)}
                </p>
            </div>
        </div>
    );
}

