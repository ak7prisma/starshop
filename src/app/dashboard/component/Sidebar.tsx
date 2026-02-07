"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/app/utils/client";
import { LogOut, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { menuItems } from "@/constant/menu";
import { SidebarItem } from "./SideBarItems";

function useSidebarLogic() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isCollapsed, setIsCollapsed, isMobile };
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const { isCollapsed, setIsCollapsed, isMobile } = useSidebarLogic();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
        setIsLoggingOut(false);
    }
  };

  return (
    <aside 
      className={`
        h-screen bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out relative shrink-0
        ${isCollapsed ? "w-14 md:w-20" : "w-[280px]"} 
      `}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex absolute -right-3 top-9 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-full border-4 border-[#0B1120] shadow-lg z-50 transition-transform hover:scale-110 items-center justify-center"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
      </button>

      {/* Logo */}
      <div className="h-24 flex items-center justify-center border-b border-gray-800/50 w-full overflow-hidden">
        <Link href="/dashboard" className="flex items-center justify-center w-full h-full">
          {isCollapsed ? (
            <div className="animate-in zoom-in duration-300 p-2">
              <Image src="/favicon.ico" alt="Icon" width={24} height={24} className="object-contain md:w-9 md:h-9" />
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <Image src="/logostarshop.png" alt="Star Shop" width={150} height={40} className="object-contain" priority />
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-1.5 md:px-3 space-y-2 overflow-y-auto scrollbar-hide">
        {!isCollapsed && (
          <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 animate-in fade-in duration-300">
            Main Menu
          </p>
        )}

        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.name}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
            isMobile={isMobile}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-800/50">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`
            sticky bottom-5 flex items-center py-3 w-full text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-200 group overflow-hidden
            ${isCollapsed ? "justify-center" : "px-3 gap-3"}
            ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isLoggingOut ? <Loader2 size={22} className="animate-spin shrink-0" /> : <LogOut size={22} className="group-hover:rotate-12 transition-transform shrink-0" />}
          
          <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}