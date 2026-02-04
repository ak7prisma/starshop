interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function FilterTabs({ tabs, activeTab, onTabChange }: Readonly<FilterTabsProps>) {
  return (
    <div className="flex gap-2 p-2 overflow-x-auto max-w-full">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === tab 
              ? "bg-gray-800 text-white shadow ring-1 ring-gray-700" 
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
    
  );
}