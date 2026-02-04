import { LayoutDashboard, ShoppingCart, Package, Check, Clock, X } from "lucide-react";

export const menuItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/dashboard/transactions", icon: ShoppingCart },
    { name: "Products", href: "/dashboard/products", icon: Package },
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