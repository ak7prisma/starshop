"use client";

import Link from "next/link";
import { Anta } from "next/font/google";
import { RiHammerLine, RiCodeBoxLine, RiArrowLeftLine } from "react-icons/ri";
import { Atom } from "react-loading-indicators";

const anta = Anta({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anta',
});

interface MaintenanceViewProps {
  backLink?: string;
}

export default function Maintenance({ backLink = "/" }: Readonly<MaintenanceViewProps>) {
  return (
    <div className={`min-h-screen w-full bg-[#0f172a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden ${anta.className}`}>
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -z-10" />

      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8 z-10">
        
        <div className="relative">
             <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-30 rounded-full" />
             <div className="bg-[#1e293b] p-6 rounded-2xl border border-indigo-500/30 shadow-2xl relative">
                <RiCodeBoxLine className="text-6xl md:text-8xl text-indigo-500 animate-pulse" />
                <div className="absolute -bottom-3 -right-3 bg-indigo-600 p-2 rounded-full border-4 border-[#0f172a]">
                    <RiHammerLine className="text-xl text-white animate-bounce" />
                </div>
             </div>
        </div>

        <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl tracking-wide">
                OUR TEAM <span className="text-indigo-500">BUILDING</span>
                <br /> A NEW FEATURE
            </h1>
            
            <p className="text-gray-400 text-sm md:text-lg max-w-lg mx-auto leading-relaxed">
                Website <span className="text-indigo-400 font-semibold">Starshop</span> sedang dalam tahap pengembangan untuk memberikan pengalaman Top Up termurah & terpercaya bagi Anda.
            </p>
        </div>

        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <Atom 
                color="#6366f1" 
                size="large" 
                text="" 
                textColor="" 
            />
            <span className="mt-4 text-indigo-200 font-medium tracking-wider animate-pulse">
                Development...
            </span>
        </div>

        <div className="pt-5">
            <Link 
                href={backLink} 
                className="group flex items-center space-x-2 px-8 py-3 bg-[#1e293b] hover:bg-indigo-600 border border-indigo-500/30 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-indigo-500/25"
            >
                <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
                <span>Kembali Sementara</span>
            </Link>
        </div>

      </div>

    </div>
  );
}