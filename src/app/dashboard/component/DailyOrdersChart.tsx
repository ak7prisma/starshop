"use client";

import { useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card } from "@/components/ui/Card";
import { BarChart3 } from "lucide-react";
import type { TopupData } from "@/datatypes/TopupData";

interface DailyOrdersChartProps {
  transactions: TopupData[];
}

export const DailyOrdersChart = ({ transactions }: DailyOrdersChartProps) => {
  const { dates, successData, pendingData, failedData } = useMemo(() => {
    const normalize = (s: string) => (s || "").trim().toLowerCase();
    const now = new Date();
    const days: string[] = [];
    const successMap: Record<string, number> = {};
    const pendingMap: Record<string, number> = {};
    const failedMap: Record<string, number> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days.push(key);
      successMap[key] = 0;
      pendingMap[key] = 0;
      failedMap[key] = 0;
    }

    transactions.forEach((t) => {
      const dateKey = new Date(t.created_at).toISOString().split("T")[0];
      const status = normalize(t.status);

      if (successMap[dateKey] !== undefined) {
        if (status === "success") {
          successMap[dateKey] += 1;
        } else if (status === "pending" || status === "processing") {
          pendingMap[dateKey] += 1;
        } else {
          failedMap[dateKey] += 1;
        }
      }
    });

    const dateLabels = days.map((d) => {
      const date = new Date(d);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    });

    return {
      dates: dateLabels,
      successData: days.map((d) => successMap[d]),
      pendingData: days.map((d) => pendingMap[d]),
      failedData: days.map((d) => failedMap[d]),
    };
  }, [transactions]);

  const todayTotal =
    successData.at(-1)! +
    pendingData.at(-1)! +
    failedData.at(-1)!;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-400" />
            Daily Orders
          </h3>
          <p className="text-xs text-gray-500">Stacked by status</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Today</p>
          <p className="text-sm font-bold text-amber-400">
            {todayTotal} orders
          </p>
        </div>
      </div>

      <div className="w-full" style={{ height: 260 }}>
        <BarChart
          xAxis={[
            {
              data: dates,
              scaleType: "band",
              tickLabelStyle: {
                fill: "#6b7280",
                fontSize: 11,
              },
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: {
                fill: "#6b7280",
                fontSize: 11,
              },
            },
          ]}
          series={[
            {
              data: successData,
              stack: "orders",
              color: "#10b981",
              label: "Success",
              valueFormatter: (value: number | null) =>
                value === null ? "-" : `${value} orders`,
            },
            {
              data: pendingData,
              stack: "orders",
              color: "#f59e0b",
              label: "Pending",
              valueFormatter: (value: number | null) =>
                value === null ? "-" : `${value} orders`,
            },
            {
              data: failedData,
              stack: "orders",
              color: "#ef4444",
              label: "Failed",
              valueFormatter: (value: number | null) =>
                value === null ? "-" : `${value} orders`,
            },
          ]}
          sx={{
            "& .MuiBarElement-root": {
              rx: 2,
              ry: 2,
            },
            "& .MuiChartsAxis-line": {
              stroke: "#1f2937",
            },
            "& .MuiChartsAxis-tick": {
              stroke: "#1f2937",
            },
            "& .MuiChartsGrid-line": {
              stroke: "#1f293740",
            },
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
            "& .MuiChartsTooltip-mark": {
              borderColor: "transparent !important",
            },
            "& .MuiChartsLegend-root": {
              display: "none",
            },
          }}
          grid={{ horizontal: true }}
          margin={{ top: 15, right: 15, bottom: 30, left: 35 }}
        />
      </div>

      {/* Mini legend */}
      <div className="flex items-center justify-center gap-5 mt-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-gray-400">Success</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-gray-400">Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-gray-400">Failed</span>
        </div>
      </div>
    </Card>
  );
};
