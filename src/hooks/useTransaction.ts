import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/app/utils/client";
import { TopupData } from "@/datatypes/TopupData";

export function useTransactions(activeTab: string) {
  const [transactions, setTransactions] = useState<(TopupData & { products: { nameProduct: string } })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('topup')
        .select(`
          *,
          products:idProduct (nameProduct)
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      let result = data || [];
      if (activeTab !== "All") {
        result = result.filter(t => t.status?.toLowerCase() === activeTab.toLowerCase());
      }
      setTransactions(result as any);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, supabase]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, isLoading, fetchTransactions, setTransactions };
}