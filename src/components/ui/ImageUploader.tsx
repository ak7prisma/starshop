"use client";
import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
    label?: string;
    previewUrl: string | null;
    onFileSelect: (file: File) => void;
    onRemove?: () => void;
    inputId?: string;
    variant?: 'square' | 'banner' | 'rect';
    placeholder?: string;
    className?: string;
    required?: boolean;
}

export default function ImageUploader({ 
    label,
    previewUrl, 
    onFileSelect, 
    onRemove, 
    inputId = 'image-upload',
    variant = 'rect',
    placeholder = "Klik atau drag file",
    className = "",
    required = false
}: Readonly<ImageUploaderProps>) {
    
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const variantClasses = {
        square: "aspect-square w-full",
        banner: "h-32 w-full",
        rect: "h-48 w-full"
    };

    const handleFiles = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;
        onFileSelect(files[0]);
        setDragActive(false);
    }, [onFileSelect]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files?.[0]) {
            handleFiles(e.target.files);
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-gray-400 block">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <button
                onDragEnter={handleDrag}
                onDragOver={handleDrag} 
                onDragLeave={handleDrag}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 overflow-hidden group
                    ${variantClasses[variant]}
                    ${dragActive 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-gray-700 bg-gray-900/50 hover:bg-gray-800 hover:border-gray-500'
                    }
                `}
            >
                {previewUrl ? (
                    <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        
                        {/* Remove */}
                        {onRemove && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove();
                                }}
                                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg p-1.5 transition-colors backdrop-blur-sm"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                        <div className={`rounded-full bg-gray-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${variant === 'square' ? 'w-12 h-12' : 'w-10 h-10'}`}>
                           {variant === 'banner' ? <ImageIcon size={20} className="text-gray-400 group-hover:text-blue-400"/> : <Upload size={20} className="text-gray-400 group-hover:text-blue-400"/>}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                            {placeholder}
                        </p>
                        {variant !== 'square' && (
                             <p className="text-[10px] text-gray-600 mt-1">PNG, JPG (Max 5MB)</p>
                        )}
                    </div>
                )}
                
                <input 
                    ref={inputRef}
                    id={inputId} 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleChange} 
                />
            </button>
        </div>
    );
}