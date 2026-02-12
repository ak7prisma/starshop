import { useState, useMemo } from "react";
import type { Product } from "@/datatypes/productsType";

export function useProductFilters(initialProducts: Product[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredGames = useMemo(() => {
    return initialProducts.filter((game) => {
      const matchesSearch = game.nameProduct.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchTerm, activeCategory]);

  return {
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    filteredGames,
  };
}