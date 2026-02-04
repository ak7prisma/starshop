"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import FormHeader from '@/app/auth/component/AuthHeader';
import SubmitLoading from '@/components/ui/SubmitLoading';
import { Input } from '@/components/ui/Input';

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            setMessage('Input a new password.');
        }
        else {
            setError('Reset link is not is expired, try again.');
        }
    });
  }, []);

  const handleResetPassword = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!newPassword) {
      setError('The password cannot be empty.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } 
    else {
      setMessage('Reset Password is successful.');

      setTimeout(() => {
        router.push('/auth/Login');
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">

        <FormHeader label1="Reset Password" label2="Please enter your new strong password"/>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleResetPassword} className="space-y-6">

            <Input 
              label='New Password'
              id='password'
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            {(error || message) && (
                <div className={`p-3 rounded-md text-center text-sm ${message ? 'bg-green-600/10 text-green-400' : 'bg-red-600/10 text-red-400'}`}>
                {error || message}
                </div>
            )}

            <SubmitLoading 
              label='Login' 
              loading={loading}
              disabled={loading}/>
            
            </form>
        </div>
    </div>
  );
}