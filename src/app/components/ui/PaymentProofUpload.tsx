'use client';

interface PaymentProofUploadProps {
    paymentProofPreview: string | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    inputId?: string;
}

export default function PaymentProofUpload({ paymentProofPreview, onFileChange,  onRemove, inputId = 'paymentProof' }: Readonly<PaymentProofUploadProps>) {
    return (
        <div className="mt-4">
            <label 
                htmlFor={inputId}
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-[#2D3142] border-dashed rounded-lg cursor-pointer bg-[#2D3142] hover:bg-[#3C4258] hover:border-slate-500/60 transition duration-200">
                {paymentProofPreview ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <img
                            src={paymentProofPreview}
                            alt="Preview bukti pembayaran"
                            className="object-contain p-2 w-full h-full"
                        />
                        <button
                            type="button"
                            onClick={onRemove}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 text-xs font-semibold transition duration-200">
                            X
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a2 2 0 0 0 1.965-2.196L15.5 3.5l-4-4L7.5 3.5l-1.965 7.304A2 2 0 0 0 7.5 13h3m0 0v-6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6m-6 0h6"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG atau JPEG (MAX. 5MB)</p>
                    </div>
                )}
                <input 
                    id={inputId}
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={onFileChange}
                />
            </label>
        </div>
    );
}

