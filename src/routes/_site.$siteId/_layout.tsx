import { useRouter, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useEnsureSite() {
  const { siteId } = useParams({ from: "/_site/$siteId" as never });
  const router = useRouter();

  return useQuery({
    queryKey: ["site-exists", siteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("website_id, title")
        .eq("website_id", Number(siteId))
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        toast.error("Site not found");
        router.navigate({ to: "/workspace" });
        throw new Error("redirect");
      }
      return data;
    },
  });
}