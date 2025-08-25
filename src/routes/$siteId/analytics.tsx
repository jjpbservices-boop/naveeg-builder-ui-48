import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { tenweb } from "@/lib/tenweb"; // adjust path if different

export const Route = createFileRoute("/$siteId/analytics")({
  component: Analytics,
});

function Analytics() {
  const { siteId } = Route.useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["visitors-series", siteId],
    queryFn: () => tenweb.getVisitors(+siteId, { period: "month" }),
  });
  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error.</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
      <pre className="text-xs p-4 rounded-2xl border overflow-auto">
        {JSON.stringify(data?.data ?? [], null, 2)}
      </pre>
    </div>
  );
}