import { CreditCard, Clock, CheckCircle, Gamepad2, LucideIcon } from "lucide-react";

export interface StatItem {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  color: "blue" | "green" | "yellow" | "purple";
  isRestricted?: boolean;
}

interface StatsConfigProps {
  userRole: string;
  totalRevenue: number;
  pendingCount: number;
  successCount: number;
  transactionsCount: number;
  productCount: number;
  formatRupiah: (val: number) => string;
}

export const getStatsList = ({
  userRole,
  totalRevenue,
  pendingCount,
  successCount,
  transactionsCount,
  productCount,
  formatRupiah,
}: StatsConfigProps): StatItem[] => {
    
  const successRate = transactionsCount > 0 
    ? ((successCount / transactionsCount) * 100).toFixed(1) 
    : 0;

  return [
    {
      title: "Total Revenue",
      value: userRole === "boss" ? formatRupiah(totalRevenue) : "Rp ••••••••",
      trend: "Calculated from 'Success' orders only",
      icon: CreditCard,
      color: "blue",
      isRestricted: userRole !== "boss",
    },
    {
      title: "Pending Orders",
      value: `${pendingCount} Orders`,
      trend: "Needs immediate attention",
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Success Transactions",
      value: `${successCount}`,
      trend: `${successRate}% Success Rate`,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Active Products",
      value: `${productCount} Product Items`,
      trend: "Total product in catalog",
      icon: Gamepad2,
      color: "purple",
    },
  ];
};