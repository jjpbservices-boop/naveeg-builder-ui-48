import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

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
  component: Marketing,
});

function Marketing() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Naveeg</h1>
      <p className="mt-2 text-sm opacity-70">Digital marketing tools that ship.</p>
    </main>
  );
}