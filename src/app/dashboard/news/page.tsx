"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/client";
import { Plus, Newspaper } from "lucide-react";
import { NewsModal } from "@/components/modals/NewsModal";
import { PageHeader } from "@/components/ui/PageHeader";
import SearchBar from "../component/SearchBar";
import NewsCard from "../component/NewsCrad";
import type { NewsItem } from "@/datatypes/newsType";

export default function NewsPage() {
  const supabase = createClient();

  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchNews = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("News")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching news:", error);
    } else {
      setNewsList(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSave = async (formData: NewsItem) => {
    setIsSaving(true);
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("News")
          .update({
            title: formData.title,
            description: formData.description,
            imgUrl: formData.imgUrl,
            href: formData.href,
          })
          .eq("idNews", editingItem.idNews);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("News").insert([
          {
            title: formData.title,
            description: formData.description,
            imgUrl: formData.imgUrl,
            href: formData.href,
          },
        ]);

        if (error) throw error;
      }

      await fetchNews();
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      console.error("Save failed:", error.message);
      alert("Failed to save: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this news?")) return;

    try {
      const { error } = await supabase.from("News").delete().eq("idNews", id);

      if (error) throw error;

      setNewsList((prev) => prev.filter((item) => item.idNews !== id));
    } catch (error: any) {
      console.error("Delete failed:", error.message);
      alert("Gagal hapus: " + error.message);
    }
  };

  const filteredNews = newsList.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-20 text-gray-500">
          Loading contents...
        </div>
      );
    }

    if (filteredNews.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <NewsCard
              key={news.idNews}
              data={news}
              onEdit={(item) => {
                setEditingItem(item);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 opacity-50">
        <Newspaper size={48} className="mb-4" />
        <p>No news found</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 min-h-screen pb-20">
      <NewsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        initialData={editingItem}
        isSaving={isSaving}
      />

      <PageHeader
        title="News & Banner Management"
        subtitle="Manage sliders, news updates, and promo banners."
        extra={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
          >
            <Plus size={18} /> Add News
          </button>
        }
      />

      {/* Filter and Seacrh */}
      <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-xl border border-gray-800">
        <div className="w-full max-w-md">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        <div className="text-xs text-gray-500 px-4">
          Total: {filteredNews.length} Articles
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}