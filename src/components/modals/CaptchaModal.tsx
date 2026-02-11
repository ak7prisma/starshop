'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import { useState } from 'react';

interface CaptchaModalProps {
  onVerify: (token: string) => void;
}

export default function CaptchaModal({ onVerify }: Readonly<CaptchaModalProps>) {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = (token: string) => {
    setIsSuccess(true);
    setTimeout(() => {
      onVerify(token);
    }, 800);
  };

    return(
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-950/10 backdrop-blur-md transition-all duration-300">
            <div className="bg-slate-100 p-8 rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Security Check</h2>
                <p className="text-sm text-gray-500 mb-6">Please verify you are human to access the login form.</p>
                
                <Turnstile 
                    siteKey={"0x4AAAAAACaARJ4VrWF7Q2JW"} 
                    onSuccess={handleSuccess}
                    options={{ size: 'normal', theme: 'light' }}
                />
                            
            </div>
        </div>
    );
}