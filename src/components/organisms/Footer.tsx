"use client";

import Link from "next/link";
import { navLinks } from "@/constant/menu";
import { socialLinks } from "@/constant/socialdata";
import { motion } from "framer-motion";
import { fadeIn } from "@/animations/variants";

export default function Footer() {

  const footerMenuClass=`hover:text-indigo-400 transition duration-300`;

  return (
    <motion.footer 
      variants={fadeIn('up', 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="bg-[#243867]/30 text-gray-300 pt-10"
    >
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

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 font-medium">
        
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
    </motion.footer>
  );
}
