"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import { Suspense } from 'react';

const disablePaths = new Set([
  '/auth/Login',
  '/auth/Register',
  '/auth/ForgotPassword',
  '/auth/ResetPassword', 
  '/dashboard' ,
  '/dashboard/transactions',
  '/dashboard/products',
]);

export default function LayoutSetting({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  
  const Layoutshow = !disablePaths.has(pathname ?? '');

  return (
    <>
      {Layoutshow && (
        <Suspense fallback={null}> 
           <Navbar />
        </Suspense>
      )}
      
      {children} 
      
      {Layoutshow && <Footer />}
    </>
  );
}