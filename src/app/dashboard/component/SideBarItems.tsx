import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
}

export const SidebarItem = ({ href, icon: Icon, label, isActive, isCollapsed, isMobile }: SidebarItemProps) => (
  <Link
    href={href}
    className={`
      flex items-center py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
      ${isCollapsed ? "justify-center px-0" : "px-3 gap-3"}
      ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-400 hover:bg-gray-800 hover:text-white"}
    `}
  >
    <Icon size={22} className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
    
    <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 origin-left ${
      isCollapsed ? "w-0 opacity-0 translate-x-10 hidden" : "w-auto opacity-100 translate-x-0"
    }`}>
      {label}
    </span>

    {isCollapsed && !isMobile && (
      <div className="absolute left-14 ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-gray-700 shadow-xl">
        {label}
      </div>
    )}
  </Link>
);