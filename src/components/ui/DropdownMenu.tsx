"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Clock} from "lucide-react";
import { STATUS_OPTIONS } from "@/constant/dropdownopt";

interface Props {
  value: string;
  onChange: (newStatus: string) => void;
  disabled?: boolean;
}

export default function DropdownMenu({
  value,
  onChange,
  disabled = false,
}: Readonly<Props>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = STATUS_OPTIONS.find((opt) => opt.id === value) || {
    label: value || "Unknown",
    icon: Clock,
    color: "text-gray-400",
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-28 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-[11px] font-medium capitalize transition-all 
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-500 focus:outline-none"} 
          ${isOpen ? "ring-1 ring-blue-500/50 border-blue-500" : ""}`}
      >
        <span className="text-white">{currentOption.label}</span>
        <ChevronDown
          size={12}
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180 text-white" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute right-0 mt-2 w-32 bg-[#0F172A] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          <div className="p-1 space-y-0.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] rounded-lg transition-colors text-left group/item ${
                  value === opt.id ? "bg-gray-800/80" : "hover:bg-gray-800"
                }`}
              >
                <opt.icon size={12} className={opt.color} />
                <span className={value === opt.id ? "text-white font-bold" : "text-gray-400 group-hover/item:text-gray-200"}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}