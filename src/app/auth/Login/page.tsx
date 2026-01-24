'use client';

import { useState } from 'react';
import Link from "next/link";
import FormHeader from '@/app/auth/component/AuthHeader';
import FormFooter from '@/app/auth/component/AuthFooter';
import SubmitLoading from '@/app/components/ui/SubmitLoading';
import InputForm from '@/app/components/ui/InputForm';
import { loginAction } from '../action';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    const result = await loginAction(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      
      router.refresh() 
      
      router.push(result.redirectUrl || '/') 
      
      setLoading(false)
    }
  }

  return (
      <div className="flex min-h-full flex-col justify-center px-6 py-15 lg:px-8">
        <FormHeader label1="Welcome back!" label2="Welcome back! Please enter your account information."/>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
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
              <p className="text-sm text-center text-red-600 bg-red-500/10 p-2 rounded border border-red-500/20">
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
            label2="Sign Up"
            linkroute="/auth/Register"/>
        </div>
      </div>
  )
}