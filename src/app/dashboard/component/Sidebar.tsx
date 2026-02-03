"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/app/utils/client";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const supabase = createClient();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/dashboard/transactions", icon: ShoppingCart },
    { name: "Products", href: "/dashboard/products", icon: Package },
  ];

  return (
    <aside
      className={`h-screen bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out relative ${
        isCollapsed ? "w-[80px]" : "w-[280px]"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-9 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-full border-4 border-[#0B1120] shadow-lg z-50 transition-transform hover:scale-110 flex items-center justify-center"
      >
        {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
      </button>

      <div className="h-24 flex items-center justify-center border-b border-gray-800/50 transition-all duration-300 w-full overflow-hidden relative">
        <Link href="/dashboard" className="flex items-center justify-center w-full h-full">
            {!isCollapsed ? (
                 <div className="animate-in fade-in duration-500 w-full flex justify-center items-center">
                    <Image
                        src="/logostarshop.png"
                        alt="Star Shop"
                        width={150} 
                        height={40} 
                        className="object-contain mx-auto"
                        priority
                    />
                 </div>
            ) : (
                <div className="animate-in zoom-in duration-300 flex justify-center items-center p-2">
                    <Image
                        src="/favicon.ico"
                        alt="Icon"
                        width={36}
                        height={36}
                        className="object-contain"
                    />
                </div>
            )}
        </Link>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <p className={`px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 transition-opacity duration-300 ${
            isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
        }`}>
            Main Menu
        </p>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <item.icon
                size={22}
                className={`transition-colors flex-shrink-0 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`}
              />
              <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 origin-left ${
                  isCollapsed ? "w-0 opacity-0 translate-x-10 overflow-hidden" : "w-auto opacity-100 translate-x-0"
              }`}>
                  {item.name}
              </span>
              
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-gray-700 shadow-xl">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-800/50 space-y-1">
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center gap-3 px-3 py-3 w-full text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-200 group overflow-hidden ${isCollapsed ? 'justify-center' : ''} ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoggingOut ? (
             <Loader2 size={22} className="animate-spin flex-shrink-0" />
          ) : (
             <LogOut size={22} className="group-hover:rotate-12 transition-transform flex-shrink-0" />
          )}
          
          <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}>
             {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}