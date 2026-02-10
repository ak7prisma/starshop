'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import FormHeader from '@/app/auth/component/AuthHeader';
import FormFooter from '@/app/auth/component/AuthFooter';
import SubmitLoading from '@/components/ui/SubmitLoading';
import { Input } from '@/components/ui/Input';
import { loginAction } from '../action';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FaGoogle } from 'react-icons/fa';
import { createBrowserClient } from '@supabase/ssr';
import { Turnstile } from '@marsidev/react-turnstile';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined);

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
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const origin = globalThis.location.origin
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`, 
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  }

  return (
      <div className="flex min-h-full flex-col justify-center px-6 py-15 lg:px-8">
        <Turnstile
          siteKey="0x4AAAAAACaARJ4VrWF7Q2JW"
          onSuccess={(token) => {
            setCaptchaToken(token)
          }}
        />
        <FormHeader label1="Welcome back!" label2="Welcome back! Please enter your account information."/>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              required
              label='Email Address'
              id='email'
              type='email'
              name='email'
              placeholder='youremail@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              required
              label="Password"
              id="password"
              type="password"
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              extraLabel={
              <div className="text-sm">
                  <Link href="/auth/ForgotPassword" className="font-semibold text-indigo-400 hover:text-indigo-300">
                      Forgot password?
                  </Link>
              </div>
              }
            />

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
            linkroute="/auth/Register"
          >
            or
            <Button 
                onClick={handleGoogleLogin} 
                className="w-full" 
                variant='secondary' 
                type="button" 
                leftIcon={<FaGoogle size={18}/>}
            >
              Continue with Google
            </Button>
          </FormFooter>
        </div>
      </div>
  )
}