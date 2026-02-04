import { Gamepad2, Zap, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/datatypes/productsType";
import { producticon } from "@/constant/tempurl";

interface ProductCardProps {
  game: Product;
  onClick: (game: Product) => void;
}

export const ProductCard = ({ game, onClick }: ProductCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick(game)}
      className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group hover:border-blue-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 cursor-pointer relative outline-none focus:ring-2 focus:ring-blue-500 w-full text-left flex flex-col"
      aria-label={`Manage ${game.nameProduct}`}
    >
      <div className="h-40 w-full bg-gray-800 relative flex items-center justify-center overflow-hidden shrink-0">
        {game.imgUrl ? (
          <img
            src={`${producticon}${game.imgUrl}`}
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

      <div className="p-4 border-t border-gray-800 flex justify-between items-center bg-gray-900 w-full mt-auto">
        <Badge variant="success">
          <Zap size={10} fill="currentColor" />
          Active
        </Badge>

        <div className="text-xs font-medium text-gray-500 group-hover:text-blue-400 transition-colors flex items-center gap-1">
          Manage <ChevronRight size={12} />
        </div>
      </div>
    </button>
  );
};