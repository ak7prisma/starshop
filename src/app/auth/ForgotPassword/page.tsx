"use client";
import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import FormHeader from '@/app/auth/component/AuthHeader';
import FormFooter from '@/app/auth/component/AuthFooter';
import SubmitLoading from '@/components/ui/SubmitLoading';
import { Input } from '@/components/ui/Input';
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/components/animations/variants";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const redirectUrl = '/auth/ResetPassword';

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
    <motion.div 
        variants={staggerContainer(0.1, 0.1)}
        initial="hidden"
        animate="show"
        className="flex min-h-full flex-col justify-center items-center"
    >
      <motion.div variants={fadeIn('up', 0.1)}>
        <FormHeader label1="Forgot Password" label2="Enter your email to reset password." />
      </motion.div>

      <motion.div variants={fadeIn('up', 0.2)} className="mt-10 w-full">
        <form onSubmit={handlePasswordReset} className="space-y-6">

          <Input
            label='Email Address'
            id='email'
            type='email'
            name='email'
            placeholder='youremail@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {(error || message) && (
            <div className={`p-3 rounded-md text-center text-sm ${message ? 'bg-green-600/10 text-green-400' : 'bg-red-600/10 text-red-400'}`}>
              {error || message}
            </div>
          )}

          <SubmitLoading
            label='Login'
            loading={loading}
            disabled={loading} />

        </form>

        <FormFooter label1="Remember your password?" label2="Log In" linkroute="/auth/Login" />
      </motion.div>
    </motion.div>
  );
}