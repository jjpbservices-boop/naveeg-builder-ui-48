import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenweb } from "@/lib/tenweb"; // adjust path if different

export const Route = createFileRoute("/$siteId/domains")({
  component: Domains,
});

function Domains() {
  const qc = useQueryClient();
  const { siteId } = Route.useParams();

  const domainsQ = useQuery({
    queryKey: ["domains", siteId],
    queryFn: () => tenweb.getDomains(siteId),
  });

  const setDefaultM = useMutation({
    mutationFn: (domainId: number) => tenweb.setDefaultDomain(siteId, domainId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["domains", siteId] }),
  });

  if (domainsQ.isLoading) return <div>Loading…</div>;
  if (domainsQ.isError) return <div>Error</div>;

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-medium">Domains</h1>
      <ul className="space-y-2">
        {(domainsQ.data as any).map((d: any) => (
          <li key={d.id} className="flex items-center gap-3">
            <span>{d.name}</span>
            {d.default ? (
              <span className="text-xs opacity-60">default</span>
            ) : (
              <button
                onClick={() => setDefaultM.mutate(d.id)}
                disabled={setDefaultM.isPending}
                className="border px-2 py-1 rounded"
              >
                Make default
              </button>
            )}
            <Link to={"/$siteId/overview".replace("$siteId", String(siteId))}>
              Overview
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}