"use client"
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import FormHeader from '@/app/components/ui/AuthHeader';
import FormFooter from '@/app/components/ui/AuthFooter';
import SubmitLoading from '@/app/components/ui/SubmitLoading';
import InputForm from '@/app/components/ui/InputForm';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } 
    else {
      setError('Login is Successful.');
      router.push("/");
    }

    setLoading(false);
  };
  return (

      <div className="flex min-h-full flex-col justify-center px-6 py-15 lg:px-8">
        <FormHeader label1="Welcome back!" label2="Welcome back! Please enter your account information."/>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} method='POST' className="space-y-6">
            <InputForm 
              label='Email Address'
              identity='email'
              type='email'
              placeholder='youremail@example.com'
              value={email}
              onChange={setEmail}/>

            <InputForm
              label="Password"
              identity="password"
              type="password"
              value={password}
              onChange={setPassword}>
              <div className="text-sm">
                  <Link href="/auth/ForgotPassword" className="font-semibold text-indigo-400 hover:text-indigo-300">
                      Forgot password?
                  </Link>
              </div>
            </InputForm>

            {error && (
              <p className={`text-sm text-center ${error.includes('Successful') ? 'text-green-600' : 'text-red-600'}`}>
                {error}
              </p>
            )}

            <SubmitLoading 
                    label='Login' 
                    loading={loading}
                    disabled={loading}/>
          </form>

          <FormFooter 
            label1="Don't have an account?" 
            label2="Sign In" 
            linkroute="/auth/Register"/>
        </div>
      </div>
  )
}