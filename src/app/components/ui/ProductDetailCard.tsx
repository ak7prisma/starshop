import type { Product } from '@/datatypes/productsType'; 

export default function ProductDetailCard({product} : Readonly<{product: Product}>) {
    return (
        <div className="lg:w-1/3 p-6 bg-[#181B2B] rounded-2xl shadow-xl border border-[#2D3142] h-fit">
            <h2 className="text-2xl font-bold mb-4 text-white border-b border-[#2D3142] pb-3">{product.nameProduct}</h2>

            <div className="bg-[#2D3142] h-40 rounded-xl overflow-hidden mb-5 border border-slate-500/50">
                <img src={product.sideImgUrl} alt={product.sideImgAlt} className='w-full h-full object-cover'/>
            </div>

            <p className="text-gray-300 mb-4 leading-relaxed">
                Top up {product.nameProduct} secara cepat dan aman. Proses ini memerlukan langkah pengisian ID Game, pemilihan nominal serta verifikasi pembayaran.
            </p>
            <p className="text-sm text-indigo-400 italic font-medium">
                Penting: Pastikan ID Game yang dimasukkan sudah benar untuk menghindari kesalahan pengisian.
            </p>
        </div>
    );
}