'use client';

interface PaymentMethod {
    idPaymentMethod: number;
    paymentMethod: string | null;
    imgUrl: string | null;
    imgAlt: string | null;
    adminFee: number | null;
}

interface PaymentMethodChoiceProps {
    paymentMethods: PaymentMethod[];
    selectedPaymentMethod: number | null;
    onSelect: (idPaymentMethod: number) => void;
    formatRupiah: (value: number | null) => string;
}

export default function PaymentMethodChoice({paymentMethods, selectedPaymentMethod, onSelect, formatRupiah}: Readonly<PaymentMethodChoiceProps>) {
    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
            {paymentMethods.map((method) => (
                <label 
                    key={method.idPaymentMethod}
                    className={
                        `relative p-4 rounded-lg border cursor-pointer transition duration-200 flex flex-col items-center justify-center space-y-2 h-32
                        ${selectedPaymentMethod === method.idPaymentMethod ? 'bg-indigo-700 border-indigo-700 text-white shadow-lg shadow-indigo-500/30' : 'bg-[#2D3142] border-[#2D3142] text-gray-300 hover:bg-[#3C4258] hover:border-slate-500/60'}`
                    }
                    aria-label={method.paymentMethod || 'Payment Method'}>
                    <input 
                        type="radio" 
                        name="paymentMethod" 
                        className='hidden'
                        onChange={() => {
                            onSelect(method.idPaymentMethod);
                        }}/>
                    {method.imgUrl && (
                        <div className="relative w-12 h-12 mb-2">
                            <img
                                src={method.imgUrl}
                                alt={method.imgAlt || method.paymentMethod || 'Payment Method'}
                                className="object-contain w-full h-full"
                            />
                        </div>
                    )}
                    <div className="text-center">
                        <p className="text-sm font-semibold text-white">{method.paymentMethod}</p>
                        {method.adminFee && method.adminFee > 0 && (
                            <p className="text-xs text-gray-400 mt-1">
                                Admin: {formatRupiah(method.adminFee)}
                            </p>
                        )}
                    </div>
                </label>
            ))}
        </div>
    );
}

