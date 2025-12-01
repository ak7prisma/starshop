"use client";
import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import FormHeader from '@/app/components/ui/AuthHeader';
import FormFooter from '@/app/components/ui/AuthFooter';
import SubmitLoading from '@/app/components/ui/SubmitLoading';
import InputForm from '@/app/components/ui/InputForm';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const redirectUrl ='/auth/ResetPassword';

  const handlePasswordReset = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      setError(error.message);
      setMessage(null);
    } 
    else {
      setMessage(`password reset link has been sent to ${email}, Please check your inbox.`);
      setError(null);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
     
      <FormHeader label1="Forgot Password" label2="Enter your email to reset password."/>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handlePasswordReset} className="space-y-6">

            <InputForm 
              label='Email Address'
              identity='email'
              type='email'
              placeholder='youremail@example.com'
              value={email}
              onChange={setEmail}/>

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

        <FormFooter label1="Remember your password?" label2="Log In" linkroute="/auth/Login"/>
      </div>
    </div>
  );
}