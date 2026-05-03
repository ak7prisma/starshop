"use client";

import { Product } from "@/datatypes/productsType"
import ProductCard from "@/components/ui/ProductCard";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/animations/variants";

interface PromoCardProps {
    promoProduct: Product[];
}

export default function PromoClient({ promoProduct }: Readonly<PromoCardProps>){
    return(
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <h2 className="text-3xl font-bold tracking-widest text-white mb-10 text-center">
                Best Seller
            </h2>
    
            <motion.div 
                variants={staggerContainer(0.1, 0)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8"
            >
                {promoProduct.map((product) => (
                    <motion.div key={product.idProduct} variants={fadeIn('up', 0)}>
                        <ProductCard 
                            product={product} 
                        /> 
                    </motion.div>
                ))}
            </motion.div>
                
        </div>
    );
}