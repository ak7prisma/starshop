"use client";

import { useState, useMemo } from "react";
import { Plus, Newspaper } from "lucide-react";
import { NewsModal } from "@/components/modals/NewsModal";
import { AlertModal } from "@/components/modals/AlertModal";
import { PageHeader } from "@/components/ui/PageHeader";
import SearchBar from "../component/SearchBar";
import NewsCard from "../component/NewsCrad";
import { Button } from "@/components/ui/Button";
import { useModal } from "@/hooks/useModals";
import { useNewsOperations } from "@/hooks/useNewsOperations";
import { useAlert } from "@/hooks/useAlert";
import type { NewsItem } from "@/datatypes/newsType";

export default function NewsPage() {

  const { isOpen: isFormOpen, open: openForm, close: closeForm } = useModal();
  const { alertConfig, showAlert, closeAlert } = useAlert();
  
  const { newsList, isLoading, isSaving, saveNews, deleteNews } = 
    useNewsOperations(showAlert, closeAlert);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  const filteredNews = useMemo(() => {
    return newsList.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [newsList, searchTerm]);

  const handleEditClick = (item: NewsItem) => {
    setEditingItem(item);
    openForm();
  };

  const handleAddClick = () => {
    setEditingItem(null);
    openForm();
  };

  const handleSaveSubmit = async (formData: NewsItem) => {
    const success = await saveNews(formData, editingItem?.idNews);
    if (success) {
      closeForm();
      setEditingItem(null);
    }
  };

  const handleDeleteRequest = (id: number) => {
    showAlert(
      "delete",
      "Delete News?",
      "Are you sure you want to delete this news? This action cannot be undone.",
      () => deleteNews(id)
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-20 text-gray-500 animate-pulse">
          Loading news content...
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
              onEdit={handleEditClick}
              onDelete={handleDeleteRequest}
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
      
      <AlertModal
        {...alertConfig}
        onClose={closeAlert}
        isLoading={isSaving && alertConfig.type === 'delete'}
      />

      <NewsModal
        isOpen={isFormOpen}
        onClose={() => {
          closeForm();
          setEditingItem(null);
        }}
        onSave={handleSaveSubmit}
        initialData={editingItem}
        isSaving={isSaving}
      />

      <PageHeader
        title="News & Banner Management"
        subtitle="Manage sliders, news updates, and promo banners."
        extra={
            <Button
              variant="primary"
              onClick={handleAddClick}
              leftIcon={<Plus size={18} />}
            >
              Add News
            </Button>
        }
      />

      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-900/50 p-3 rounded-xl border border-gray-800 gap-4">
        <div className="w-full max-w-md">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm}
            placeholder="Search by title or description..."
          />
        </div>
        <div className="text-xs text-gray-500 px-4 whitespace-nowrap">
          Total: {filteredNews.length} Articles
        </div>
      </div>

      {renderContent()}
    </div>
  );
}