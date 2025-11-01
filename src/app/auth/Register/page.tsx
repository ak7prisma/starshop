"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import FormHeader from '@/app/components/ui/AuthHeader';
import FormFooter from '@/app/components/ui/AuthFooter';
import SubmitLoading from '@/app/components/ui/SubmitLoading';
import InputForm from '@/app/components/ui/InputForm';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegist = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username,   
        }
      }
    });

    if (error) {
      setError(error.message);
    }
    else if (password === confirmedPassword){
      setError('Registration successful! Please check your email to confirm your account before logging in.');
      router.push("/auth/Login");
    }
    else {
      setError("The password and confirmation are different!");
      setLoading(false);
    }

    setLoading(false);
  };
  return (

      <div className="flex min-h-full flex-col justify-center px-6 py-15 lg:px-8">
        <FormHeader label1="Create your account" label2="Register your account to access full feature in Starshop."/>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleRegist} method="POST" className="space-y-6">
            <InputForm 
              label='Username'
              identity='username'
              type='text'
              placeholder='Antonio Sandova'
              value={username}
              onChange={setUsername}/>

            <InputForm 
              label='Email Address'
              identity='email'
              type='email'
              placeholder='youremail@example.com'
              value={email}
              onChange={setEmail}/>

            <InputForm 
              label='Password'
              identity='password'
              type='password'
              value={password}
              onChange={setPassword}/>

            <InputForm 
              label='Confirmed Password'
              identity='confirmedpassword'
              type='password'
              value={confirmedPassword}
              onChange={setConfirmedPassword}/>

            {error && (
              <p className={`text-sm text-center ${error.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {error}
              </p>
            )}

            <SubmitLoading 
              label='Register' 
              loading={loading}
              disabled={loading}/>
          </form>

          <FormFooter 
            label1="Do you have an account?" 
            label2="Log In" 
            linkroute="/auth/Login"/>
        </div>
      </div>
  )
}