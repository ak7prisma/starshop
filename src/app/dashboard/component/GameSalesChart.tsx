"use client";

import { useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card } from "@/components/ui/Card";
import { Gamepad2 } from "lucide-react";
import type { TopupData } from "@/datatypes/TopupData";
import { formatRupiah } from "@/app/utils/formatRupiah";

interface GameSalesChartProps {
  transactions: TopupData[];
}

export const GameSalesChart = ({ transactions }: GameSalesChartProps) => {
  const { gameNames, salesCounts, revenues } = useMemo(() => {
    const normalize = (s: string) => (s || "").trim().toLowerCase();

    const gameSales: Record<string, { count: number; revenue: number }> = {};

    transactions
      .filter((t) => normalize(t.status) === "success")
      .forEach((t) => {
        const gameName = t.Products?.nameProduct || "Unknown";
        if (!gameSales[gameName]) {
          gameSales[gameName] = { count: 0, revenue: 0 };
        }
        gameSales[gameName].count += 1;
        gameSales[gameName].revenue += Number(t.price);
      });

    const sorted = Object.entries(gameSales)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);

    return {
      gameNames: sorted.map((g) => g.name),
      salesCounts: sorted.map((g) => g.count),
      revenues: sorted.map((g) => g.revenue),
    };
  }, [transactions]);

  if (gameNames.length === 0) {
    return (
      <Card className="lg:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <Gamepad2 size={18} className="text-purple-400" />
          <h3 className="font-bold text-lg text-white">Sales by Game</h3>
        </div>
        <div className="flex items-center justify-center h-70 text-gray-500 text-sm">
          No sales data available yet.
        </div>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Gamepad2 size={18} className="text-purple-400" />
            Sales by Game
          </h3>
          <p className="text-xs text-gray-500">
            Top games by revenue (success orders)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-gray-400">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-gray-400">Orders</span>
          </div>
        </div>
      </div>

      <div className="w-full" style={{ height: 300 }}>
        <BarChart
          xAxis={[
            {
              data: gameNames,
              scaleType: "band",
              tickLabelStyle: {
                fill: "#9ca3af",
                fontSize: 11,
                angle: gameNames.length > 4 ? -30 : 0,
                textAnchor: gameNames.length > 4 ? "end" : "middle",
              },
            },
          ]}
          yAxis={[
            {
              id: "revenue",
              tickLabelStyle: {
                fill: "#6b7280",
                fontSize: 11,
              },
              valueFormatter: (value: number) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return String(value);
              },
            },
            {
              id: "orders",
              position: "right" as const,
              tickLabelStyle: {
                fill: "#6b7280",
                fontSize: 11,
              },
            },
          ]}
          series={[
            {
              data: revenues,
              color: "#8b5cf6",
              label: "Revenue",
              yAxisId: "revenue",
              valueFormatter: (value: number | null) =>
                value === null ? "-" : formatRupiah(value),
            },
            {
              data: salesCounts,
              color: "#3b82f6",
              label: "Orders",
              yAxisId: "orders",
              valueFormatter: (value: number | null) =>
                value === null ? "-" : `${value} orders`,
            },
          ]}
          sx={{
            "& .MuiBarElement-root": {
              rx: 4,
              ry: 4,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
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
          margin={{ top: 20, right: 50, bottom: 40, left: 60 }}
        />
      </div>
    </Card>
  );
};
