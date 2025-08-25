// src/features/security/SecurityDashboard.tsx
import { useParams } from "@tanstack/react-router";
import { useBackups, useCertificates, useDomains } from "@/lib/queries";
import {
  useIssueFreeCert,
  useRemoveCertificate,
  usePurgeCache,
  usePasswordProtection,
  useRunBackup,
  useRestoreBackup,
} from "@/lib/mutations";
import { useMemo, useState } from "react";
import { useToast } from "@/lib/toast";
import { mapError } from "@/lib/errorMap";
import { useRole, can } from "@/lib/roles";
import { useTranslation } from "react-i18next";
import Skeleton from "@/components/Skeleton";
import { RequireRole } from "@/lib/guards";

export default function SecurityDashboard() {
  const { siteId } = useParams({ from: "/dashboard/$siteId/security" });
  const id = Number(siteId);
  const { role, loading: roleLoading } = useRole();
  const { t } = useTranslation(["dashboard"]);
  const { push } = useToast();

  const certsQ = useCertificates(id);
  const backupsQ = useBackups(id);
  const domainsQ = useDomains(id);

  const issueCert = useIssueFreeCert(id);
  const removeCert = useRemoveCertificate(id);
  const purge = usePurgeCache(id);
  const protect = usePasswordProtection(id);
  const runBackup = useRunBackup(id);
  const restore = useRestoreBackup(id);

  const [selectedDomainIds, setSelectedDomainIds] = useState<number[]>([]);
  const domainItems = domainsQ.data?.data ?? [];
  const certItems = certsQ.data?.data ?? [];
  const backupItems = backupsQ.data?.data ?? [];

  if (roleLoading || certsQ.isLoading || backupsQ.isLoading || domainsQ.isLoading) return <Skeleton className="h-64" />;

  const canIssue = can("ssl.issueFree", role) && selectedDomainIds.length > 0;
  const canRemoveCert = can("ssl.remove", role);
  const canPurge = can("cache.purge", role);
  const canPassword = can("security.password", role);
  const canRunBackup = can("backup.run", role);
  const canRestore = can("backup.restore", role);

  return (
    <section className="space-y-8">
      <h1 className="text-xl font-semibold">Security</h1>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded border px-3 py-2"
          onClick={() =>
            purge.mutate(undefined, {
              onSuccess: () => push({ title: t("dashboard:toasts.cache.purged"), kind: "success" }),
              onError: (e) => push({ title: mapError(e), kind: "error" }),
            })
          }
          disabled={purge.isPending || !canPurge}
        >
          {purge.isPending ? "Purging…" : "Purge cache"}
        </button>
        <button
          className="rounded border px-3 py-2"
          onClick={() =>
            protect.mutate("enable", {
              onSuccess: () => push({ title: t("dashboard:toasts.password.enabled"), kind: "success" }),
              onError: (e) => push({ title: mapError(e), kind: "error" }),
            })
          }
          disabled={protect.isPending || !canPassword}
        >
          Enable password protection
        </button>
        <button
          className="rounded border px-3 py-2"
          onClick={() =>
            protect.mutate("disable", {
              onSuccess: () => push({ title: t("dashboard:toasts.password.disabled"), kind: "success" }),
              onError: (e) => push({ title: mapError(e), kind: "error" }),
            })
          }
          disabled={protect.isPending || !canPassword}
        >
          Disable password protection
        </button>
      </div>

      <div>
        <h2 className="font-medium mb-2">Issue Free SSL</h2>
        <div className="rounded-xl border divide-y">
          {domainItems.map((d) => (
            <label key={d.id} className="p-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-xs opacity-70">{d.site_url}</div>
              </div>
              <input
                type="checkbox"
                checked={selectedDomainIds.includes(d.id)}
                onChange={(e) =>
                  setSelectedDomainIds((prev) => (e.target.checked ? [...prev, d.id] : prev.filter((x) => x !== d.id)))
                }
              />
            </label>
          ))}
          {domainItems.length === 0 && <div className="p-4 text-sm opacity-70">No domains.</div>}
        </div>
        <div className="mt-2">
          <button
            className="rounded border px-3 py-2"
            onClick={() =>
              issueCert.mutate(selectedDomainIds, {
                onSuccess: () => {
                  push({ title: t("dashboard:toasts.ssl.issued"), kind: "success" });
                  setSelectedDomainIds([]);
                  certsQ.refetch();
                },
                onError: (e) => push({ title: mapError(e), kind: "error" }),
              })
            }
            disabled={!canIssue || issueCert.isPending}
          >
            {issueCert.isPending ? "Issuing…" : "Issue certificate"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-medium mb-2">SSL Certificates</h2>
        <div className="rounded-xl border divide-y">
          {certItems.map((c) => (
            <div key={c.id} className="p-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{c.common_name}</div>
                <div className="text-xs opacity-70">
                  {c.type} • {c.status} {c.valid_to ? `• valid to ${c.valid_to}` : ""}
                </div>
              </div>
              <button
                className="text-xs px-2 py-1 rounded border"
                onClick={() => {
                  if (!canRemoveCert) return;
                  if (!window.confirm(`Remove certificate for ${c.common_name}?`)) return;
                  removeCert.mutate(c.id, {
                    onSuccess: () => {
                      push({ title: t("dashboard:toasts.ssl.removed"), kind: "success" });
                      certsQ.refetch();
                    },
                    onError: (e) => push({ title: mapError(e), kind: "error" }),
                  });
                }}
                disabled={removeCert.isPending || !canRemoveCert}
              >
                {removeCert.isPending ? "Removing…" : "Remove"}
              </button>
            </div>
          ))}
          {certItems.length === 0 && <div className="p-4 text-sm opacity-70">No certificates.</div>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium">Backups</h2>
          <button
            className="rounded border px-3 py-2"
            onClick={() =>
              runBackup.mutate(undefined, {
                onSuccess: () => {
                  push({ title: t("dashboard:toasts.backup.started"), kind: "success" });
                  backupsQ.refetch();
                },
                onError: (e) => push({ title: mapError(e), kind: "error" }),
              })
            }
            disabled={runBackup.isPending || !canRunBackup}
          >
            {runBackup.isPending ? "Running…" : "Run backup"}
          </button>
        </div>
        <div className="rounded-xl border divide-y">
          {backupItems.map((b) => (
            <div key={b.backup_id} className="p-3 flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{b.type}</div>
                <div className="text-xs opacity-70">
                  {new Date(b.backup_time).toLocaleString()} • {(b.backup_size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
              <button
                className="text-xs px-2 py-1 rounded border"
                onClick={() => {
                  if (!canRestore) return;
                  if (!window.confirm("Restore this backup? Current site will be overwritten.")) return;
                  restore.mutate(b.backup_id, {
                    onSuccess: () => push({ title: t("dashboard:toasts.backup.restored"), kind: "success" }),
                    onError: (e) => push({ title: mapError(e), kind: "error" }),
                  });
                }}
                disabled={restore.isPending || !canRestore}
              >
                {restore.isPending ? "Restoring…" : "Restore"}
              </button>
            </div>
          ))}
          {backupItems.length === 0 && <div className="p-4 text-sm opacity-70">No backups yet.</div>}
        </div>
      </div>
    </section>
  );
}