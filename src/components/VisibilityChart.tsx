"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AI_PLATFORMS } from "@/lib/platforms";

interface Check {
  id: string;
  platform: string;
  mentioned: boolean;
  checkedAt: string;
}

interface VisibilityChartProps {
  checks: Check[];
}

export default function VisibilityChart({ checks }: VisibilityChartProps) {
  const chartData = useMemo(() => {
    if (checks.length === 0) return [];

    // Group checks by date
    const dateGroups = new Map<
      string,
      Map<string, { mentioned: number; total: number }>
    >();

    for (const check of checks) {
      const date = new Date(check.checkedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!dateGroups.has(date)) {
        dateGroups.set(date, new Map());
      }
      const platforms = dateGroups.get(date)!;

      if (!platforms.has(check.platform)) {
        platforms.set(check.platform, { mentioned: 0, total: 0 });
      }
      const stats = platforms.get(check.platform)!;
      stats.total++;
      if (check.mentioned) stats.mentioned++;
    }

    // Convert to chart format
    return Array.from(dateGroups.entries())
      .map(([date, platforms]) => {
        const point: Record<string, string | number> = { date };
        for (const platform of AI_PLATFORMS) {
          const stats = platforms.get(platform.id);
          point[platform.id] = stats
            ? Math.round((stats.mentioned / stats.total) * 100)
            : 0;
        }
        return point;
      })
      .reverse();
  }, [checks]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-gray-800 bg-gray-900/50">
        <p className="text-sm text-gray-500">
          No data yet. Run a check to see visibility trends.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-medium text-gray-400">
        Visibility Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <defs>
            {AI_PLATFORMS.map((platform) => (
              <linearGradient
                key={platform.id}
                id={`gradient-${platform.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={platform.color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={platform.color}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "12px",
            }}
            formatter={(value: unknown, name: unknown) => {
              const platform = AI_PLATFORMS.find((p) => p.id === String(name));
              return [`${value}%`, platform?.name || String(name)];
            }}
          />
          <Legend
            formatter={(value: string) => {
              const platform = AI_PLATFORMS.find((p) => p.id === value);
              return (
                <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                  {platform?.icon} {platform?.name}
                </span>
              );
            }}
          />
          {AI_PLATFORMS.map((platform) => (
            <Area
              key={platform.id}
              type="monotone"
              dataKey={platform.id}
              stroke={platform.color}
              strokeWidth={2}
              fill={`url(#gradient-${platform.id})`}
              dot={false}
              activeDot={{
                r: 4,
                stroke: platform.color,
                strokeWidth: 2,
                fill: "#111827",
              }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
