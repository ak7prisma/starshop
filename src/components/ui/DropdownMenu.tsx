"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";

export type DropdoenMenu = {
  value: string;
  label: string;
  icon?: LucideIcon;
};

interface Props {
  label?: string;
  options: DropdoenMenu[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
}

export default function SelectDropdown({
  label,
  options,
  value,
  onChange,
  icon,
  placeholder = "Select option",
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

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      {label && <label className="text-xs text-gray-400 ml-1">{label}</label>}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {icon}
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between bg-gray-950 border border-gray-800 text-white rounded-lg text-sm py-2.5 px-4 transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            icon ? "pl-10" : ""
          } ${isOpen ? "border-indigo-500 ring-1 ring-indigo-500" : ""}`}
        >
          <span className={selectedOption ? "text-white" : "text-gray-500"}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-white" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute w-full mt-2 bg-[#0F172A] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top">
            <div className="p-1 space-y-0.5 max-h-60 overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                    value === opt.value
                      ? "bg-blue-600 text-white font-medium"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {opt.icon && <opt.icon size={16} />}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}