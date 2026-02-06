"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Save, Loader2 } from "lucide-react";
import type { NewsItem } from "@/datatypes/newsType";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/TextArea";
import { Button } from "../ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewsItem) => Promise<void>;
  initialData?: NewsItem | null;
  isSaving: boolean;
}

export function NewsModal({ isOpen, onClose, onSave, initialData, isSaving }: Readonly<Props>) {
  const [formData, setFormData] = useState<NewsItem>({
    idNews: initialData?.idNews || 0,
    title: "",
    description: "",
    imgUrl: "",
    href: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ idNews: 0, title: "", description: "", imgUrl: "", href: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">
            {initialData ? "Edit News" : "Create New Article"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Image Preview */}
          <div className="relative w-full h-40 bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-center overflow-hidden group">
            {formData.imgUrl ? (
              <img 
                src={formData.imgUrl} 
                alt="Preview" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            ) : (
              <div className="flex flex-col items-center text-gray-600">
                <ImageIcon size={32} className="mb-2" />
                <span className="text-xs">Image Preview</span>
              </div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-3">
            <Input 
              type="text"
              required
              label="News Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Update Patch Note 1.0"
              className="w-full"
            />

            <Input
              type="text"
              required
              label="Image URL"
              value={formData.imgUrl}
              onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
              placeholder="https://..."
              className="w-full"
            />

            <Input
              type="text"
              required
              label="Target Link (Href)"
              value={formData.href}
              onChange={(e) => setFormData({ ...formData, href: e.target.value })}
              placeholder="/promo/lebaran or https://google.com"
              className="w-full"
            />

            <Textarea
              required
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short summary of the news..."
              className="w-full"
            />

          </form>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/50">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isSaving}
            >
                Cancel
            </Button>

            <Button
              variant="primary"
              onClick={() => onSave(formData)}
              disabled={isSaving || !formData.title}
              leftIcon={isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
            >
                Save Change
            </Button>
        </div>
      </div>
    </div>
  );
}