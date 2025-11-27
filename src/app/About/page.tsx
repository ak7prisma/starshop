
import { FaInstagram, FaWhatsapp, FaTiktok, FaEnvelope } from "react-icons/fa";

export default function About() {
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
                            <div className="w-40 h-40 overflow-hidden mb-4">
                                <img src="favicon.ico" alt="profile" className="w-full h-full object-cover" />
                            </div>

                            <h2 className="text-xl font-semibold">Starshop</h2>
                            <p className="text-sm text-slate-300 mb-4">Online Top-up Store — Game & Digital Products</p>

                            <div className="flex space-x-3">
                                <a href="https://www.instagram.com/akprisma?igsh=MTJtd2lwaHZoeXFrZA==" aria-label="Instagram" className="bg-[#1e293b] hover:bg-indigo-700 hover:scale-120 duration-300 p-2 rounded">
                                    <FaInstagram size={18} />
                                </a>
                                <a href="https://wa.me/qr/424AF5XR3VZ7B1" aria-label="WhatsApp" className="bg-[#1e293b] hover:bg-indigo-700 hover:scale-120 duration-300 p-2 rounded">
                                    <FaWhatsapp size={18} />
                                </a>
                                <a href="https://www.tiktok.com/@royuciha246?_t=ZS-8v6zPNJpxJK&_r=1" aria-label="TikTok" className="bg-[#1e293b] hover:bg-indigo-700 hover:scale-120 duration-300 p-2 rounded">
                                    <FaTiktok size={18} />
                                </a>
                                <a href="mailto:ahmadkurniaprisma@gmail.com" aria-label="Email" className="bg-[#1e293b] hover:bg-indigo-700 hover:scale-120 duration-300 p-2 rounded">
                                    <FaEnvelope size={18} />
                                </a>
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
                                    <div className="flex items-start gap-3">
                                        <span className="font-semibold">•</span>
                                        <span>Top-up game (voucher & in-game currency)</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="font-semibold">•</span>
                                        <span>Pulsa & Token Listrik</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="font-semibold">•</span>
                                        <span>Pembayaran via transfer & upload bukti</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="font-semibold">•</span>
                                        <span>Customer support via Instagram / WhatsApp</span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold mb-2">Kontak</h3>
                                <ul className="mt-3 text-slate-300 space-y-1">
                                    <li>Email: <a className="text-indigo-400" href="mailto:ahmadkurniaprisma@gmail.com">ahmadkurniaprisma@gmail.com</a></li>
                                    <li>Instagram: <a className="text-indigo-400" href="https://www.instagram.com/akprisma">@akprisma</a></li>
                                    <li>WhatsApp: <a className="text-indigo-400" href="https://wa.me/+628989209565">+628989209565</a></li>
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