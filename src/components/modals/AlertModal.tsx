"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle, XCircle, Trash2, X } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "delete" | "info";
  isLoading?: boolean;
}

export function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type,
  isLoading = false,
}: AlertModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const getConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle size={48} className="text-green-500" />,
          bgIcon: "bg-green-500/10",
          borderColor: "border-green-500/20",
          btnColor: "bg-green-600 hover:bg-green-500",
          btnText: "OK",
        };
      case "error":
        return {
          icon: <XCircle size={48} className="text-red-500" />,
          bgIcon: "bg-red-500/10",
          borderColor: "border-red-500/20",
          btnColor: "bg-red-600 hover:bg-red-500",
          btnText: "Close",
        };
      case "delete":
        return {
          icon: <Trash2 size={40} className="text-red-500" />,
          bgIcon: "bg-red-500/10",
          borderColor: "border-red-500/20",
          btnColor: "bg-red-600 hover:bg-red-500",
          btnText: "Delete",
        };
      default:
        return {
          icon: <AlertTriangle size={48} className="text-blue-500" />,
          bgIcon: "bg-blue-500/10",
          borderColor: "border-blue-500/20",
          btnColor: "bg-blue-600 hover:bg-blue-500",
          btnText: "OK",
        };
    }
  };

  const config = getConfig();

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`bg-gray-950 border ${config.borderColor} w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative`}>
        
        {!isLoading && (
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className="p-6 text-center">
          <div className={`w-20 h-20 ${config.bgIcon} rounded-full flex items-center justify-center mx-auto mb-4 border ${config.borderColor}`}>
            {config.icon}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 px-2">
            {message}
          </p>

          <div className="flex gap-3 justify-center">
            
            {type === "delete" && (
              <button
                disabled={isLoading}
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white font-medium transition-colors border border-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>
            )}

            <button
              disabled={isLoading}
              onClick={type === "delete" ? onConfirm : onClose}
              className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors shadow-lg shadow-black/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${config.btnColor}`}
            >
              {isLoading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                config.btnText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}