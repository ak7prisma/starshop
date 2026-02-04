"use client";

import { useState, useMemo } from "react";
import { Gamepad2, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ProductEditModal } from "@/components/modals/ProductEditModal";
import { NewProductModal } from "@/components/modals/NewProductModal";
import type { Product } from "@/datatypes/productsType";
import { createClient } from "@/app/utils/client";
import SearchBar from "../component/SearchBar";
import { useRouter } from "next/navigation";
import FilterTabs from "../component/FilterTabs";
import { CATEGORY_OPTIONS } from "@/constant/menu";
import { ProductCard } from "../component/ProductCardDashboard";

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
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEdit = async (updatedProduct: Product) => {
    setIsSaving(true);
    console.log("=== MULAI UPDATE ===");
    console.log("ID Product:", updatedProduct.idProduct, typeof updatedProduct.idProduct);
    console.log("Data Update:", updatedProduct);

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

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn("UPDATE BERHASIL TAPI TIDAK ADA DATA BERUBAH.");
        console.warn("Cek: 1. Apakah ID benar ada? 2. Cek RLS Policies di Supabase.");
        alert("Update gagal: Data tidak ditemukan atau izin ditolak (RLS).");
        return;
      }

      console.log("Update Sukses di DB:", data);

      setGames((prevGames) =>
        prevGames.map((game) =>
          game.idProduct === updatedProduct.idProduct ? updatedProduct : game
        )
      );

      setSelectedGame(null);

    } catch (error: any) {
      console.error("CRITICAL ERROR:", error);
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

const handleCreateProduct = async (newProduct: Omit<Product, 'idProduct'>) => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('Products')
        .insert(newProduct)
        .select()
        .single();

      if (error) throw error;

      if (data?.idProduct) {
        const newId = data.idProduct;
        const generatedHref = `/Topup/${newId}`;

        const { error: updateError } = await supabase
          .from('Products')
          .update({ href: generatedHref })
          .eq('idProduct', newId);

        if (updateError) throw updateError;
        
        console.log("Product Created & Href Updated:", generatedHref);
      }

      setShowNewProductModal(false); 
      router.refresh();

    } catch (error: any) {
       console.error("Failed create product:", error.message);
       alert("Error: " + error.message);
    } finally {
       setIsSaving(false);
    }
};

  const categories = useMemo(() => {
    const cats = new Set(games.map(g => g.category));
    return ["All", ...Array.from(cats)];
  }, [games]);

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.nameProduct.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || game.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 min-h-screen pb-20 relative font-sans">
      
      {/* Modals */}
      {selectedGame && (
        <ProductEditModal
          selectedGame={selectedGame}
          onClose={() => setSelectedGame(null)}
          onSave={handleSaveEdit}
        />
      )}

      {showNewProductModal && (
        <NewProductModal
          onClose={() => setShowNewProductModal(false)}
          onSave={handleCreateProduct}
        />
      )}

      {/* Header */}
      <PageHeader
        title="Products Management"
        subtitle="Control your game catalog, prices, and inventory."
        extra={
          <Button
            leftIcon={<Plus size={20} />}
            className="shadow-lg shadow-blue-500/20"
            onClick={() => setShowNewProductModal(true)}
          >
            Add New Game
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-2 flex flex-col md:flex-row gap-4 items-center justify-between">
        <FilterTabs 
          tabs={CATEGORY_OPTIONS.map(cat => cat.value)} 
          activeTab={activeCategory} 
          onTabChange={setActiveCategory} 
        />
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <ProductCard 
            key={game.idProduct} 
            game={game} 
            onClick={setSelectedGame} 
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredGames.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <Gamepad2 size={48} className="mx-auto mb-4" />
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
}