import { useQuery } from "@tanstack/react-query";
import { TenWeb, type Period } from "@/lib/tenweb";

export function useVisitorsSeries(website_id: number, period: Period) {
  return useQuery({
    queryKey: ["visitors", website_id, period],
    queryFn: () => TenWeb.visitors(website_id, period),
    select: (r) => ({
      points: r.data.map((d) => ({ x: d.date, y: d.count })),
      total: r.sum,
      start: r.start_date,
      end: r.end_date,
    }),
  });
}

export function useVisitorsSummary(website_id: number) {
  return useQuery({
    queryKey: ["visitors-summary", website_id],
    queryFn: async () => {
      const [d7, d30, d1] = await Promise.all([
        TenWeb.visitors(website_id, "week"),
        TenWeb.visitors(website_id, "month"),
        TenWeb.visitors(website_id, "day"),
      ]);
      return { day: d1.sum ?? 0, week: d7.sum ?? 0, month: d30.sum ?? 0 };
    },
  });
}