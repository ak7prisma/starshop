"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Atom } from "react-loading-indicators";

export default function Loading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");

      if (!anchor?.href) return;

      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      if (anchor.target === "_blank") return;

      if (
        anchor.hasAttribute("download") ||
        anchor.href.startsWith("mailto:") ||
        anchor.href.startsWith("tel:")
      ) return;

      const targetUrl = new URL(anchor.href);
      const currentUrl = new URL(globalThis.location.href);

      const isInternal = targetUrl.origin === currentUrl.origin;
      const isSamePage = 
        targetUrl.pathname === currentUrl.pathname && 
        targetUrl.search === currentUrl.search;

      if (isInternal && !isSamePage) {
        setIsLoading(true);
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center backdrop-blur-sm bg-slate-900/50 transition-all duration-300">
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <Atom 
          color="#6366f1" 
          size="large" 
          text="" 
          textColor="" 
        />
        <span className="mt-4 text-indigo-200 font-medium tracking-wider animate-pulse">
          Loading Starshop...
        </span>
      </div>
    </div>
  );
}