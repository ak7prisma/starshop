import { Product } from "@/datatypes/productsType"
import ProductCard from "@/components/ui/ProductCard";

interface PromoCardProps {
    promoProduct: Product[];
}

export default function PromoClient({ promoProduct }: Readonly<PromoCardProps>){
    return(
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <h2 className="text-3xl font-bold tracking-widest text-white mb-10 text-center">
                Best Seller
            </h2>
    
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
                {promoProduct.map((product) => (
                    <ProductCard 
                        key={product.idProduct} 
                        product={product} 
                    /> 
                ))}
            </div>
                
        </div>
    );
}