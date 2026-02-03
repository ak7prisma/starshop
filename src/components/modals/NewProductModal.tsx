"use client";

import { useState, useRef } from "react";
import {
  X, Package, Trash2, Save, Plus, Upload, Image as ImageIcon, Loader2, 
  Gamepad2, User, Gem, LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Product } from "@/datatypes/productsType";
import { createClient } from "@/app/utils/client";

type GameItem = {
  internalId: number;
  name: string;
  price: number;
};

interface NewProductModalProps {
  onClose: () => void;
  onSave: (newProduct: Omit<Product, 'idProduct'>) => void;
}

const BUCKET_NAME = "productsIcon"; 

export const NewProductModal = ({ onClose, onSave }: NewProductModalProps) => {
  const supabase = createClient();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sideFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    nameProduct: "",
    developer: "",
    category: "Games",
    itemName: "", 
  });

  const [items, setItems] = useState<GameItem[]>([
    { internalId: Date.now(), name: "", price: 0 }
  ]);

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [sideFile, setSideFile] = useState<File | null>(null);
  const [sidePreview, setSidePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFormChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'icon' | 'side') => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      if (type === 'icon') {
        setIconFile(file);
        setIconPreview(previewUrl);
      } else {
        setSideFile(file);
        setSidePreview(previewUrl);
      }
    }
  };

  const handleUpdateItem = (internalId: number, field: keyof GameItem, value: any) => {
    setItems((prev) =>
      prev.map((item) =>
        item.internalId === internalId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddItem = () => {
    setItems([...items, { internalId: Date.now(), name: "", price: 0 }]);
  };

  const handleRemoveItem = (internalId: number) => {
    if (items.length === 1) return alert("Minimal harus ada 1 varian!");
    setItems(items.filter((item) => item.internalId !== internalId));
  };

  const handleSaveProcess = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (!iconFile) return alert("Wajib upload icon produk!");
    const validItems = items.filter(i => i.name.trim() !== "");
    if (validItems.length === 0) return alert("Mohon isi minimal satu varian produk.");

    setIsUploading(true);

    try {
      let iconPath = "";
      let sidePath = "";

      const iconExt = iconFile.name.split('.').pop();
      const iconFileName = `icon_${Date.now()}.${iconExt}`;
      const { error: iconError } = await supabase.storage.from(BUCKET_NAME).upload(iconFileName, iconFile);
      if (iconError) throw iconError;
      
      iconPath = `${formData.category}/${iconFileName}`;

      if (sideFile) {
        const sideExt = sideFile.name.split('.').pop();
        const sideFileName = `side_${Date.now()}.${sideExt}`;
        const { error: sideError } = await supabase.storage.from(BUCKET_NAME).upload(sideFileName, sideFile);
        if (sideError) throw sideError;
        
        sidePath = `${formData.category}/${sideFileName}`;
      }

      const newProductPayload: Omit<Product, 'idProduct'> = {
        nameProduct: formData.nameProduct || "",
        developer: formData.developer || "",
        category: formData.category || "Games",
        itemName: formData.itemName || "Diamonds",
        
        imgUrl: iconPath,
        sideImgUrl: sidePath,

        imgAlt: formData.nameProduct || "Game Icon",
        sideImgAlt: "Side Banner",
        
        href: "", 

        amount: items.map((i) => i.name),
        price: items.map((i) => i.price),
      };

      onSave(newProductPayload);

    } catch (error: any) {
      console.error("Error:", error);
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in zoom-in-95 duration-200 font-sans">
      <div className="bg-[#0B1120] border border-gray-800 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New Product</h2>
              <p className="text-xs text-gray-400">Fill in details and upload assets.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSaveProcess} className="flex flex-col flex-1 overflow-hidden">
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* KOLOM KIRI: UPLOAD */}
              <div className="md:col-span-4 space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Icon <span className="text-red-500">*</span></label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative aspect-square rounded-2xl border-2 border-dashed border-gray-700 bg-gray-900/50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all group overflow-hidden ${!iconPreview ? 'p-8' : ''}`}
                  >
                    {iconPreview ? (
                      <img src={iconPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Upload size={20} className="text-gray-400 group-hover:text-blue-400" />
                        </div>
                        <span className="text-xs text-gray-500 text-center">Click to upload</span>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageSelect(e, 'icon')} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">Banner (Optional)</label>
                  <div 
                    onClick={() => sideFileInputRef.current?.click()}
                    className="relative h-32 rounded-xl border border-dashed border-gray-700 bg-gray-900/50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all group overflow-hidden"
                  >
                    {sidePreview ? (
                      <img src={sidePreview} alt="Side Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <ImageIcon size={16} />
                        <span className="text-xs">Upload banner</span>
                      </div>
                    )}
                    <input type="file" ref={sideFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageSelect(e, 'side')} />
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: DATA */}
              <div className="md:col-span-8 space-y-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-800 pb-2">Basic Details</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 ml-1">Product Name <span className="text-red-500">*</span></label>
                    <Input required placeholder="e.g. Mobile Legends" value={formData.nameProduct} onChange={(e) => handleFormChange("nameProduct", e.target.value)} leftIcon={<Gamepad2 size={16} />} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 ml-1">Developer <span className="text-red-500">*</span></label>
                      <Input required placeholder="e.g. Moonton" value={formData.developer} onChange={(e) => handleFormChange("developer", e.target.value)} leftIcon={<User size={16} />} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 ml-1">Item Name <span className="text-red-500">*</span></label>
                      <Input required placeholder="e.g. Diamonds" value={formData.itemName} onChange={(e) => handleFormChange("itemName", e.target.value)} leftIcon={<Gem size={16} />} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 ml-1">Category</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            <LayoutGrid size={16} />
                        </div>
                        <select
                          value={formData.category}
                          onChange={(e) => handleFormChange("category", e.target.value)}
                          className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 transition-all pl-10 pr-4 py-2.5 appearance-none"
                        >
                          <option value="games">Games</option>
                          <option value="voucher">Voucher</option>
                          <option value="e-money">E-Money</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VARIANTS */}
            <div className="space-y-4 border-t border-gray-800 pt-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Product Variants</h3>
                  <p className="text-xs text-gray-600 mt-1">Manage items and their prices.</p>
                </div>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">{items.length} Items</span>
              </div>
              
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.internalId} className="grid grid-cols-12 gap-4 items-start bg-gray-900/30 p-3 rounded-xl border border-gray-800/50 hover:border-blue-500/30">
                    <div className="col-span-7">
                      <Input required placeholder="Item Amount (e.g. 100)" value={item.name} onChange={(e) => handleUpdateItem(item.internalId, "name", e.target.value)} leftIcon={<Package size={14} />} />
                    </div>
                    <div className="col-span-4">
                      <Input required type="number" placeholder="0" min="0" value={item.price === 0 ? "" : item.price} onChange={(e) => handleUpdateItem(item.internalId, "price", Number(e.target.value))} leftIcon={<span className="text-xs font-bold font-sans">Rp</span>} />
                    </div>
                    <div className="col-span-1 flex justify-center pt-1">
                      <button type="button" onClick={() => handleRemoveItem(item.internalId)} className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={handleAddItem} className="w-full border border-dashed border-gray-700 rounded-xl p-3 flex items-center justify-center gap-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/5 mt-4">
                <Plus size={16} />
                <span className="text-sm font-medium">Add Another Variant</span>
              </button>
            </div>
          </div>

          <div className="p-5 border-t border-gray-800 bg-gray-900 z-20 flex justify-end items-center gap-3 shrink-0">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isUploading}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isUploading} leftIcon={isUploading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}>
              {isUploading ? "Uploading..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};