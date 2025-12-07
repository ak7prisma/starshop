"use client";

import Image from "next/image";
import { FaInstagram, FaWhatsapp, FaTiktok, FaEnvelope } from "react-icons/fa";
import ServiceItem from "./component/ServiceItem";
import Link from "next/link";

export default function About() {

    const socialMediaClass="bg-[#1e293b] hover:bg-indigo-700 hover:scale-120 duration-300 p-2 rounded";

    return (
        <main className="flex flex-col w-full pt-35 md:pt-45 pb-15 text-white">

            <section className="max-w-5xl mx-auto px-5">
                <div className="bg-[#243867]/20 rounded-lg p-8 md:p-12">
                    <header className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold">About Starshop</h1>
                        <p className="text-slate-300 mt-2">Layanan top-up game dan produk digital MURAH x TERPERCAYA.</p>
                    </header>

                    <div className="grid md:grid-cols-3 gap-6 items-start ">
                        <div className="col-span-1 flex flex-col items-center text-center p-10 bg-[#181B2B] rounded-2xl shadow-xl border border-[#2D3142]">
                            <div className="relative w-40 h-40 overflow-hidden mb-4">
                               <Image 
                                    src="/favicon.ico"
                                    alt="profile" 
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>

                            <h2 className="text-xl font-semibold">Starshop</h2>
                            <p className="text-sm text-slate-300 mb-4">Online Top-up Store — Game & Digital Products</p>

                            <div className="flex space-x-3">
                                <Link href="https://www.instagram.com/akprisma?igsh=MTJtd2lwaHZoeXFrZA==" aria-label="Instagram" className={socialMediaClass}>
                                    <FaInstagram size={18} />
                                </Link>
                                <Link href="https://wa.me/qr/424AF5XR3VZ7B1" aria-label="WhatsApp" className={socialMediaClass}>
                                    <FaWhatsapp size={18} />
                                </Link>
                                <Link href="https://www.tiktok.com/@royuciha246?_t=ZS-8v6zPNJpxJK&_r=1" aria-label="TikTok" className={socialMediaClass}>
                                    <FaTiktok size={18} />
                                </Link>
                                <Link href="mailto:ahmadkurniaprisma@gmail.com" aria-label="Email" className={socialMediaClass}>
                                    <FaEnvelope size={18} />
                                </Link>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <section className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Tentang Toko</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    Starshop menyediakan layanan top-up game dan produk digital lainnya dengan harga terjangkau dan
                                    pelayanan cepat. Kami melayani pembelian pulsa, paket data, voucher game, dan item digital untuk
                                    berbagai platform. Setelah pembayaran, pelanggan dapat mengunggah bukti bayar untuk diproses melalui
                                    sistem kami.
                                </p>
                            </section>

                            <section className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Layanan</h3>
                                <div className="flex flex-col gap-2 text-slate-300">
                                    <ServiceItem text="Top-up game (voucher & in-game currency)" />
                                    <ServiceItem text="Pulsa & Token Listrik" />
                                    <ServiceItem text="Pembayaran via transfer & upload bukti" />
                                    <ServiceItem text="Customer support via Instagram / WhatsApp" />
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold mb-2">Kontak</h3>
                                <ul className="mt-3 text-slate-300 space-y-1">
                                    <li>Email: <Link className="text-indigo-400 hover:text-indigo-600 duration-300" href="mailto:ahmadkurniaprisma@gmail.com">ahmadkurniaprisma@gmail.com</Link></li>
                                    <li>Instagram: <Link className="text-indigo-400 hover:text-indigo-600 duration-300" href="https://www.instagram.com/akprisma">@akprisma</Link></li>
                                    <li>WhatsApp: <Link className="text-indigo-400 hover:text-indigo-600 duration-300" href="https://wa.me/+628989209565">+628989209565</Link></li>
                                </ul>

                                <p className="text-slate-400 mt-4 text-sm">Proyek ini dibuat sebagai tugas pembelajaran menggunakan Next.js, Tailwind CSS, dan Supabase.</p>
                            </section>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}