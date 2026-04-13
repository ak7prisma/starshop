"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card } from "@/components/ui/Card";
import { Gamepad2 } from "lucide-react";
import type { TopupData } from "@/datatypes/TopupData";
import { formatRupiah } from "@/app/utils/formatRupiah";

interface GameSalesChartProps {
  transactions: TopupData[];
}

export const GameSalesChart = ({ transactions }: GameSalesChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isMobile = containerWidth > 0 && containerWidth < 480;

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

    const maxItems = isMobile ? 4 : 6;
    const sorted = Object.entries(gameSales)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, maxItems);

    return {
      gameNames: sorted.map((g) => isMobile && g.name.length > 8 ? g.name.slice(0, 7) + "…" : g.name),
      salesCounts: sorted.map((g) => g.count),
      revenues: sorted.map((g) => g.revenue),
    };
  }, [transactions, isMobile]);

  if (gameNames.length === 0) {
    return (
      <Card className="lg:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <Gamepad2 size={18} className="text-purple-400" />
          <h3 className="font-bold text-lg text-white">Sales by Product</h3>
        </div>
        <div className="flex items-center justify-center h-70 text-gray-500 text-sm">
          No sales data available yet.
        </div>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
            <Gamepad2 size={18} className="text-purple-400" />
            Sales by Product
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500">
            Top products by revenue (success orders)
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-500" />
            <span className="text-gray-400">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-500" />
            <span className="text-gray-400">Orders</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="w-full" style={{ height: isMobile ? 240 : 300 }}>
        {containerWidth > 0 && (
          <BarChart
            width={containerWidth}
            xAxis={[
              {
                data: gameNames,
                scaleType: "band",
                tickLabelStyle: {
                  fill: "#9ca3af",
                  fontSize: isMobile ? 9 : 11,
                  angle: isMobile ? -35 : (gameNames.length > 4 ? -30 : 0),
                  textAnchor: isMobile ? "end" : (gameNames.length > 4 ? "end" : "middle"),
                },
              },
            ]}
            yAxis={[
              {
                id: "revenue",
                tickLabelStyle: {
                  fill: "#6b7280",
                  fontSize: isMobile ? 9 : 11,
                },
                valueFormatter: (value: number) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return String(value);
                },
              },
              ...(isMobile ? [] : [{
                id: "orders",
                position: "right" as const,
                tickLabelStyle: {
                  fill: "#6b7280",
                  fontSize: 11,
                },
              }]),
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
                yAxisId: isMobile ? "revenue" : "orders",
                valueFormatter: (value: number | null) =>
                  value === null ? "-" : `${value} orders`,
              },
            ]}
            sx={{
              "& .MuiBarElement-root": {
                rx: 4,
                ry: 4,
                filter: isMobile ? "none" : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
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
            margin={isMobile
              ? { top: 10, right: 10, bottom: 10, left: 0 }
              : { top: 20, right: 50, bottom: 10, left: 20 }
            }
          />
        )}
      </div>
    </Card>
  );
};
