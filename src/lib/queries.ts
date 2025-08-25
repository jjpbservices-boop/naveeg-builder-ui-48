import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TenWebClient, type DomainItem } from "@/lib/tenweb-client";

export type Period = "day" | "week" | "month" | "year";
export type SeriesPoint = { date: string; value: number };

const tw = new TenWebClient();

export const qk = {
  visitors: (siteId: number, period: Period = "month") =>
    ["tenweb", "visitors", siteId, period] as const,
  domains: (siteId: number) => ["tenweb", "domains", siteId] as const,
};

export function useVisitors(siteId?: number, period: Period = "month") {
  return useQuery<SeriesPoint[], Error>({
    enabled: !!siteId,
    queryKey: qk.visitors(Number(siteId), period),
    queryFn: async () => {
      const res: any = await tw.getVisitors(Number(siteId), period);
      const rows = res?.data ?? [];
      return (rows as Array<{ date: string; count: number }>).map((r) => ({
        date: r.date,
        value: r.count,
      }));
    },
    placeholderData: keepPreviousData,
  });
}

export function useDomains(siteId?: number) {
  return useQuery<DomainItem[], Error>({
    enabled: !!siteId,
    queryKey: qk.domains(Number(siteId)),
    queryFn: async () => {
      const res = await tw.getDomains(Number(siteId));
      return res.data ?? [];
    },
    placeholderData: keepPreviousData,
  });
}