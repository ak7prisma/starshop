import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search Order ID, Product, ID Game..." }: SearchBarProps) {
  return (
    <div className="relative w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-950 border border-gray-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:border-blue-500 outline-none transition-colors"
      />
    </div>
  );
}