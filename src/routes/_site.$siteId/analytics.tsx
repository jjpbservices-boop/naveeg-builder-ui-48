// src/routes/_site.$siteId/analytics.tsx
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useVisitorsSeries } from "@/hooks/useVisitors";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next"; // Assuming you have react-i18next setup

const ranges = ["week", "month", "year"] as const;

export default function AnalyticsRoute() {
  const { siteId } = useParams({ from: "/_site/$siteId/analytics" });
  const [range, setRange] = useState<typeof ranges[number]>("month");
  const { data, isLoading, isError } = useVisitorsSeries(Number(siteId), range);
  const { t } = useTranslation("dashboard"); // Assuming your translations are in the 'dashboard' namespace

  if (isLoading) return <div className="animate-pulse h-64 rounded-xl bg-neutral-100 dark:bg-neutral-800" />;
  if (isError || !data) return <div className="text-sm">No data.</div>;

  const chartData = data.points.map(p => ({ date: p.x, visitors: p.y }));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {ranges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded-full border ${r===range ? "bg-neutral-900 text-white dark:bg-white dark:text-black" : ""}`}
          >
            {t(r)} {/* Use translation key for the range */}
          </button>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="visitors" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}