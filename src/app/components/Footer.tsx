import { FaTiktok, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {

  const hoverFooterClass=`hover:text-indigo-400 transition duration-300`;

  return (
    <footer className="bg-[#243867]/30 text-gray-300 pt-10">
      <div className="mx-10 flex flex-col items-center space-y-6">

        <div className="flex space-x-6">
          <Link href="https://www.instagram.com/akprisma?igsh=MTJtd2lwaHZoeXFrZA==" className={hoverFooterClass}>
            <FaInstagram size={20} />
          </Link>
          <Link href="https://wa.me/qr/424AF5XR3VZ7B1" className={hoverFooterClass}>
            <FaWhatsapp size={20} />
          </Link>
          <Link href="https://www.tiktok.com/@royuciha246?_t=ZS-8v6zPNJpxJK&_r=1" className={hoverFooterClass}>
            <FaTiktok size={20} />
          </Link>
          <Link href="https://www.facebook.com/share/1D6zTt1ruu/" className={hoverFooterClass}>
            <FaFacebook size={20} />
          </Link>
        </div>

        <div className="flex space-x-8 font-medium">
          <Link href="/Home" className={hoverFooterClass}>Home</Link>
          <Link href="/History" className={hoverFooterClass}>History</Link>
          <Link href="/About" className={hoverFooterClass}>About</Link>
        </div>

        <div className="text-sm text-slate-400 text-center p-5 border-t-1 border-slate-400 w-full">
          © 2025 Starshop Pemvis Project | ahmadkurniaprisma@gmail.com
        </div>
      </div>
    </footer>
  );
}
