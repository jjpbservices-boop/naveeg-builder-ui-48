// src/features/domains/DomainDashboard.tsx
import { useParams } from "@tanstack/react-router";
import { useDomains } from "@/lib/queries";
import { useAddDomain, useDeleteDomain, useSetDefaultDomain } from "@/lib/mutations";
import { useState } from "react";
import { useToast } from "@/lib/toast";
import { mapError } from "@/lib/errorMap";
import { useRole, can } from "@/lib/roles";
import { useTranslation } from "react-i18next";
import Skeleton from "@/components/Skeleton";
import { RequireRole } from "@/lib/guards";

export default function DomainDashboard() {
  const { siteId } = useParams({ from: "/dashboard/$siteId/domains" });
  const id = Number(siteId);
  const { role, loading: roleLoading } = useRole();
  const { t } = useTranslation(["dashboard"]);
  const { push } = useToast();

  const { data, isLoading, error, refetch } = useDomains(id);
  const addDomain = useAddDomain(id);
  const delDomain = useDeleteDomain(id);
  const setDefault = useSetDefaultDomain(id);

  const [newDomain, setNewDomain] = useState("");

  if (isLoading || roleLoading) return <Skeleton className="h-48" />;
  if (error) return <div>Failed to load domains.</div>;
  const domains = data?.data ?? [];

  const canAdd = can("domain.add", role);
  const canSetDefault = can("domain.setDefault", role);
  const canDelete = can("domain.delete", role);

  return (
    <section className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-semibold">Domains</h1>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!newDomain || !canAdd) return;
          addDomain.mutate(newDomain, {
            onSuccess: () => {
              push({ title: t("dashboard:toasts.domain.added"), kind: "success" });
              setNewDomain("");
              refetch();
            },
            onError: (err) => push({ title: mapError(err), kind: "error" }),
          });
        }}
      >
        <input
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder="example.com"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          disabled={!canAdd}
        />
        <button className="rounded-lg px-3 py-2 border" disabled={addDomain.isPending || !newDomain || !canAdd}>
          {addDomain.isPending ? "Adding…" : "Add"}
        </button>
      </form>

      <div className="rounded-xl border divide-y">
        {domains.map((d) => (
          <div key={d.id} className="p-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">{d.name}</div>
              <div className="text-xs opacity-70">{d.site_url}</div>
            </div>
            <div className="flex items-center gap-2">
              {d.default ? (
                <span className="text-xs px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800">default</span>
              ) : (
                <button
                  className="text-xs px-2 py-1 rounded border"
                  onClick={() =>
                    setDefault.mutate(d.id, {
                      onSuccess: () => {
                        push({ title: t("dashboard:toasts.domain.defaultSet"), kind: "success" });
                        refetch();
                      },
                      onError: (err) => push({ title: mapError(err), kind: "error" }),
                    })
                  }
                  disabled={setDefault.isPending || !canSetDefault}
                >
                  {setDefault.isPending ? "Setting…" : "Set default"}
                </button>
              )}
              <RequireRole allow={['admin']}>
                <button
                  className="text-xs px-2 py-1 rounded border"
                  onClick={() => {
                    if (!canDelete) return;
                    if (!window.confirm(`Delete ${d.name}?`)) return;
                    delDomain.mutate(d.id, {
                      onSuccess: () => {
                        push({ title: t("dashboard:toasts.domain.deleted"), kind: "success" });
                        refetch();
                      },
                      onError: (err) => push({ title: mapError(err), kind: "error" }),
                    });
                  }}
                  disabled={delDomain.isPending || !canDelete}
                >
                  {delDomain.isPending ? "Deleting…" : "Delete"}
                </button>
              </RequireRole>
            </div>
          </div>
        ))}
        {domains.length === 0 && <div className="p-4 text-sm opacity-70">No domains yet.</div>}
      </div>
    </section>
  );
}