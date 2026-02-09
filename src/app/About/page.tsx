"use client";

import Image from "next/image";
import ServiceItem from "./component/ServiceItem";
import Link from "next/link";
import { socialLinks } from "@/constant/socialdata";
import { serviceData, storeData } from "@/constant";

export default function About() {

    const socialMediaClass="bg-[#1e293b] hover:bg-indigo-700 hover:scale-120 duration-300 p-2 rounded";

    return (
        <main className="flex flex-col w-full pt-35 md:pt-45 pb-15 text-white">

            <section className="max-w-5xl mx-auto px-5">
                <div className="bg-[#243867]/20 rounded-lg p-8 md:p-12">
                    <header className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold">About Starshop</h1>
                        <p className="text-slate-300 mt-2">{storeData.tagline}</p>
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
                            <p className="text-sm text-slate-300 mb-4">{storeData.tagline2}</p>

                            <div className="flex space-x-3">
                                {socialLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href} 
                                        className={socialMediaClass}
                                    >
                                        {<link.icon size={20}/>}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <section className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Tentang Toko</h3>
                                <p className="text-slate-300 leading-relaxed">
                                   {storeData.description}
                                </p>
                            </section>

                            <section className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Layanan</h3>
                                <div className="flex flex-col gap-2 text-slate-300">
                                    {serviceData.map((data) => (
                                        <ServiceItem key={data} text={data}/>
                                        )
                                    )}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold mb-2">Kontak</h3>
                                <ul className="mt-3 text-slate-300 space-y-1">
                                    {socialLinks.map((data) => (
                                        <li key={data.href}>{data.label}: 
                                            <Link 
                                                className="text-indigo-400 hover:text-indigo-600 duration-300" 
                                                href={data.href}>
                                                    {data.value}
                                            </Link>
                                        </li>
                                    )
                                )}
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