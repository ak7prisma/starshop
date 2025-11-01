import { supabase } from "@/app/lib/supabase";
import PromoClient from "./PromoClient";
import { Product } from "@/datatypes/productsType";

export default async function Promosection() {

    const {data: products, error} = await supabase.from('Products').select('*');

    if (error) {
        return (
            <div className="text-slate-50 p-10">
                <p>{error.message}</p>
            </div>
        )
    }

    const getPromoProducts = (allProducts: Product[]): Product[] => {
    const promoId = new Set([1, 2, 4, 8, 9]);
    return allProducts.filter(p => promoId.has(p.idProduct));
    };

    const promoProducts = getPromoProducts(products as Product[] || []);

    return (
        <div id="promo-section" className="text-slate-50"> 
             <PromoClient promoProduct={promoProducts}/>
        </div>
    )
}