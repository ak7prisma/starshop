import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/client';
import type { TopupData } from '@/datatypes/TopupData';

export const useDashboardStats = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<TopupData[]>([]);
    const [productCount, setProductCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [topGames, setTopGames] = useState<{ name: string; count: number; revenue: number }[]>([]);

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const { data: topupData, error: topupError } = await supabase
                    .from('topup')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(100);

                if (topupError) throw topupError;

                const { count: prodCount, error: prodError } = await supabase
                    .from('Products')
                    .select('*', { count: 'exact', head: true });

                if (prodError) throw prodError;

                if (topupData) {
                    // @ts-ignore - Supabase type mismatch might occur between generated types and custom interface
                    setTransactions(topupData);

                    const revenue = topupData
                        .filter((t) => t.status === 'success')
                        .reduce((acc, curr) => acc + Number(curr.price), 0);
                    setTotalRevenue(revenue);

                    const pending = topupData.filter((t) => t.status === 'pending').length;
                    setPendingCount(pending);

                    const success = topupData.filter((t) => t.status === 'success').length;
                    setSuccessCount(success);

                    const gameSales: Record<string, { count: number; revenue: number }> = {};
                    topupData.forEach((t) => {
                        if (t.status === 'success') {
                            if (!gameSales[t.idGame]) {
                                gameSales[t.idGame] = { count: 0, revenue: 0 };
                            }
                            gameSales[t.idGame].count += 1;
                            gameSales[t.idGame].revenue += Number(t.price);
                        }
                    });

                    const sortedGames = Object.entries(gameSales)
                        .map(([name, stats]) => ({ name, ...stats }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 3);

                    setTopGames(sortedGames);
                }

                if (prodCount !== null) setProductCount(prodCount);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        isLoading,
        transactions,
        productCount,
        totalRevenue,
        pendingCount,
        successCount,
        topGames
    };
};
