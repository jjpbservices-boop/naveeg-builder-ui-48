// ============================
// FILE: src/lib/mutations.ts
// React Query mutations for all write actions.
// ============================
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TenWeb } from "./tenweb";
import { qk } from "./queries";

export function useAddDomain(siteId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domain: string) => TenWeb.addDomain(siteId, domain),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...qk.site(siteId), "domains"] }),
  });
}

export function useDeleteDomain(siteId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domainId: number) => TenWeb.deleteDomain(siteId, domainId),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...qk.site(siteId), "domains"] }),
  });
}

export function useSetDefaultDomain(siteId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domainId: number) => TenWeb.setDefaultDomain(siteId, domainId),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...qk.site(siteId), "domains"] }),
  });
}
export function useIssueFreeCert(siteId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (domainIds: number[]) => TenWeb.issueFreeCert(siteId, domainIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...qk.site(siteId), "certs"] }),
  });
}

export function useRemoveCertificate(siteId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (certId: number) => TenWeb.removeCertificate(siteId, certId),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...qk.site(siteId), "certs"] }),
  });
}
export function usePurgeCache(siteId: number) {
  return useMutation({ mutationFn: () => TenWeb.purgeCache(siteId) });
}
export function usePasswordProtection(siteId: number) {
  return useMutation({ mutationFn: (action: "enable"|"disable") => TenWeb.passwordProtection(siteId, action) });
}
export function useRunBackup(siteId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => TenWeb.runBackup(siteId),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...qk.site(siteId), "backups"] }),
  });
}
export function useRestoreBackup(siteId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (backupId: number) => TenWeb.restoreBackup(siteId, backupId),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...qk.site(siteId), "backups"] }),
  });
}
export function usePublishPages(siteId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { action: "publish"|"draft"; pageIds: number[] }) => TenWeb.publishPages(siteId, payload.action, payload.pageIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...qk.site(siteId), "pages"] }),
  });
}
export function useSetFrontPage(siteId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pageId: number) => TenWeb.setFrontPage(siteId, pageId),
    onSuccess: () => qc.invalidateQueries({ queryKey: [...qk.site(siteId), "pages"] }),
  });
}