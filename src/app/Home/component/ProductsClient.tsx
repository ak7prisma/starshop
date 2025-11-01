"use client";
import React, { useState, useMemo } from 'react';
import { Product } from '@/datatypes/productsType';
import ProductCard from '@/app/components/ui/ProductCard';

const getCategories = (products: Product[]): string[] => {
    return ["All", ...new Set(products.map(p => p.category))];
};

interface ProductClientProps {
    productCategory: Product[];
}

export default function ProductClient({ productCategory }: Readonly<ProductClientProps>) {
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = useMemo(() => getCategories(productCategory), [productCategory]);

    const filteredProducts = useMemo(() => {
        if (activeCategory === "All") {
            return productCategory;
        }

        return productCategory.filter(product => product.category === activeCategory);
    }, [activeCategory, productCategory]);

    return (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"> 
            
            <h2 className="text-3xl font-bold tracking-widest text-white mb-10 text-center">
                Products
            </h2>

            <div className="mb-10 flex flex-wrap justify-center gap-3">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={
                            `px-6 py-2 rounded-full font-medium transition ${activeCategory === category ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-700 text-slate-200 hover:bg-indigo-500 hover:text-white'}`
                        }>
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.idProduct} product={product} />
                ))}
            </div>
            
            {filteredProducts.length === 0 && (
                <p className="text-center text-slate-400 mt-10">
                    Tidak ada produk ditemukan di kategori {activeCategory};.
                </p>
            )}
        </div>
    );
}
