"use client";

import { useMemo } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Card } from "@/components/ui/Card";
import { Activity } from "lucide-react";
import type { TopupData } from "@/datatypes/TopupData";

interface TransactionStatusChartProps {
  transactions: TopupData[];
}

const STATUS_COLORS: Record<string, string> = {
  success: "#10b981",
  pending: "#f59e0b",
  processing: "#3b82f6",
  canceled: "#ef4444",
  failed: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  success: "Success",
  pending: "Pending",
  processing: "Processing",
  canceled: "Canceled",
  failed: "Failed",
};

export const TransactionStatusChart = ({
  transactions,
}: TransactionStatusChartProps) => {
  const pieData = useMemo(() => {
    const statusMap: Record<string, number> = {};

    transactions.forEach((t) => {
      const s = (t.status || "").trim().toLowerCase();
      statusMap[s] = (statusMap[s] || 0) + 1;
    });

    return Object.entries(statusMap)
      .map(([status, count], idx) => ({
        id: idx,
        value: count,
        label: STATUS_LABELS[status] || status,
        color: STATUS_COLORS[status] || "#6b7280",
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = transactions.length;

  return (
    <Card className="overflow-hidden">
      <div className="mb-2">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <Activity size={18} className="text-emerald-400" />
          Order Status
        </h3>
        <p className="text-xs text-gray-500">Distribution overview</p>
      </div>

      <div className="w-full flex items-center justify-center" style={{ height: 220 }}>
        <PieChart
          series={[
            {
              data: pieData,
              innerRadius: 50,
              outerRadius: 90,
              paddingAngle: 3,
              cornerRadius: 6,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { additionalRadius: -5, color: "gray" },
              valueFormatter: (item) => `${item.value} orders`,
            },
          ]}
          sx={{
            "& .MuiChartsTooltip-paper": {
              backgroundColor: "#111827 !important",
              color: "#e5e7eb !important",
              border: "1px solid #1f2937 !important",
              borderRadius: "12px !important",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5) !important",
            },
            "& .MuiChartsTooltip-cell": {
              color: "#e5e7eb !important",
            },
            "& .MuiChartsLegend-root": {
              display: "none",
            },
          }}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          width={220}
          height={220}
        />
      </div>

      {/* Custom Legend */}
      <div className="mt-3 space-y-2">
        {pieData.map((item) => {
          const percent =
            total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
          return (
            <div
              key={item.label}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-300">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs">{percent}%</span>
                <span className="text-white font-semibold text-xs min-w-7.5 text-right">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
