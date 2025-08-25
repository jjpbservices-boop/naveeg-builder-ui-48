import { useParams } from "@tanstack/react-router";
import { useVisitors } from "@/lib/queries";

export default function AnalyticsDashboard() {
  const { siteId } = useParams({ from: "/dashboard/$siteId/analytics" });
  const id = Number(siteId);
  const { data, isLoading, error } = useVisitors(id, "month");
  if (isLoading) return <div>Loading analytics…</div>;
  if (error) return <div>Failed to load analytics.</div>;
  const points = data?.data ?? [];
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Analytics</h1>
      <div className="text-sm opacity-70">Monthly visits: <b>{data?.sum ?? 0}</b></div>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {points.slice(0,12).map(p => (
          <li key={p.date} className="rounded-lg border p-3">
            <div className="text-xs">{p.date}</div>
            <div className="font-medium">{p.count}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}