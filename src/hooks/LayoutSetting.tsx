"use client";

import { usePathname } from 'next/navigation';
import Navbar from '../app/components/Navbar';
import Footer from '../app/components/Footer';

const disablePaths = new Set([
  '/auth/Login',
  '/auth/Register',
  '/auth/ForgotPassword',
  '/auth/ResetPassword',
  '/Admin', 
]);

export default function LayoutSetting({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  
  const Layoutshow = !disablePaths.has(pathname ?? '');

  return (
    <>
      {Layoutshow && <Navbar />}
      {children} 
      {Layoutshow && <Footer />}
    </>
  );
}