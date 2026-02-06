"use client";

import { ExternalLink, Calendar, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { NewsItem } from "@/datatypes/newsType";

interface NewsCardProps {
  data: NewsItem;
  onEdit: (item: NewsItem) => void;
  onDelete: (id: number) => void;
}

export default function NewsCard({ data, onEdit, onDelete }: Readonly<NewsCardProps>) {
  return (
    <div className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all flex flex-col h-full">
      
      {/* Image */}
      <div className="relative h-48 bg-gray-950 overflow-hidden">
        <img
          src={data.imgUrl || "/placeholder.png"}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent" />

        {/* Badge */}
        <Badge variant="purple" className="absolute bottom-0 left-3 px-2 py-1">
          ID: {data.idNews}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-blue-400 transition-colors">
            {data.title || "No Title"}
          </h3>
          {data.href && (
            <a
              href={data.href}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-blue-400"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
          {data.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={12} />
            {data.created_at
              ? new Date(data.created_at).toLocaleDateString()
              : "-"}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(data)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600 hover:text-white text-gray-400 transition-all"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => data.idNews && onDelete(data.idNews)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-red-600 hover:text-white text-gray-400 transition-all"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}