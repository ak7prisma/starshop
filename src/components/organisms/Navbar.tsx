'use client';

import { createClient } from "@/app/utils/client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TbMenuDeep, TbX } from "react-icons/tb";
import { useRouter } from 'next/navigation';
import { navLinks } from "@/constant/menu";
import { motion } from "framer-motion";
import { fadeIn } from "@/components/animations/variants";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");

  const supabase = createClient();

  const mainMenuClass = `font-medium hover:text-indigo-300 transition duration-300`;
  const mobileMenuClass = `hover:text-indigo-300 transition`;
  const loginClass = `bg-red-600 hover:bg-red-700 duration-300 text-slate-200 font-semibold py-2 px-4 rounded disabled:opacity-50`;

  // Fungsi untuk mengambil data profil user
  const fetchUserProfile = async (userId:string) => {
    console.log("[Auth] Mencoba mengambil profil untuk ID:", userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('idProfil', userId)
      .single();

    if (error) {
      console.error("[Auth Error] Gagal mengambil data profil:", error.message);
    } else if (data) {
      console.log("[Auth Success] Data profil berhasil diambil:", data);
      setUsername(data.username);
    }
  };

  useEffect(() => {
    console.log("[Auth] Mengecek session saat komponen dimuat...");
    
    // Cek session awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log("[Auth] Session ditemukan:", session.user.id);
        setIsLogin(true);
        fetchUserProfile(session.user.id);
      } else {
        console.log("[Auth] Tidak ada session aktif.");
        setIsLogin(false);
      }
      setLoading(false);
    });

    // Listener untuk perubahan status autentikasi (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[Auth Event] Perubahan status auth:", event);
        if (session) {
          setIsLogin(true);
          fetchUserProfile(session.user.id);
        } else {
          setIsLogin(false);
          setUsername("");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    console.log("[Auth] Memulai proses logout...");
    const { error } = await supabase.auth.signOut();

    if (!error) {
      console.log("[Auth] Logout berhasil.");
      router.push("/");
    } else {
      console.error("[Auth Error] Gagal logout:", error.message);
    }
    setLoading(false);
  };

  if (Loading) {
    return null;
  }

  return (
    <motion.nav
      variants={fadeIn('down', 0)}
      initial="hidden"
      animate="show"
      className="fixed z-50 left-5 right-5 rounded-lg bg-[#243867]/30 text-white px-1 md:px-5 py-3 md:py-5 mt-10"
    >
      <div className="max-w-8xl mx-5 space-x-5 flex items-center justify-between">
        <Image
          src="/logostarshop.png"
          alt="logostarshop"
          width={100}
          height={40}
          className="font-medium tracking-wide mr-5 object-contain"
        />
        <div className="hidden md:flex space-x-10 items-center text-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={mainMenuClass}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center">
          {isLogin ? (
            <div className="flex items-center space-x-4">
              <span className="font-medium text-slate-200">
                Hi, {username ? username : 'Loading...'}
              </span>
              <button
                onClick={handleLogout}
                disabled={Loading}
                className={loginClass}>
                {Loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
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
          className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-[#1e293b] duration-300">
          {isOpen ? <TbX size={24} /> : <TbMenuDeep size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden mt-3 flex flex-col transition-all duration-400 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="flex justify-around bg-[#1e293b] rounded-lg p-4 mb-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={mobileMenuClass}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        {/* Mobile Auth Buttons */}
        {isLogin ? (
          <div className="flex flex-col space-y-3 px-2">
            <span className="font-medium text-slate-200 text-center">
              Hi, {username ? username : 'Loading...'}
            </span>
            <button
              onClick={handleLogout}
              disabled={Loading}
              className={loginClass}>
              {Loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
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
    </motion.nav>
  );
}