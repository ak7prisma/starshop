import { supabase } from "@/app/lib/supabase";
import ProductClient from "./ProductsClient";

export default async function Products() {

    const {data: products, error} = await supabase
        .from('Products')
        .select('*');

    if (error) {
        return (
            <div className="text-slate-50 p-10">
                <p>{error.message}</p>
            </div>
        )
    }

    return (
        <div id="top-up-section" className="text-slate-50 min-h-screen pt-20"> 
            <ProductClient productCategory={products || []} />
        </div>
    )
}