import { LayoutDashboard, ShoppingCart, Package, Newspaper } from "lucide-react";

export const dashboarMenu = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/dashboard/transactions", icon: ShoppingCart },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "News", href: "/dashboard/news", icon: Newspaper},
  ];

export const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed "},
];

export const categoryOptions = [
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