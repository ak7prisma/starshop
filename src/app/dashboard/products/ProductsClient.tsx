"use client";

import { useState } from "react";
import { Gamepad2, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ProductEditModal } from "@/components/modals/ProductEditModal";
import { NewProductModal } from "@/components/modals/NewProductModal";
import { AlertModal } from "@/components/modals/AlertModal";
import type { Product } from "@/datatypes/productsType";
import SearchBar from "../component/SearchBar";
import FilterTabs from "../component/FilterTabs";
import { categoryOptions } from "@/constant/menu";
import { ProductCard } from "../component/ProductCardDashboard";
import { useModal } from "@/hooks/useModals";
import { useAlert } from "@/hooks/useAlert";
import { useProductFilters } from "@/hooks/useProductFilter";
import { useProductOperations } from "@/hooks/useProductOperations";

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: Readonly<ProductsClientProps>) {
  
  const { isOpen: isNewModalOpen, open: openNewModal, close: closeNewModal } = useModal();
  const { alertConfig, showAlert, closeAlert } = useAlert();
  
  const { products, isSaving, deleteProduct, updateProduct, createProduct } = 
    useProductOperations(initialProducts, showAlert, closeAlert);

  const { searchTerm, setSearchTerm, activeCategory, setActiveCategory, filteredProducts } = 
    useProductFilters(products);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleDeleteRequest = (id: number) => {
    showAlert(
      "delete",
      "Delete Product?",
      "Are you sure you want to delete this product? This action cannot be undone.",
      () => deleteProduct(id)
    );
  };

  const handleSaveEdit = async (product: Product) => {
    const success = await updateProduct(product);
    if (success) setSelectedProduct(null);
  };

  const handleCreateRequest = async (product: Omit<Product, 'idProduct'>) => {
    const success = await createProduct(product);
    if (success) closeNewModal();
  };

  return (
    <div className="space-y-8 min-h-screen pb-20 relative font-sans">
      
      <AlertModal 
        {...alertConfig}
        onClose={closeAlert}
        isLoading={isSaving && alertConfig.type === 'delete'}
      />

      {selectedProduct && (
        <ProductEditModal
          selectedProduct={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={handleSaveEdit}
          isLoading={isSaving}
        />
      )}

      {isNewModalOpen && (
        <NewProductModal
          onClose={closeNewModal}
          onSave={handleCreateRequest}
          isLoading={isSaving}
        />
      )}

      <PageHeader
        title="Products Management"
        subtitle="Control your product catalog, prices, and inventory."
        extra={
          <Button
            leftIcon={<Plus size={20} />}
            className="shadow-lg shadow-blue-500/20"
            onClick={openNewModal}
          >
            Add New Product
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
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.idProduct} 
            product={product} 
            onClick={setSelectedProduct} 
            onDelete={() => handleDeleteRequest(product.idProduct)} 
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <Gamepad2 size={48} className="mx-auto mb-4" />
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
}