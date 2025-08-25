import React, { Suspense, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useVisitors } from "@/lib/queries";

const ChartChunk = React.lazy(() => import("./ChartChunk"));

type Range = "week" | "month" | "year";

export default function AnalyticsDashboard() {
  const { siteId } = useParams({ from: "/$siteId/analytics" as never });
  const [range, setRange] = useState<Range>("month");

  const { data = [], isLoading, isError } = useVisitors(Number(siteId), range);
  const chartData = data.map((p) => ({ date: p.date, visitors: p.value }));

  if (isLoading)
    return (
      <div className="h-80 rounded-xl animate-pulse bg-neutral-100 dark:bg-neutral-800" />
    );
  if (isError) return <div className="text-sm">Failed to load analytics.</div>;
  if (!chartData.length) return <div className="text-sm">No data.</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["week", "month", "year"] as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded-full border ${
              r === range
                ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                : ""
            }`}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      <Suspense
        fallback={
          <div className="h-80 rounded-xl animate-pulse bg-neutral-100 dark:bg-neutral-800" />
        }
      >
        <ChartChunk data={chartData} />
      </Suspense>
    </div>
  );
}