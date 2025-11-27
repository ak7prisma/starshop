import React from 'react';
import Link from 'next/link';
import type { Product } from '@/datatypes/productsType'; 

export default function ProductCard({product} : Readonly<{product: Product}>) {
    return (
        <div className="group flex flex-col items-center">
            <Link href={product.href} className="w-full">
                <img
                    alt={product.imgAlt}
                    src={product.imgUrl}
                    className="aspect-square w-full h-full rounded-lg bg-slate-600 object-cover hover:opacity-80 hover:scale-95 duration-300 xl:aspect-7/8"/>
            </Link>

            <div className="flex flex-col items-center mt-5">
                <h3 className="text-md text-slate-500">{product.nameProduct}</h3>
                <p className="mt-1 mb-4 text-lg font-medium">{product.developer}</p>
                <Link 
                    href={product.href} 
                    className="bg-indigo-600 hover:bg-indigo-700 px-6 py-1 w-fit rounded-md font-medium transition">
                    Top Up
                </Link>
            </div>
        </div>
    );
}