import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/app/utils/client";
import type { NewsItem } from "@/datatypes/newsType";

export function useNewsOperations(
  showAlert: (type: any, title: string, msg: string, onConfirm?: () => void) => void,
  closeAlert: () => void
) {
  const supabase = createClient();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch
  const fetchNews = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const saveNews = async (formData: NewsItem, editingId?: number) => {
    setIsSaving(true);
    try {
      let error;
      
      if (editingId) {
        // Update
        const { error: updateError } = await supabase
          .from("News")
          .update({
            title: formData.title,
            description: formData.description,
            imgUrl: formData.imgUrl,
            href: formData.href,
          })
          .eq("idNews", editingId);
        error = updateError;
      } else {
        // Create
        const { error: insertError } = await supabase.from("News").insert([
          {
            title: formData.title,
            description: formData.description,
            imgUrl: formData.imgUrl,
            href: formData.href,
          },
        ]);
        error = insertError;
      }

      if (error) throw error;

      await fetchNews();
      showAlert("success", "Success", editingId ? "News updated successfully." : "News created successfully.");
      return true;

    } catch (err: any) {
      showAlert("error", "Save Failed", err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Delete
  const deleteNews = async (id: number) => {

    setIsSaving(true); 
    try {
      const { error } = await supabase.from("News").delete().eq("idNews", id);
      if (error) throw error;

      setNewsList((prev) => prev.filter((item) => item.idNews !== id));
      closeAlert();
      setTimeout(() => showAlert("success", "Deleted!", "News article removed."), 300);
      
    } catch (err: any) {
      closeAlert();
      setTimeout(() => showAlert("error", "Delete Failed", err.message), 300);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    newsList,
    isLoading,
    isSaving,
    saveNews,
    deleteNews,
    refreshNews: fetchNews
  };
}