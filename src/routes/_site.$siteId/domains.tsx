import { useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenweb, type DomainItem } from "@/lib/tenweb";
import { toast } from "sonner";
import { useState } from "react";

export default function DomainsRoute() {
  const { siteId } = useParams({ from: "/_site/$siteId/domains" as never });
  const websiteId = Number(siteId);
  const qc = useQueryClient();
  const [selected, setSelected] = useState<number[]>([]);

  const domainsQ = useQuery({
    queryKey: ["domains", websiteId],
    queryFn: () => tenweb.getDomains(websiteId),
  });

  const setDefault = useMutation({
    mutationFn: (domainId: number) => tenweb.setDefaultDomain(websiteId, domainId),
    onMutate: async (domainId) => {
      await qc.cancelQueries({ queryKey: ["domains", websiteId] });
      const prev = qc.getQueryData<{ data: DomainItem[] }>(["domains", websiteId]);
      if (prev) {
        const next = {
          data: prev.data.map(d => ({ ...d, default: d.id === domainId ? 1 : 0 })),
        };
        qc.setQueryData(["domains", websiteId], next);
      }
      toast.loading("Setting default domain…", { id: "set-default" });
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["domains", websiteId], ctx.prev);
      toast.error("Failed to set default domain", { id: "set-default" });
    },
    onSuccess: () => {
      toast.success("Default domain set", { id: "set-default" });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["domains", websiteId] });
    },
  });

  const genSSL = useMutation({
    mutationFn: () => tenweb.generateFreeCertificate(websiteId, selected),
    onMutate: () => toast.loading("Issuing SSL…", { id: "ssl" }),
    onError: () => toast.error("SSL issuance failed", { id: "ssl" }),
    onSuccess: () => toast.success("SSL issued", { id: "ssl" }),
  });

  const purge = useMutation({
    mutationFn: () => tenweb.purgeCache(websiteId, 0),
    onMutate: () => toast.loading("Purging cache…", { id: "purge" }),
    onError: () => toast.error("Cache purge failed", { id: "purge" }),
    onSuccess: () => toast.success("Cache purged", { id: "purge" }),
  });

  if (domainsQ.isLoading) return <div className="h-32 rounded-xl animate-pulse bg-neutral-100 dark:bg-neutral-800" />;
  if (domainsQ.isError || !domainsQ.data) return <div className="text-sm">Failed to load domains.</div>;

  const rows = domainsQ.data.data;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          className="px-3 py-2 border rounded-xl disabled:opacity-50"
          onClick={() => purge.mutate()}
          disabled={purge.isPending}
        >
          Purge cache
        </button>
        <button
          className="px-3 py-2 border rounded-xl disabled:opacity-50"
          onClick={() => genSSL.mutate()}
          disabled={genSSL.isPending || selected.length === 0}
          title={selected.length === 0 ? "Select domains first" : ""}
        >
          Generate free SSL
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">#</th>
            <th className="py-2">Domain</th>
            <th className="py-2">Default</th>
            <th className="py-2">Select</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id} className="border-b last:border-0">
              <td className="py-2">{d.id}</td>
              <td className="py-2">{d.name}</td>
              <td className="py-2">
                {d.default ? (
                  <span className="px-2 py-0.5 rounded-full border">Default</span>
                ) : (
                  <button
                    className="px-2 py-0.5 rounded-full border"
                    onClick={() => setDefault.mutate(d.id)}
                    disabled={setDefault.isPending}
                  >
                    Set default
                  </button>
                )}
              </td>
              <td className="py-2">
                <input
                  type="checkbox"
                  checked={selected.includes(d.id)}
                  onChange={(e) =>
                    setSelected((prev) =>
                      e.target.checked ? [...prev, d.id] : prev.filter((x) => x !== d.id)
                    )
                  }
                />
              </td>
              <td className="py-2">
                <a href={d.site_url} target="_blank" rel="noreferrer" className="underline">
                  Open
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-xs opacity-60">
        Tip: select custom domains for SSL. Use “Set default” to switch primary domain.
      </p>
    </div>
  );
}