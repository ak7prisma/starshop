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
        <div className="fixed inset-0 z-50 h-full flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in zoom-in-95 duration-200 font-sans">
            <div className="bg-[#0B1120] border border-gray-800 w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-800 bg-gray-900/50 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
                    
                    <div className="flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pl-2 sm:pl-4 w-full pr-8 sm:pr-0">
                        
                        <div className="relative group/icon shrink-0 flex gap-5 md:pr-10 mb-3">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-800 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
                                {iconPreview ? (
                                    <img src={iconPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Gamepad2 className="text-white" size={28} />
                                )}
                            </div>
                            {/* Product Name Input */}
                            <Input 
                                required 
                                placeholder="Product Name" 
                                value={formData.nameProduct || ''} 
                                onChange={(e) => updateField("nameProduct", e.target.value)} 
                                leftIcon={<Gamepad2 size={14} />}
                            />
                        </div>

                        <div className="space-y-2 w-full">
                            
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-400">
                                <span className="bg-gray-800/80 px-2.5 py-0.5 rounded text-xs font-medium border border-gray-700 text-gray-300">
                                    {formData.category || 'Game'}
                                </span>
                                
                                <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-600"></span>
                                <span className="text-xs sm:text-sm">{items.length} Variants</span>
                                <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-600"></span>
                                
                                {/* Developer Input */}
                                <div className="w-full sm:w-48 mt-1 sm:mt-0">
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

                    <button onClick={onClose} className="absolute top-4.5 right-2 sm:top-6 sm:right-4 p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <X size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-[#0B1120] relative">
                    
                    {/* TTable Head */}
                    <div className="hidden sm:grid grid-cols-12 gap-6 px-10 py-5 border-b border-slate-800/50 mb-4 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 bg-[#0B1120]/90 z-10 backdrop-blur-sm">
                        <div className="col-span-8 pl-2">Item Name / Amount</div>
                        <div className="col-span-3">Selling Price (IDR)</div>
                        <div className="col-span-1 text-center">Action</div>
                    </div>

                    <div className="space-y-3 p-4 sm:px-6 sm:pb-10">
                        {items.map((item) => (
                            <div key={item.internalId} className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-6 items-start bg-gray-900/40 p-4 rounded-xl border border-gray-800/60 hover:border-gray-700 hover:bg-gray-900/80 transition-all group relative">

                                {/* Nama */}
                                <div className="w-full sm:col-span-8 flex items-center gap-4">
                                    <div className="p-2 bg-gray-950 rounded-lg border border-gray-800 shrink-0">
                                        <Package size={16} className="text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="sm:hidden text-[10px] text-gray-500 uppercase font-bold mb-1 block">Item Name</span>
                                        <Input 
                                            required 
                                            type='number'
                                            placeholder="E.g. 100" 
                                            value={item.name || ''} 
                                            onChange={(e) => updateItem(item.internalId, 'name', e.target.value)}
                                            className='bg-transparent border-0 border-b border-gray-800 px-0 rounded-lg shadow-none'
                                        />
                                    </div>
                                </div>

                                {/* Harga */}
                                <div className="w-full sm:col-span-3 sm:pt-1">
                                    <span className="sm:hidden text-[10px] text-gray-500 uppercase font-bold mb-1 block mt-2">Price (IDR)</span>
                                    <div className="relative">
                                        <Input 
                                            required
                                            type='number'
                                            placeholder="0" 
                                            value={item.price === 0 ? '' : item.price}
                                            onChange={(e) => updateItem(item.internalId, 'price', e.target.value === '' ? 0 : Number(e.target.value))}
                                            className='border border-gray-700px-0 focus:ring-0 shadow-none rounded-lg font-semibold'
                                            leftIcon={<span className="text-xs font-bold font-sans">Rp.</span>}
                                        />
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="absolute top-2 right-2 sm:static sm:col-span-1 sm:flex sm:items-center sm:justify-center sm:pt-2">
                                    {deleteConfirmId === item.internalId ? (
                                        <button
                                            onClick={() => removeItem(item.internalId)}
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

                {/* --- FOOTER --- */}
                <div className="p-4 sm:p-5 border-t border-gray-800 bg-gray-900 z-20 flex justify-end items-center gap-3">
                    <Button variant="secondary" onClick={onClose} className="text-sm">Cancel</Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        leftIcon={<Save size={18} />}
                        className="text-sm"
                    >
                        Save Changes
                    </Button>
                </div>

            </div>
        </div>
    );
};