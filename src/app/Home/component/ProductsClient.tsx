"use client";

import React, { useMemo } from 'react';
import { Product } from '@/datatypes/productsType';
import ProductCard from '@/components/ui/ProductCard';
import { useProductFilters } from '@/hooks/useProductFilter';
import { getCategories } from '@/app/utils/getcategory';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/components/animations/variants';

interface ProductClientProps {
    productCategory: Product[];
}

export default function ProductClient({ productCategory }: Readonly<ProductClientProps>) {
    const {
        activeCategory,
        setActiveCategory,
        filteredProducts
    } = useProductFilters(productCategory);

    const categories = useMemo(() => getCategories(productCategory), [productCategory]);

    return (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <motion.h2
                variants={fadeIn('up', 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-3xl font-bold tracking-widest text-white mb-10 text-center"
            >
                Products
            </motion.h2>

            <motion.div
                variants={fadeIn('up', 0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="mb-10 flex flex-wrap justify-center gap-3"
            >
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`
                            px-6 py-2 rounded-full font-medium transition 
                            ${activeCategory === category
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-slate-700 text-slate-200 hover:bg-indigo-500 hover:text-white'
                            }
                        `}
                    >
                        {category}
                    </button>
                ))}
            </motion.div>

            <motion.div
                variants={staggerContainer(0.1, 0)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8"
            >
                <AnimatePresence>
                    {filteredProducts.map((product: Product) => (
                        <motion.div
                            key={product.idProduct}
                            variants={fadeIn('up', 0)}
                            layout
                            initial="hidden"
                            animate="show"
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
                <p className="text-center text-slate-400 mt-10">
                    Tidak ada produk ditemukan di kategori {activeCategory}.
                </p>
            )}
        </div>
    );
}