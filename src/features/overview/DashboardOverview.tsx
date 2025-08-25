import { useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@/components/Skeleton";
import StatCard from "@/components/StatCard";
import { getVisitors } from "@/lib/tenweb"; // Assuming getVisitors accepts { id: number, period: string }

function useVisitorsCount(siteId: string, period: "day" | "week" | "month") {
  return useQuery({
    queryKey: ["visitors", siteId, period],
    queryFn: async () => {
      const data = await getVisitors({ id: Number(siteId), period });
      const n =
        typeof data === "number"
          ? data
          : (data?.total ?? data?.visitors ?? data?.count ?? 0);
 return Number(n) || 0;
    },
    staleTime: 30_000, // Cache data for 30 seconds
  });
}

export default function DashboardOverview() {
  const { siteId } = useParams({ from: "/dashboard/$siteId/overview" as any }) as { siteId: string };

  const today = useVisitorsCount(siteId, "day");
  const week = useVisitorsCount(siteId, "week");
  const month = useVisitorsCount(siteId, "month");
 
  const anyLoading = today.isLoading || week.isLoading || month.isLoading;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {anyLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : (
          <>
            <StatCard label="Visitors today" value={today.data ?? 0} />
            <StatCard label="Visitors this week" value={week.data ?? 0} />
            <StatCard label="Visitors this month" value={month.data ?? 0} />
          </>
        )}
      </div>

      {/* Quick links */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["analytics", "View analytics", "Traffic, trends & referrers"],
          ["domains", "Manage domains", "Connect and secure your domain"],
          ["security", "Security", "Protection & backups"],
          ["pages", "Pages", "Edit and publish content"],
        ].map(([slug, title, desc]) => (
          <Link
            key={slug}
            to={`/dashboard/$siteId/${slug}`}
            params={{ siteId }}
            className="rounded-xl border p-4 hover:bg-muted/40 transition"
          >
            <div className="font-medium">{title}</div>
            <div className="text-sm text-muted-foreground mt-1">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}