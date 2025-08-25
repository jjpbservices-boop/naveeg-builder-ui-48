import { Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useMySites } from "@/lib/mySites";
import Skeleton from "@/components/Skeleton";

export default function SiteDashboardLayout() {
  const { siteId } = useParams({ from: "/dashboard/$siteId" }) as { siteId: string };
  const navigate = useNavigate();
  const sites = useMySites();

  if (sites.isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-10" />
      </div>
    );
  }

  const all = sites.data ?? [];
  const current = all.find((s) => String(s.website_id) === String(siteId));

  const go = (id: string) => {
    navigate({ to: `/dashboard/${id}/overview` } as any);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Site</div>
          <div className="text-xl font-semibold">
            {current?.title || `Site ${siteId}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="site-select" className="text-sm text-muted-foreground">
            Switch
          </label>
          <select
            id="site-select"
            className="rounded-lg border px-3 py-2 bg-background"
            value={siteId}
            onChange={(e) => go(e.target.value)}
          >
            {all.map((s) => (
              <option key={s.website_id} value={String(s.website_id)}>
                {s.title || `Site ${s.website_id}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-1 border-b">
        {[
          ["overview", "Overview"],
          ["analytics", "Analytics"],
          ["domains", "Domains"],
          ["security", "Security"],
          ["billing", "Billing"],
          ["pages", "Pages"],
        ].map(([slug, label]) => (
          <Link
            key={slug}
            to={`/dashboard/${siteId}/${slug}`}
            className="px-3 py-2 -mb-px text-sm border-b-2 border-transparent data-[status=active]:border-foreground/80 data-[status=active]:font-medium hover:bg-muted/40 rounded-t-md"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="py-4">
        <Outlet />
      </div>
    </div>
  );
}