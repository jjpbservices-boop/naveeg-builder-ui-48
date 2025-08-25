// src/routes/_site.$siteId/overview.tsx
import { createFileRoute, useParams } from "@tanstack/react-router";

// Temporary simplified OverviewPage
function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 rounded-2xl border">
      <div className="text-xs opacity-60">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
function OverviewPage() {
  const { siteId } = useParams({ from: "/$siteId/overview" as never });
  const id = Number(siteId);
  const { data: month = [] } = useVisitors(id, "month");
  const monthTotal = month.reduce((s, p) => s + p.value, 0);
  const { data: domains = [] } = useDomains(id);
  const defaultDomain = domains.find(d => d.default);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label="Visitors last 30d" value={monthTotal} />
        <Kpi label="Domain" value={defaultDomain?.name || "—"} />
        <Kpi label="Publish status" value={defaultDomain ? "Published" : "Unpublished"} />
        <Kpi label="Plan" value="—" />
      </div>

      <div className="rounded-2xl border overflow-hidden">
        <div className="p-3 flex items-center justify-between">
          <div className="font-medium">Website preview</div>
          {site?.site_url && (
            <a className="text-sm underline" href={defaultDomain?.site_url} target="_blank" rel="noreferrer">
              Open in new tab
            </a>
          )}
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-900">
          {site?.site_url ? (
            <iframe src={site.site_url} className="w-full h-[640px] border-t" />
          ) : (
            <div className="p-6 text-sm">No site URL yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/$siteId/overview")({
  component: OverviewPage,
});

