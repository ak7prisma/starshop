"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Card } from "@/components/ui/Card";
import { TrendingUp } from "lucide-react";
import type { TopupData } from "@/datatypes/TopupData";
import { formatRupiah } from "@/app/utils/formatRupiah";

interface RevenueChartProps {
  transactions: TopupData[];
}

export const RevenueChart = ({ transactions }: RevenueChartProps) => {
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

  const { dates, revenues } = useMemo(() => {
    const normalize = (s: string) => (s || "").trim().toLowerCase();

    // Group revenue by date (last 7 days)
    const now = new Date();
    const days: string[] = [];
    const revenueMap: Record<string, number> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days.push(key);
      revenueMap[key] = 0;
    }

    transactions
      .filter((t) => normalize(t.status) === "success")
      .forEach((t) => {
        const dateKey = new Date(t.created_at).toISOString().split("T")[0];
        if (revenueMap[dateKey] !== undefined) {
          revenueMap[dateKey] += Number(t.price);
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
      revenues: days.map((d) => revenueMap[d]),
    };
  }, [transactions]);

  const totalWeekRevenue = revenues.reduce((a, b) => a + b, 0);

  return (
    <Card className="lg:col-span-2 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-400" />
            Revenue Trend
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500">Last 7 days performance</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[11px] sm:text-xs text-gray-500">This Week</p>
          <p className="text-sm font-bold text-blue-400">
            {formatRupiah(totalWeekRevenue)}
          </p>
        </div>
      </div>

      <div ref={containerRef} className="w-full" style={{ height: isMobile ? 220 : 280 }}>
        {containerWidth > 0 && (
          <LineChart
            xAxis={[
              {
                data: dates.map((_, i) => i),
                scaleType: "point",
                valueFormatter: (value: number) => dates[value] || "",
                tickLabelStyle: {
                  fill: "#6b7280",
                  fontSize: isMobile ? 9 : 11,
                },
              },
            ]}
            yAxis={[
              {
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
            ]}
            series={[
              {
                data: revenues,
                color: "#3b82f6",
                area: true,
                showMark: !isMobile,
                valueFormatter: (value: number | null) =>
                  value === null ? "-" : formatRupiah(value),
              },
            ]}
            sx={{
              "& .MuiLineElement-root": {
                strokeWidth: isMobile ? 2 : 3,
                filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))",
              },
              "& .MuiAreaElement-root": {
                fill: "url(#revenue-gradient)",
                opacity: 0.3,
              },
              "& .MuiMarkElement-root": {
                fill: "#3b82f6",
                stroke: "#1e3a5f",
                strokeWidth: 2,
                scale: "0.8",
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
              "& .MuiChartsTooltip-root": {
                backgroundColor: "#111827 !important",
                border: "1px solid #1f2937 !important",
                borderRadius: "12px !important",
              },
              "& .MuiChartsTooltip-paper": {
                backgroundColor: "#111827 !important",
                color: "#e5e7eb !important",
                border: "1px solid #1f2937 !important",
                borderRadius: "12px !important",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.5) !important",
              },
              "& .MuiChartsTooltip-cell": {
                color: "#e5e7eb !important",
              },
              "& .MuiChartsTooltip-mark": {
                borderColor: "#3b82f6 !important",
              },
            }}
            grid={{ horizontal: true }}
            margin={isMobile
              ? { top: 10, right: 10, bottom: 25, left: 40 }
              : { top: 20, right: 20, bottom: 30, left: 60 }
            }
          >
            <defs>
              <linearGradient
                id="revenue-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
          </LineChart>
        )}
      </div>
    </Card>
  );
};
