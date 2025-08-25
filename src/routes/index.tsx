import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import Home from "@/pages/index";

export const Route = createFileRoute("/")({
  async beforeLoad() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data, error } = await supabase
      .from("sites")
      .select("website_id")
      .order("updated_at", { ascending: false })
      .limit(1);
    const first = !error && data?.[0]?.website_id;
    if (first) throw redirect({ to: `/${data![0].website_id}/overview` });
  },
  component: Home,
});