import { supabase } from "@/app/lib/supabase";
import NewsCarousel from "./NewsCarousel";
import { NewsItem } from "@/datatypes/newsType";

export default async function News() {
    
    const { data: newsData, error } = await supabase
        .from('News')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching news:", error);
        return (
             <div className="h-55 md:h-100 w-full flex items-center justify-center bg-gray-800 rounded-lg text-gray-500">
                Failed to load news
            </div>
        );
    }

    const newsList = newsData as NewsItem[];

    return (
        <NewsCarousel newsList={newsList} />
    );
}