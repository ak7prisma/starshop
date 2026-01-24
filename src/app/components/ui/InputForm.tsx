import React, { ReactNode, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface InputParams {
    label?: string;
    identity: string;
    placeholder?: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    children?: ReactNode;
}

export default function InputForm({ label, identity, type, placeholder, value, onChange, children }: Readonly<InputParams>){
    
    const isPassword = identity === 'password' || identity === 'confirmedpassword';
    const [isVisible, setIsVisible] = useState(false);
    const passwordType = isVisible ? 'text' : 'password';
    const inputType = (identity === 'password' || identity === 'confirmedpassword') ? passwordType : type;
    
    const labelClass = "block text-sm font-medium leading-6 text-gray-100";
    const inputClass = "block w-full rounded-md border-0 bg-white/5 py-1.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6";
    
    return(
        <div>
            <div className="flex items-center justify-between"> 
                <label htmlFor={identity} className={labelClass}>
                    {label}
                </label>
                {children} 
            </div>
            
            <div className="mt-2 relative">
                <input
                    id={identity}
                    name={identity}
                    type={inputType}
                    required
                    autoComplete={identity}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    suppressHydrationWarning={true}
                    className={inputClass}/>

                    {(identity === 'password' || identity === 'confirmedpassword') && (
                    <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                        <div className="text-gray-400 hover:text-gray-300">
                            {isVisible ? <FaEye/> : <FaEyeSlash/>} 
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
}