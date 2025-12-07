import React from 'react';
import Link from 'next/link';
import type { Product } from '@/datatypes/productsType'; 
import ButtonLinkPrimary from './ButtonLinkPrimary';

const tempUrl = "https://uteiryrjhxezentpeclo.supabase.co/storage/v1/object/public/productsIcon/";

export default function ProductCard({product} : Readonly<{product: Product}>) {
    return (
        <div className="group flex flex-col items-center">
            <Link href={product.href} className="w-full">
                <img
                    alt={product.imgAlt}
                    src={`${tempUrl}${product.imgUrl}`}
                    className="aspect-square w-full h-full rounded-lg bg-slate-600 object-cover hover:opacity-80 hover:scale-95 duration-300 xl:aspect-7/8"/>
            </Link>

            <div className="flex flex-col items-center mt-5">
                <h3 className="text-md text-slate-500">{product.developer}</h3>
                <p className="mt-1 mb-4 text-lg font-medium">{product.nameProduct}</p>
                <ButtonLinkPrimary href={product.href} label="Top Up" rounded='lg' extraclass='py-1 px-6'/>
            </div>
        </div>
    );
}