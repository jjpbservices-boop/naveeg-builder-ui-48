// ============================
// FILE: src/lib/queries.ts
// React Query hooks for all sections.
// ============================
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TenWeb } from "./tenweb";

export const qk = {
  websites: ["websites"] as const,
  site: (id: number) => ["site", id] as const,
};

export function useWebsites() {
  return useQuery({ queryKey: qk.websites, queryFn: TenWeb.getWebsites });
}
export function useVisitors(id?: number, period: "day"|"week"|"month"|"year"="month") {
  return useQuery({
    enabled: !!id,
    queryKey: [...qk.site(id ?? 0), "visitors", period],
    queryFn: () => TenWeb.getVisitors(id!, period),
    placeholderData: keepPreviousData,
  });
}
export function useDomains(id?: number) {
  return useQuery({ enabled: !!id, queryKey: [...qk.site(id ?? 0), "domains"], queryFn: () => TenWeb.getDomains(id!) });
}
export function useCertificates(id?: number) {
  return useQuery({ enabled: !!id, queryKey: [...qk.site(id ?? 0), "certs"], queryFn: () => TenWeb.getCertificates(id!) });
}
export function useBackups(id?: number) {
  return useQuery({ enabled: !!id, queryKey: [...qk.site(id ?? 0), "backups"], queryFn: () => TenWeb.getBackups(id!) });
}
export function usePages(id?: number) {
  return useQuery({ enabled: !!id, queryKey: [...qk.site(id ?? 0), "pages"], queryFn: () => TenWeb.getPages(id!) });
}