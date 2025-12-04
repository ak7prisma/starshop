"use client";
import { supabase } from "@/app/lib/supabase";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TbMenuDeep, TbX } from "react-icons/tb";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const mainMenuClass=`font-medium hover:text-indigo-300 transition duration-300`;
  const mobileMenuClass=`hover:text-indigo-300 transition`;

  useEffect(() => {
    supabase.auth.getSession().then(({ data : { session } }) => {
      setIsLogin(!!session)
      setLoading(false)
      }
    );

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLogin(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      router.push("/");
    }
    setLoading(false);
  };

  if (Loading) {
    return null; 
  }

  return (
    <nav className="fixed z-50 left-5 right-5 rounded-lg bg-[#243867]/30 text-white px-3 py-3 md:py-5 mt-5 md:mt-10">
      <div className="max-w-8xl mx-5 space-x-5 flex items-center justify-between">

        <Image 
          src="/logostarshop.png"
          alt="logostarshop" 
          width={100}
          height={40}
          className="font-medium tracking-wide mr-5 object-contain"
        />
        <div className="hidden md:flex space-x-10 items-center text-center">
          <Link 
            href="/Home" 
            className={mainMenuClass}>
            Home
          </Link>
          <Link 
            href="/About" 
            className={mainMenuClass}>
            About
            </Link>
        </div>
        <div className="hidden md:flex">
          {isLogin ? (
            <button 
              onClick={handleLogout} 
              disabled={Loading}
              className="bg-red-600 hover:bg-red-700 duration-300 text-slate-200 font-semibold py-2 px-4 rounded disabled:opacity-50">
              {Loading ? 'Logging out...' : 'Logout'}
            </button>
          ) : (
            <div className="space-x-4">
              <Link href="/auth/Login" className={mainMenuClass}>
                Login
              </Link>
              <Link href="/auth/Register" className="bg-indigo-700 hover:bg-indigo-800 duration-300 text-white font-semibold py-2 px-7 rounded">
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-[#1e293b] duration-300">
          {isOpen ? <TbX size={22} /> : <TbMenuDeep size={22} />}
        </button>
      </div>

      <div 
        className={
          `md:hidden mt-3 flex flex-col transition-all duration-400 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`
        }>
        <div className="flex justify-around bg-[#1e293b] rounded-lg p-4 mb-3">
          <Link 
            href="/Home" 
            className={mobileMenuClass}>
            Home
          </Link>
          <Link 
            href="/About" 
            className={mobileMenuClass}>
            About
          </Link>
        </div>
          {isLogin ? (
            <button 
              onClick={handleLogout} 
              disabled={Loading}
              className="bg-red-600 hover:bg-red-700 duration-300 text-slate-200 font-semibold py-2 px-4 rounded disabled:opacity-50">
              {Loading ? 'Logging out...' : 'Logout'}
            </button>
          ) : (
            <div className="flex justify-center text-center space-x-4">
              <Link href="/auth/Login" className="w-full bg-indigo-700 hover:bg-indigo-800 duration-300 text-white font-semibold py-2 px-7 rounded">
                Login
              </Link>
              <Link href="/auth/Register" className="w-full bg-indigo-700 hover:bg-indigo-800 duration-300 text-white font-semibold py-2 px-7 rounded">
                Register
              </Link>
            </div>
          )}
      </div>
    </nav>
  );
}