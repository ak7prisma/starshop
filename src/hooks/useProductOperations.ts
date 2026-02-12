import { useState } from "react";
import { createClient } from "@/app/utils/client";
import { useRouter } from "next/navigation";
import type { Product } from "@/datatypes/productsType";

export function useProductOperations(
  initialGames: Product[], 
  showAlert: (type: any, title: string, msg: string, onConfirm?: () => void) => void,
  closeAlert: () => void
) {
  const supabase = createClient();
  const router = useRouter();
  const [games, setGames] = useState<Product[]>(initialGames);
  const [isSaving, setIsSaving] = useState(false);

  //Delete
  const deleteProduct = async (id: number) => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('Products').delete().eq('idProduct', id);
      if (error) throw error;

      setGames((prev) => prev.filter((g) => g.idProduct !== id));
      router.refresh();
      
      closeAlert();
      setTimeout(() => showAlert("success", "Deleted!", "Product has been successfully deleted."), 300);
    } catch (error: any) {
      closeAlert();
      setTimeout(() => {
        if (error?.code === '23503') {
           showAlert("error", "Cannot Delete", "This product is used in transaction history.");
        } else {
           showAlert("error", "Delete Failed", error.message);
        }
      }, 300);
    } finally {
      setIsSaving(false);
    }
  };

  //Update
  const updateProduct = async (updatedProduct: Product) => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('Products')
        .update({
          nameProduct: updatedProduct.nameProduct,
          developer: updatedProduct.developer,
          category: updatedProduct.category,
          amount: updatedProduct.amount,
          price: updatedProduct.price,
        })
        .eq('idProduct', updatedProduct.idProduct)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Product not found.");

      setGames((prev) => prev.map((g) => g.idProduct === updatedProduct.idProduct ? updatedProduct : g));
      showAlert("success", "Updated!", "Product details updated.");
      return true; // Return success status
    } catch (error: any) {
      showAlert("error", "Update Failed", error.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  //Create
  const createProduct = async (newProduct: Omit<Product, 'idProduct'>) => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('Products').insert(newProduct).select().single();
      if (error) throw error;

      if (data?.idProduct) {
        const newId = data.idProduct;
        const generatedHref = `/Topup/${newId}`;
        await supabase.from('Products').update({ href: generatedHref }).eq('idProduct', newId);
        data.href = generatedHref;
      }

      setGames((prev) => [...prev, data]);
      showAlert("success", "Created!", "New product added to catalog.");
      return true;
    } catch (error: any) {
       showAlert("error", "Creation Failed", error.message);
       return false;
    } finally {
       setIsSaving(false);
    }
  };

  return { games, isSaving, deleteProduct, updateProduct, createProduct };
}