
import { supabase } from "@/app/lib/supabase";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from('Products')
    .select('*')
    .order('idProduct', { ascending: true });

  if (error) {
    return (
      <div className="p-8 text-white">
        <h2 className="text-xl font-bold text-red-500">Error loading products</h2>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  return <ProductsClient initialProducts={products || []} />;
}