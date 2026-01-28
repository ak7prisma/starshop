import { Check, X } from "lucide-react";

interface ToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
}

export default function Toast({ show, message, type, onClose }: ToastProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
      <div className="bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3">
        <div className={`p-1 rounded-full ${type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
          {type === 'success' ? <Check size={16} /> : <X size={16} />}
        </div>
        <p className="text-sm font-medium">{message}</p>
        {onClose && (
          <button onClick={onClose} className="ml-2 text-gray-500 hover:text-white">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}