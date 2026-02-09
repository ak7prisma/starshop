"use client";

import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { X, Save, Plus, Loader2, Gamepad2, User, Gem, LayoutGrid, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Product } from "@/datatypes/productsType";
import SelectDropdown from "../ui/DropdownMenu";
import ImageUploader from "@/components/ui/ImageUploader";
import { useProductForm } from "@/hooks/useProductForm";
import { categoryOptions } from "@/constant/menu";

interface NewProductModalProps {
  onClose: () => void;
  onSave: (newProduct: Omit<Product, 'idProduct'>) => void;
  isLoading: boolean;
}

export const NewProductModal = ({ onClose, onSave, isLoading }: NewProductModalProps) => {
  const {
    formData, updateField,
    items, addItem, removeItem, updateItem,
    iconPreview, sidePreview, setFile,
    isUploading, submitForm
  } = useProductForm(onSave);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <Modal
      show={true}
      onClose={onClose}
      position="center"
      popup
      size="5xl"
      theme={{
        root: {
          base: "fixed inset-0 z-50 h-full overflow-y-auto overflow-x-hidden p-4 md:inset-0 h-modal md:h-full backdrop-blur-md bg-black/80",
          show: {
            on: "flex bg-black/80",
            off: "hidden",
          },
        },
        content: {
          base: "relative h-full w-full p-0 md:h-auto",
          inner: "relative rounded-2xl bg-[#0B1120] border border-gray-800 shadow-2xl flex flex-col max-h-[90vh] w-full mx-auto"
        }
      }}
    >
      {/* Header */}
      <ModalHeader className="border-b border-gray-800 bg-gray-900/50 p-6 rounded-t-2xl">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New Product</h2>
              <p className="text-xs text-gray-400">Fill in details and upload assets.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
      </ModalHeader>

      {/* Form */}
      <ModalBody className="p-0 overflow-hidden flex flex-col rounded-b-2xl bg-[#0B1120]">
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Image Upload */}
              <div className="md:col-span-4 space-y-6">
                <ImageUploader 
                  label="Icon" 
                  variant="square" 
                  required 
                  previewUrl={iconPreview} 
                  onFileSelect={(f) => setFile('icon', f)} 
                />
                <ImageUploader 
                  label="Banner (Optional)" 
                  variant="banner" 
                  previewUrl={sidePreview} 
                  onFileSelect={(f) => setFile('side', f)} 
                />
              </div>

              {/* Details */}
              <div className="md:col-span-8 space-y-5">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-800 pb-2">Basic Details</h3>
                
                <div className="space-y-4">
                  <Input 
                    required label="Product Name" placeholder="e.g. Mobile Legends"
                    value={formData.nameProduct}
                    onChange={(e) => updateField("nameProduct", e.target.value)}
                    leftIcon={<Gamepad2 size={16} />} 
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      required label="Developer" placeholder="e.g. Moonton" 
                      value={formData.developer} 
                      onChange={(e) => updateField("developer", e.target.value)} 
                      leftIcon={<User size={16} />} 
                    />
                    <Input 
                      required label="Items Name" placeholder="e.g. Diamonds" 
                      value={formData.itemName} 
                      onChange={(e) => updateField("itemName", e.target.value)} 
                      leftIcon={<Gem size={16} />} 
                    />
                  </div>

                  <SelectDropdown 
                    label="Category"
                    icon={<LayoutGrid size={16} />}
                    value={formData.category || "Games"}
                    options={categoryOptions}
                    onChange={(val: any) => updateField("category", val)}
                  />
                </div>
              </div>
            </div>

            {/* Variants Section */}
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
                      <Input 
                        required type="number" placeholder="Item Amount (e.g. 100)" 
                        value={item.name} 
                        onChange={(e) => updateItem(item.internalId, "name", e.target.value)} 
                        leftIcon={<Package size={14} />} 
                      />
                    </div>
                    <div className="col-span-4">
                      <Input 
                        required type="number" placeholder="0" min="0" 
                        value={item.price === 0 ? "" : item.price} 
                        onChange={(e) => updateItem(item.internalId, "price", Number(e.target.value))} 
                        leftIcon={<span className="text-xs font-bold font-sans">Rp</span>} 
                      />
                    </div>
                    <div className="col-span-1 flex justify-center pt-1">
                      <button type="button" onClick={() => removeItem(item.internalId)} className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={addItem} className="w-full border border-dashed border-gray-700 rounded-xl p-3 flex items-center justify-center gap-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/5 mt-4">
                <Plus size={16} />
                <span className="text-sm font-medium">Add Another Variant</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-800 bg-gray-900 z-20 flex justify-end items-center gap-3 shrink-0">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isUploading}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={isUploading} leftIcon={isUploading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}>
              {isUploading ? "Uploading..." : "Create Product"}
            </Button>
          </div>

        </form>
      </ModalBody>
    </Modal>
  );
};