"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DATA = [
  { month: "Jan", revenue: 42000 },
  { month: "Fév", revenue: 58000 },
  { month: "Mar", revenue: 51000 },
  { month: "Avr", revenue: 67000 },
  { month: "Mai", revenue: 89000 },
  { month: "Juin", revenue: 72000 },
  { month: "Juil", revenue: 94000 },
  { month: "Août", revenue: 88000 },
  { month: "Sep", revenue: 110000 },
  { month: "Oct", revenue: 125000 },
  { month: "Nov", revenue: 118000 },
  { month: "Déc", revenue: 142000 },
];

export function AdminRevenueChart() {
  return (
    <div className="comic-card bg-surface p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-text-primary">Revenus 2025</h3>
        <span className="text-xs text-text-muted">en euros</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={DATA}
          margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00674F" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00674F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border) " />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "var(--text-muted) " }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted) " }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--surface) ",
              border: "2px solid var(--border) ",
              borderRadius: "10px",
              fontFamily: "Sora, sans-serif",
              fontSize: 12,
            }}
            formatter={(v) => [
              `${Number(v).toLocaleString("fr-FR")} €`,
              "Revenus",
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#00674F"
            strokeWidth={2}
            fill="url(#colorRevenue) "
            dot={{ fill: "#00674F", strokeWidth: 2, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
