"use client";

import {
  CreditCard, Clock, CheckCircle, Gamepad2, Loader2, Download
} from "lucide-react";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { RecentTransactionsTable } from "@/components/organisms/RecentTransactionsTable";
import { TopSellingList } from "@/components/organisms/TopSellingList";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const {
    isLoading,
    transactions,
    productCount,
    totalRevenue,
    pendingCount,
    successCount,
    topGames
  } = useDashboardStats();

  const userRole = "boss";

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-gray-400 animate-pulse">Syncing with database...</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: userRole === "boss" ? formatRupiah(totalRevenue) : "Rp ••••••••",
      trend: "Based on success transactions",
      icon: CreditCard,
      color: "blue" as const,
      isRestricted: userRole !== "boss",
      isPositive: true,
    },
    {
      title: "Pending Orders",
      value: `${pendingCount} Orders`,
      trend: "Needs immediate attention",
      icon: Clock,
      color: "yellow" as const,
      isRestricted: false,
      isPositive: false,
    },
    {
      title: "Success Transactions",
      value: `${successCount}`,
      trend: `${transactions.length > 0 ? ((successCount / transactions.length) * 100).toFixed(1) : 0}% Success Rate`,
      icon: CheckCircle,
      color: "green" as const,
      isRestricted: false,
      isPositive: true,
    },
    {
      title: "Active Products",
      value: `${productCount} Games`,
      trend: "Total games in catalog",
      icon: Gamepad2,
      color: "purple" as const,
      isRestricted: false,
      isPositive: true,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      <PageHeader
        title={userRole === 'boss' ? 'Boss 😎' : 'Admin 👋'}
        greeting={greeting}
        subtitle="Real-time data from Supabase Database."
        extra={
          <Button size="md" leftIcon={<Download size={18} />}>
            Download Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentTransactionsTable transactions={transactions} />

        <TopSellingList
          games={topGames}
          totalTransactions={transactions.length}
          userRole={userRole}
        />
      </div>
    </div>
  );
}