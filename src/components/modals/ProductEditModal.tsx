import { useEffect, useState } from 'react';
import { X, Package, Check, Trash2, Save, Plus, User, Gamepad2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Product } from '@/datatypes/productsType';
import { useProductForm } from '@/hooks/useProductForm';

interface ProductEditModalProps {
    selectedGame: Product;
    onClose: () => void;
    onSave: (updatedProduct: Product) => void;
}

export const ProductEditModal = ({
    selectedGame,
    onClose,
    onSave,
}: ProductEditModalProps) => {
    const {
        formData,
        items,
        iconPreview,
        updateField,
        addItem,
        removeItem,
        updateItem,
        setInitialData,
        getSubmitData
    } = useProductForm();

    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    useEffect(() => {
        if (selectedGame) {
            setInitialData(selectedGame);
        }
    }, [selectedGame, setInitialData]);

    const handleSave = () => {
        if (!formData.nameProduct) return alert("Product Name is required!");
        
        const finalData = getSubmitData();
        onSave({ ...finalData, idProduct: selectedGame.idProduct }); 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in zoom-in-95 duration-200 font-sans">
            <div className="bg-[#0B1120] border border-gray-800 w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
                    <div className="flex items-center gap-6 pl-4 w-full">
                        
                        <div className="relative group/icon shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
                                {iconPreview ? (
                                    <img src={iconPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Gamepad2 className="text-white" size={32} />
                                )}
                            </div>
                        </div>

                        <div className="flex-1 space-y-1">
                            <Input 
                                required 
                                placeholder="Product Name" 
                                value={formData.nameProduct || ''} 
                                onChange={(e) => updateField("nameProduct", e.target.value)} 
                                leftIcon={<Gamepad2 size={14} />}
                                
                            />
                            
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <span className="bg-gray-800/80 px-2.5 py-0.5 rounded text-xs font-medium border border-gray-700 text-gray-300">
                                    {formData.category || 'Game'}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                <span>{items.length} Variants</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                
                                {/* Developer */}
                                <div className="w-48">
                                    <Input 
                                        required 
                                        placeholder="Developer" 
                                        value={formData.developer || ''} 
                                        onChange={(e) => updateField("developer", e.target.value)} 
                                        leftIcon={<User size={14} />} 
                                        className="py-1 text-xs bg-gray-950/50 border-gray-800"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-6 bg-[#0B1120] relative">
                    <div className="grid grid-cols-12 gap-6 px-4 py-5 border-b border-slate-800/50 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 bg-[#0B1120]/90 z-10">
                        <div className="col-span-8 pl-2">Item Name / Amount</div>
                        <div className="col-span-3">Selling Price (IDR)</div>
                        <div className="col-span-1 text-center">Action</div>
                    </div>

                    <div className="space-y-3 pb-10">
                        {items.map((item) => (
                            <div key={item.internalId} className="grid grid-cols-12 gap-6 items-start bg-gray-900/40 p-4 rounded-xl border border-gray-800/60 hover:border-gray-700 hover:bg-gray-900/80 transition-all group">

                                <div className="col-span-8 flex items-center gap-4">
                                    <div className="p-2 bg-gray-950 rounded-lg border border-gray-800">
                                        <Package size={16} className="text-gray-500" />
                                    </div>
                                    <Input 
                                        required 
                                        type='number'
                                        placeholder="E.g. 100 Diamonds" 
                                        value={item.name || ''} 
                                        onChange={(e) => updateItem(item.internalId, 'name', e.target.value)}
                                        className='bg-transparent'
                                    />
                                </div>

                                <div className="col-span-3 pt-1">
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-500">Rp</span>
                                        <input
                                            type="number"
                                            value={item.price === 0 ? '' : item.price}
                                            onChange={(e) => updateItem(item.internalId, 'price', e.target.value === '' ? 0 : Number(e.target.value))}
                                            className="w-full pl-8 pr-3 py-2 bg-gray-950 border border-gray-700 text-white rounded-lg text-sm font-bold focus:outline-none focus:border-blue-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-1 flex items-center justify-center pt-2">
                                    {deleteConfirmId === item.internalId ? (
                                        <button
                                            onClick={() => removeItem(item.internalId)} // Pakai function hook
                                            className="bg-red-500/20 text-red-500 p-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Check size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirmId(item.internalId)}
                                            onBlur={() => setTimeout(() => setDeleteConfirmId(null), 200)}
                                            className="text-gray-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addItem}
                            className="w-full border border-dashed border-gray-800 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-500 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-900/10 transition-all group mt-4"
                        >
                            <Plus size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-sm">Add New Variant</span>
                        </button>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-800 bg-gray-900 z-20 flex justify-end items-center gap-3">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        leftIcon={<Save size={18} />}
                    >
                        Save Changes
                    </Button>
                </div>

            </div>
        </div>
    );
};