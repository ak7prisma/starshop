import {
    Gamepad2, Upload, AlertTriangle, X, Package, Zap, Check, Trash2, Save, Plus
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

type GameItem = {
    id: number;
    name: string;
    code: string;
    price: number;
    originalPrice: number;
    isActive: boolean;
};

type GameProduct = {
    id: number;
    name: string;
    publisher: string;
    category: string;
    status: "active" | "maintenance" | "inactive";
    imageColor: string;
    items: GameItem[];
};

interface ProductEditModalProps {
    selectedGame: GameProduct;
    onClose: () => void;
    onSave: () => void;
    onUpdateItem: (itemId: number, field: keyof GameItem, value: any) => void;
    onAddItem: () => void;
    onRemoveItem: (itemId: number) => void;
    deleteConfirmId: number | null;
    setDeleteConfirmId: (id: number | null) => void;
}

export const ProductEditModal = ({
    selectedGame,
    onClose,
    onSave,
    onUpdateItem,
    onAddItem,
    onRemoveItem,
    deleteConfirmId,
    setDeleteConfirmId
}: ProductEditModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in zoom-in-95 duration-200">
            <div className="bg-[#0B1120] border border-gray-800 w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 relative">
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${selectedGame.imageColor}`} />

                    <div className="flex items-center gap-6 pl-4">
                        <div className="relative group/icon cursor-pointer">
                            <div className={`w-16 h-16 rounded-2xl ${selectedGame.imageColor} flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all group-hover/icon:brightness-50`}>
                                <Gamepad2 className="text-white" size={32} />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity">
                                <Upload className="text-white drop-shadow-md" size={20} />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">{selectedGame.name}</h2>
                            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                <span className="bg-gray-800/80 px-2.5 py-0.5 rounded text-xs font-medium border border-gray-700">{selectedGame.category}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <span>{selectedGame.items.length} Products configured</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-blue-900/20 border border-blue-500/20 rounded-lg text-blue-400 text-xs font-medium flex items-center gap-2">
                            <AlertTriangle size={14} /> Auto-save disabled
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-[#0B1120] relative">

                    <div className="grid grid-cols-12 gap-6 px-4 pb-3 border-b border-gray-800/50 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 bg-[#0B1120] z-10">
                        <div className="col-span-5 pl-2">Product Name & SKU</div>
                        <div className="col-span-2">Base Cost (Modal)</div>
                        <div className="col-span-3">Selling Price (Jual)</div>
                        <div className="col-span-2 text-center">Status & Action</div>
                    </div>

                    <div className="space-y-3 pb-20">
                        {selectedGame.items.map((item) => {
                            const profit = item.price - item.originalPrice;
                            const isLoss = profit < 0;

                            return (
                                <div key={item.id} className="grid grid-cols-12 gap-6 items-start bg-gray-900/40 p-4 rounded-xl border border-gray-800/60 hover:border-gray-700 hover:bg-gray-900/80 transition-all group">

                                    <div className="col-span-5 space-y-2">
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                                            placeholder="E.g. Weekly Diamond Pass"
                                            className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none placeholder:text-gray-600 border-b border-transparent focus:border-blue-500 transition-colors pb-1"
                                        />
                                        <div className="flex items-center gap-2 bg-gray-950/50 px-2 py-1.5 rounded-lg border border-gray-800 w-fit">
                                            <Package size={12} className="text-gray-500" />
                                            <input
                                                type="text"
                                                value={item.code}
                                                onChange={(e) => onUpdateItem(item.id, 'code', e.target.value)}
                                                placeholder="SKU-CODE"
                                                className="bg-transparent text-xs text-gray-400 focus:outline-none focus:text-blue-400 font-mono w-24 uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2 pt-1">
                                        <div className="relative group/input">
                                            <span className="absolute left-3 top-2.5 text-gray-500 text-xs font-medium">Rp</span>
                                            <input
                                                type="number"
                                                value={item.originalPrice || ''}
                                                onChange={(e) => onUpdateItem(item.id, 'originalPrice', Number(e.target.value))}
                                                className="w-full pl-8 pr-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-gray-400 focus:text-white focus:outline-none focus:border-gray-600 transition-all"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-3 pt-1">
                                        <div className="relative">
                                            <span className={`absolute left-3 top-2.5 text-xs font-bold ${isLoss ? 'text-red-500' : 'text-green-500'}`}>Rp</span>
                                            <input
                                                type="number"
                                                value={item.price || ''}
                                                onChange={(e) => onUpdateItem(item.id, 'price', Number(e.target.value))}
                                                className={`w-full pl-8 pr-3 py-2 bg-gray-950 border rounded-lg text-sm font-bold focus:outline-none focus:ring-1 transition-all shadow-inner ${isLoss
                                                    ? 'border-red-900/50 text-red-400 focus:border-red-500 focus:ring-red-500/20'
                                                    : 'border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20'
                                                    }`}
                                                placeholder="0"
                                            />

                                            <div className={`mt-1.5 flex items-center gap-1.5 text-[10px] font-medium ${isLoss ? 'text-red-400' : 'text-emerald-500'}`}>
                                                {isLoss ? <AlertTriangle size={10} /> : <Zap size={10} />}
                                                {isLoss ? 'LOSS ALERT: ' : 'PROFIT: '}
                                                {profit > 0 ? '+' : ''}{profit.toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex items-center justify-center gap-4 pt-2">
                                        <div
                                            onClick={() => onUpdateItem(item.id, 'isActive', !item.isActive)}
                                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${item.isActive ? 'bg-blue-600' : 'bg-gray-700'}`}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${item.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>

                                        {deleteConfirmId === item.id ? (
                                            <button
                                                onClick={() => onRemoveItem(item.id)}
                                                className="bg-red-500/20 text-red-500 p-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all animate-in zoom-in"
                                                title="Confirm Delete"
                                            >
                                                <Check size={16} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirmId(item.id)}
                                                onBlur={() => setDeleteConfirmId(null)} // Cancel if clicked away
                                                className="text-gray-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                                title="Delete Item"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            onClick={onAddItem}
                            className="w-full border border-dashed border-gray-800 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-500 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-900/10 transition-all group mt-4"
                        >
                            <Plus size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-sm">Add New Variant</span>
                        </button>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-800 bg-gray-900 z-20 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                    <Button variant="danger" size="sm" onClick={() => { }} leftIcon={<Trash2 size={16} />} className="opacity-60 hover:opacity-100">
                        Delete Entire Game
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={onSave}
                            leftIcon={<Save size={18} />}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};
