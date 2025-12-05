'use client';
import { useState, useCallback } from 'react';
import { RiImageAddLine } from 'react-icons/ri';

interface PaymentProofUploadProps {
    paymentProofPreview: string | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    inputId?: string;
}

export default function PaymentProof({ paymentProofPreview, onFileChange, onRemove, inputId = 'paymentProof' }: Readonly<PaymentProofUploadProps>) {
    const [dragActive, setDragActive] = useState(false);

    const handleFiles = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        const fileList = {
            0: file,
            length: 1,
            item: (i: number) => (i === 0 ? file : null),
        } as unknown as FileList;

        onFileChange({ target: { files: fileList } } as unknown as React.ChangeEvent<HTMLInputElement>);
        setDragActive(false);
    }, [onFileChange]);

   const handleDragActive = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const dt = e.dataTransfer;
        handleFiles(dt.files);
    };

    return (
        <div className="mt-4">
            <label
                htmlFor={inputId}
                onDragEnter={handleDragActive}
                onDragOver={handleDragActive} 
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition duration-200 ${dragActive ? 'border-indigo-500 bg-[#263449]' : 'border-[#2D3142] bg-[#2D3142] hover:bg-[#3C4258] hover:border-slate-500/60'}`}>
                {paymentProofPreview ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <img src={paymentProofPreview} alt="Preview bukti pembayaran" className="object-contain p-2 w-full h-full" />
                        <button
                            type="button"
                            onClick={onRemove}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 text-xs font-semibold transition duration-200">
                            X
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <RiImageAddLine size={40} className="text-gray-400 mb-3 rounded-t-2xl rounded-l-2xl" />
                        <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG atau JPEG (MAX. 5MB)</p>
                    </div>
                )}
                <input id={inputId} type="file" className="hidden" accept="image/*" onChange={(e) => onFileChange(e)} />
            </label>
        </div>
    );
}

