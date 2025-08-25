import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MySite = {
  id: number;
  website_id: number;
  title: string | null;
  site_url: string | null;
  created_at: string;
};

export function useMySites() {
  return useQuery<MySite[]>({
    queryKey: ["mySites"],
    queryFn: async (): Promise<MySite[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("sites")
        .select("id, website_id, title, site_url, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter bad rows, coerce "null" strings, and return one latest row per website_id
      const rows = (data ?? []).filter((r: any) => Number.isFinite(r.website_id));
      const byWebsite = new Map<number, MySite>();

      for (const r of rows) {
        const cleanedTitle =
          r.title && `${r.title}`.toLowerCase() !== 'null' ? (r.title as string) : null;

        const candidate: MySite = {
          ...r,
          title: cleanedTitle,
        };

        const prev = byWebsite.get(r.website_id);
        if (!prev || new Date(candidate.created_at) > new Date(prev.created_at)) {
          byWebsite.set(r.website_id, candidate);
        }
      }

      return Array.from(byWebsite.values());
    },
    staleTime: 30_000,
  });
}