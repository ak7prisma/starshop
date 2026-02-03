"use client";

import { useState, useMemo } from "react";
import {
  Gamepad2, Plus, ChevronRight, Zap
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductEditModal } from "@/components/modals/ProductEditModal";
import { NewProductModal } from "@/components/modals/NewProductModal";
import type { Product } from "@/datatypes/productsType";
import { createClient } from "@/app/utils/client";
import SearchBar from "../component/SearchBar";
import { useRouter } from "next/navigation";

const tempUrl = "https://uteiryrjhxezentpeclo.supabase.co/storage/v1/object/public/productsIcon/";

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

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-2 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 p-2 overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat
                ? "bg-gray-800 text-white shadow ring-1 ring-gray-700"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <button
            key={game.idProduct}
            type="button"
            onClick={() => setSelectedGame(game)}
            className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group hover:border-blue-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 cursor-pointer relative outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Manage ${game.nameProduct}`}
            style={{ padding: 0, textAlign: "inherit" }}
          >
            <div className={`h-40 w-full bg-gray-800 relative flex items-center justify-center overflow-hidden`}>
              {game.imgUrl ? (
                <img
                  src={`${tempUrl}${game.imgUrl}`}
                  alt={game.nameProduct}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-linear-to-t from-gray-900 to-transparent opacity-90" />
                  <Gamepad2 size={48} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
                </>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-gray-900 via-gray-900/80 to-transparent">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate drop-shadow-md">
                  {game.nameProduct}
                </h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-300 bg-gray-800/80 px-2 py-0.5 rounded border border-white/10">
                    {game.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 flex justify-between items-center bg-gray-900">
              <Badge variant="success">
                <Zap size={10} fill="currentColor" />
                Active
              </Badge>

              <div className="text-xs font-medium text-gray-500 group-hover:text-blue-400 transition-colors flex items-center gap-1">
                Manage <ChevronRight size={12} />
              </div>
            </div>
          </button>
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