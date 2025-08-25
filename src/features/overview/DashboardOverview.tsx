import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@/components/Skeleton";
import StatCard from "@/components/StatCard";
import { getVisitors } from "@/lib/tenweb";

function useVisitorsSum(siteId: string, period: "day" | "week" | "month") {
  return useQuery({
    queryKey: ["visitors-sum", siteId, period],
    queryFn: async () => {
      const points = (await getVisitors(Number(siteId), period)) as any[];
      const sum = (points ?? []).reduce(
        (acc, p) => acc + Number(p?.value ?? p?.count ?? p?.total ?? 0),
        0
      );
      return sum;
    },
    staleTime: 30_000,
  });
}

export default function DashboardOverview() {
  const { siteId } = useParams({ from: "/dashboard/$siteId" }) as { siteId: string };

  const today = useVisitorsSum(siteId, "day");
  const week = useVisitorsSum(siteId, "week");
  const month = useVisitorsSum(siteId, "month");

  const loading = today.isLoading || week.isLoading || month.isLoading;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["analytics", "View analytics", "Traffic, trends & referrers"],
          ["domains", "Manage domains", "Connect and secure your domain"],
          ["security", "Security", "Protection & backups"],
          ["pages", "Pages", "Edit and publish content"],
        ].map(([slug, title, desc]) => (
          <Link
            key={slug}
            to={`/dashboard/${siteId}/${slug}`}
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