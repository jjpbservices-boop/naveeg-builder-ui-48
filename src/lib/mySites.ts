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
      const { data, error } = await (supabase as any)
        .from("sites")
        .select("id, website_id, title, site_url, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MySite[];
    },
    staleTime: 30_000,
  });
}