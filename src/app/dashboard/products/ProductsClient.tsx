"use client";

import { useState } from "react";
import { Gamepad2, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ProductEditModal } from "@/components/modals/ProductEditModal";
import { NewProductModal } from "@/components/modals/NewProductModal";
import { AlertModal } from "@/components/modals/AlertModal";
import type { Product } from "@/datatypes/productsType";
import { createClient } from "@/app/utils/client";
import SearchBar from "../component/SearchBar";
import { useRouter } from "next/navigation";
import FilterTabs from "../component/FilterTabs";
import { categoryOptions } from "@/constant/menu";
import { ProductCard } from "../component/ProductCardDashboard";
import { useModal } from "@/hooks/useModals";

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: Readonly<ProductsClientProps>) {
  const supabase = createClient();
  const router = useRouter();
  const [games, setGames] = useState<Product[]>(initialProducts);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedGame, setSelectedGame] = useState<Product | null>(null);
  
  const { isOpen: isModalOpen, open, close } = useModal();
  const [isSaving, setIsSaving] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "delete" | "info";
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (type: "success" | "error" | "delete" | "info", title: string, message: string, onConfirm?: () => void) => {
    setAlertConfig({ isOpen: true, type, title, message, onConfirm });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const initiateDelete = (id: number) => {
    showAlert(
      "delete",
      "Delete Product?",
      "Are you sure you want to delete this product? This action cannot be undone.",
      () => confirmDelete(id)
    );
  };

  const confirmDelete = async (id: number) => {
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

  const handleSaveEdit = async (updatedProduct: Product) => {
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
      setSelectedGame(null);
      showAlert("success", "Updated!", "Product details updated.");

    } catch (error: any) {
      showAlert("error", "Update Failed", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateProduct = async (newProduct: Omit<Product, 'idProduct'>) => {
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
      close();
      
      showAlert("success", "Created!", "New product added to catalog.");

    } catch (error: any) {
       showAlert("error", "Creation Failed", error.message);
    } finally {
       setIsSaving(false);
    }
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.nameProduct.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || game.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 min-h-screen pb-20 relative font-sans">
      
      <AlertModal 
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        isLoading={isSaving && alertConfig.type === 'delete'}
      />

      {selectedGame && (
        <ProductEditModal
          selectedGame={selectedGame}
          onClose={() => setSelectedGame(null)}
          onSave={handleSaveEdit}
          isLoading={isSaving}
        />
      )}

      {isModalOpen && (
        <NewProductModal
          onClose={() => close()}
          onSave={handleCreateProduct}
          isLoading={isSaving}
        />
      )}

      <PageHeader
        title="Products Management"
        subtitle="Control your game catalog, prices, and inventory."
        extra={
          <Button
            leftIcon={<Plus size={20} />}
            className="shadow-lg shadow-blue-500/20"
            onClick={() => open()}
          >
            Add New Game
          </Button>
        }
      />

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-2 flex flex-col md:flex-row gap-4 items-center justify-between">
        <FilterTabs 
          tabs={["All", ...categoryOptions.map(cat => cat.value)]}
          activeTab={activeCategory} 
          onTabChange={setActiveCategory} 
        />
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Search products..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <ProductCard 
            key={game.idProduct} 
            game={game} 
            onClick={setSelectedGame} 
            onDelete={() => initiateDelete(game.idProduct)} 
          />
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <Gamepad2 size={48} className="mx-auto mb-4" />
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
}