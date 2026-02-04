import { useState, useCallback } from "react";
import { Product } from "@/datatypes/productsType";
import { createClient } from "@/app/utils/client";
import { producticon } from "@/constant/tempurl";

const BUCKET_NAME = "productsIcon";

type GameItem = { 
  internalId: number; 
  name: string; 
  price: number 
};

export const useProductForm = (onSaveSuccess?: (data: Omit<Product, 'idProduct'>) => void) => {
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    nameProduct: "",
    developer: "",
    category: "Games",
    itemName: "",
  });

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [sideFile, setSideFile] = useState<File | null>(null);
  const [sidePreview, setSidePreview] = useState<string>("");

  const [items, setItems] = useState<GameItem[]>([
    { internalId: Date.now(), name: "", price: 0 }
  ]);

  const updateField = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setFile = (type: 'icon' | 'side', file: File) => {
    const preview = URL.createObjectURL(file);
    if (type === 'icon') {
      setIconFile(file);
      setIconPreview(preview);
    } else {
      setSideFile(file);
      setSidePreview(preview);
    }
  };

  const removeFile = (type: 'icon' | 'side') => {
    if (type === 'icon') {
      setIconFile(null);
      setIconPreview("");
    } else {
      setSideFile(null);
      setSidePreview("");
    }
  };

  const addItem = () => setItems([...items, { internalId: Date.now(), name: "", price: 0 }]);
  
  const removeItem = (id: number) => {
    if (items.length === 1) return alert("Minimal harus ada 1 varian!");
    setItems(items.filter((i) => i.internalId !== id));
  };

  const updateItem = (id: number, field: keyof GameItem, value: any) => {
    setItems(prev => prev.map(item => item.internalId === id ? { ...item, [field]: value } : item));
  };

  const submitForm = async () => {
    if (!iconFile) return alert("Wajib upload icon produk!");
    const validItems = items.filter(i => i.name.trim() !== "");
    if (validItems.length === 0) return alert("Mohon isi minimal satu varian produk.");

    setIsUploading(true);

    try {
      const iconExt = iconFile.name.split('.').pop();
      const iconName = `icon_${Date.now()}.${iconExt}`;
      const { error: err1 } = await supabase.storage.from(BUCKET_NAME).upload(iconName, iconFile);
      if (err1) throw err1;
      const iconPath = `${formData.category}/${iconName}`;

      let sidePath = "";
      if (sideFile) {
        const sideExt = sideFile.name.split('.').pop();
        const sideName = `side_${Date.now()}.${sideExt}`;
        const { error: err2 } = await supabase.storage.from(BUCKET_NAME).upload(sideName, sideFile);
        if (err2) throw err2;
        sidePath = `${formData.category}/${sideName}`;
      }

      const payload: Omit<Product, 'idProduct'> = {
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

      if (onSaveSuccess) {
        onSaveSuccess(payload);
      }

    } catch (error: any) {
      console.error("Upload Error:", error);
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const setInitialData = useCallback((product: Product) => {
        setFormData({
            nameProduct: product.nameProduct,
            developer: product.developer,
            category: product.category,
            imgUrl: product.imgUrl,
            sideImgUrl: product.sideImgUrl
        });

        if (product.imgUrl) setIconPreview(`${producticon}${product.imgUrl}`);
        if (product.sideImgUrl) setSidePreview(`${producticon}${product.sideImgUrl}`);

        if (product.amount && product.price) {
            const mappedItems = product.amount.map((amt, index) => ({
                internalId: Date.now() + index,
                name: amt,
                price: product.price ? product.price[index] : 0
            }));
            setItems(mappedItems);
        }
    }, []);

    const getSubmitData = (): Product => {
        return {
            ...formData,
            amount: items.map(i => i.name),
            price: items.map(i => i.price),
        } as Product;
    }

  return {
    formData,
    updateField,
    items,
    addItem,
    removeItem,
    updateItem,
    iconPreview,
    sidePreview,
    setFile,
    removeFile,
    setInitialData,
    getSubmitData,
    isUploading,
    submitForm
  };
};