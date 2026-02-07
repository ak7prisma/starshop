"use client";

import Link from "next/link";
import { navLinks, socialLinks } from "@/constant/menu";

export default function Footer() {

  const footerMenuClass=`hover:text-indigo-400 transition duration-300`;

  return (
    <footer className="bg-[#243867]/30 text-gray-300 pt-10">
      <div className="mx-5 flex flex-col items-center space-y-6">

        <div className="flex space-x-6">
          
          {socialLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href} 
              className={footerMenuClass}
            >
              {<link.icon size={20}/>}
            </Link>
          ))}
          
        </div>

        <div className="flex space-x-8 font-medium">
        
        {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href} 
              className={footerMenuClass}
            >
              {link.label}
            </Link>
          ))}
          
        </div>

        <div className="text-sm text-slate-400 text-center py-5 border-t border-slate-400 w-full">
          © 2026 Starshop Top Up Project | ahmadkurniaprisma@gmail.com
        </div>
      </div>
    </footer>
  );
}
