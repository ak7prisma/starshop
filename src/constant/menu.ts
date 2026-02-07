import { LayoutDashboard, ShoppingCart, Package, Check, Clock, X, Newspaper } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

export const dashboarMenu = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/dashboard/transactions", icon: ShoppingCart },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "News", href: "/dashboard/news", icon: Newspaper},
  ];

export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", icon: Clock, color: "text-amber-400" },
  { value: "success", label: "Success", icon: Check, color: "text-emerald-400" },
  { value: "failed", label: "Failed", icon: X, color: "text-red-400" },
];

export const CATEGORY_OPTIONS = [
  { value: "Games", label: "Games" },
  { value: "Voucher", label: "Voucher" },
  { value: "E-Money", label: "E-Money" },
  { value: "Lainnya", label: "Lainnya" },
];

export const navLinks = [
  { label: 'Home', href: '/Home' },
  { label: 'History', href: '/History' },
  { label: 'About', href: '/About' },
]

export const socialLinks = [
  {href: "https://www.instagram.com/akprisma?igsh=MTJtd2lwaHZoeXFrZA==", icon: FaWhatsapp},
  {href: "https://wa.me/qr/424AF5XR3VZ7B1", icon: FaInstagram},
  {href: "https://www.tiktok.com/@royuciha246?_t=ZS-8v6zPNJpxJK&_r=1", icon: FaTiktok},
  {href: "https://www.facebook.com/share/1D6zTt1ruu/", icon: FaFacebook},
]