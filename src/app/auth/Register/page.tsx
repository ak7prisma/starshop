"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormHeader from '@/app/auth/component/AuthHeader';
import FormFooter from '@/app/auth/component/AuthFooter';
import SubmitLoading from '@/components/ui/SubmitLoading';
import { Input } from '@/components/ui/Input';
import { registerAction } from '../action';

export default function Register() {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegist = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmedPassword) {
      setError("Password dan Konfirmasi berbeda!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('username', username);

    const result = await registerAction(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setError('Registrasi berhasil! Cek email untuk konfirmasi.');
      router.push("/auth/Login");
    }
    
    setLoading(false);
  };

  return (
      <div className="flex min-h-full flex-col justify-center px-6 py-15 lg:px-8">
        <FormHeader label1="Create your account" label2="Register to Starshop."/>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleRegist} className="space-y-6">
            
            <Input
              required 
              label='Username'
              id='username'
              type='text'
              name='username'
              placeholder='Antonio Sandova'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

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
              label='Password'
              id='password'
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              required 
              label='Confirmed Password'
              id='confirmedpassword'
              type='password'
              name='password'
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
            />

            {error && (
              <p className={`text-sm text-center ${error.includes('berhasil') ? 'text-green-600' : 'text-red-600'}`}>
                {error}
              </p>
            )}

            <SubmitLoading 
              label='Register' 
              loading={loading}
              disabled={loading}
            />
          </form>

          <FormFooter label1="Have an account?" label2="Log In" linkroute="/auth/Login"/>
        </div>
      </div>
  )
}