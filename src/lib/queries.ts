// src/lib/queries.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TenWebClient, type Period } from "@/lib/tenweb-client";

const tw = new TenWebClient();

export type SeriesPoint = { date: string; value: number };
export type DomainItem = {
  id: number; name: string; site_url: string; default: 0 | 1; admin_url?: string;
};
export type PageItem = { id: number; title: string; status: string; updated_at: string };

export const qk = {
  visitors: (siteId: number, period: Period) => ["tenweb", "visitors", siteId, period] as const,
  domains:  (siteId: number) => ["tenweb", "domains", siteId] as const,
  pages:    (siteId: number) => ["tenweb", "pages", siteId] as const,
};

export function useVisitors(siteId?: number, period: Period = "month") {
  return useQuery<SeriesPoint[], Error>({
    enabled: !!siteId,
    queryKey: qk.visitors(Number(siteId), period),
    queryFn: async () => {
      const r: any = await tw.getVisitors(Number(siteId), period); // {data:[{date,count}]}
      const arr: any[] = r?.data ?? [];
      return arr.map(d => ({ date: String(d.date), value: Number(d.count ?? 0) }));
    },
    placeholderData: keepPreviousData,
  });
}

export function useDomains(siteId?: number) {
  return useQuery<DomainItem[], Error>({
    enabled: !!siteId,
    queryKey: qk.domains(Number(siteId)),
    queryFn: async () => {
      const r: any = await tw.getDomains(Number(siteId)); // {data: DomainItem[]}
      return r?.data ?? [];
    },
    placeholderData: keepPreviousData,
  });
}

export function usePages(siteId?: number) {
  return useQuery<PageItem[], Error>({
    enabled: !!siteId,
    queryKey: qk.pages(Number(siteId)),
    queryFn: async () => {
      const r: any = await tw.listPages(Number(siteId)); // {data: PageItem[]}
      return r?.data ?? [];
    },
    placeholderData: keepPreviousData,
  });
}