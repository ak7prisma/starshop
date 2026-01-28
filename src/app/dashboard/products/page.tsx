"use client";

import { useState } from "react";
import {
  Gamepad2, Plus, ChevronRight, Zap, Power, Search
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ProductEditModal } from "@/components/organisms/ProductEditModal";

type GameItem = {
  id: number;
  name: string;
  code: string;
  price: number;
  originalPrice: number;
  isActive: boolean;
};

type GameProduct = {
  id: number;
  name: string;
  publisher: string;
  category: string;
  status: "active" | "maintenance" | "inactive";
  imageColor: string;
  items: GameItem[];
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedGame, setSelectedGame] = useState<GameProduct | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [games, setGames] = useState<GameProduct[]>([
    {
      id: 1,
      name: "Mobile Legends",
      publisher: "Moonton",
      category: "MOBA",
      status: "active",
      imageColor: "bg-blue-600",
      items: [
        { id: 101, name: "Weekly Diamond Pass", code: "ML-WDP", price: 28000, originalPrice: 25000, isActive: true },
        { id: 102, name: "86 Diamonds", code: "ML-86", price: 20000, originalPrice: 18500, isActive: true },
      ]
    },
    {
      id: 2,
      name: "Valorant",
      publisher: "Riot Games",
      category: "FPS",
      status: "active",
      imageColor: "bg-red-500",
      items: [
        { id: 201, name: "125 Points", code: "VAL-125", price: 15000, originalPrice: 13000, isActive: true },
      ]
    },
  ]);

  const categories = ["All", "MOBA", "FPS", "RPG", "Battle Royale"];

  const handleAddItem = () => {
    if (!selectedGame) return;
    const newItem: GameItem = {
      id: Date.now(),
      name: "",
      code: "",
      price: 0,
      originalPrice: 0,
      isActive: true
    };
    setSelectedGame({
      ...selectedGame,
      items: [...selectedGame.items, newItem]
    });
  };

  const handleRemoveItem = (itemId: number) => {
    if (!selectedGame) return;
    const updatedItems = selectedGame.items.filter(item => item.id !== itemId);
    setSelectedGame({ ...selectedGame, items: updatedItems });
  };

  const handleUpdateItem = (itemId: number, field: keyof GameItem, value: any) => {
    if (!selectedGame) return;
    const updatedItems = selectedGame.items.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    setSelectedGame({ ...selectedGame, items: updatedItems });
  };

  const handleSaveChanges = () => {
    if (!selectedGame) return;
    const updatedGames = games.map(g => g.id === selectedGame.id ? selectedGame : g);
    setGames(updatedGames);
    setSelectedGame(null);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "maintenance": return "warning";
      case "inactive": return "default";
      default: return "default";
    }
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || game.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 min-h-screen pb-20 relative font-sans">

      {selectedGame && (
        <ProductEditModal
          selectedGame={selectedGame}
          onClose={() => setSelectedGame(null)}
          onSave={handleSaveChanges}
          onUpdateItem={handleUpdateItem}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          deleteConfirmId={deleteConfirmId}
          setDeleteConfirmId={setDeleteConfirmId}
        />
      )}

      <PageHeader
        title="Products Management"
        subtitle="Control your game catalog, prices, and inventory."
        extra={
          <Button leftIcon={<Plus size={20} />} className="shadow-lg shadow-blue-500/20">
            Add New Game
          </Button>
        }
      />

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-2 flex gap-4 items-center justify-between">
        <div className="flex gap-2 p-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat ? "bg-gray-800 text-white shadow" : "text-gray-400 hover:text-white"}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="w-80 mr-2">
          <Input
            leftIcon={<Search size={18} />}
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-950 border-gray-800 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => setSelectedGame(game)}
            className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group hover:border-blue-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 cursor-pointer relative"
          >
            <div className={`h-40 w-full ${game.imageColor} relative flex items-center justify-center`}>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-90" />
              <Gamepad2 size={48} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">{game.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-400 bg-black/30 px-2 py-0.5 rounded border border-white/10">{game.category}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 flex justify-between items-center bg-gray-900">
              <Badge variant={getStatusVariant(game.status)}>
                {game.status === 'active' ? <Zap size={10} fill="currentColor" /> : <Power size={10} />}
                {game.status}
              </Badge>

              <div className="text-xs font-medium text-gray-500 group-hover:text-blue-400 transition-colors flex items-center gap-1">
                Manage <ChevronRight size={12} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}