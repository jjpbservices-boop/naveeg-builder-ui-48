import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMySites } from "@/lib/mySites";
import Skeleton from "@/components/Skeleton";
import { useToast } from "@/lib/toast";

export default function Workspace() {
  const { push } = useToast();
  const q = useMySites();

  const [siteId, setSiteId] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  if (q.isLoading) return <Skeleton className="h-40" />;
  if (q.error) return <div className="p-4">Failed to load your sites.</div>;

  const sites = q.data ?? [];

  async function attach() {
    const idNum = Number(siteId);
    if (!Number.isFinite(idNum) || idNum <= 0) {
      push({ title: "Enter a valid numeric site ID.", kind: "error" });
      return;
    }
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      setBusy(false);
      push({ title: "Please log in first.", kind: "error" });
      return;
    }
    const { error } = await (supabase as any)
      .from("sites")
      .insert({ user_id: user.id, website_id: idNum, title: title || null });
    setBusy(false);
    if (error) {
      push({ title: "Could not attach site.", kind: "error" });
    } else {
      setSiteId("");
      setTitle("");
      push({ title: "Site attached.", kind: "success" });
      q.refetch();
    }
  }

  return (
    <section className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Choose a site</h1>
        <Link to="/onboarding/brief" className="px-3 py-2 text-sm border rounded-lg">
          Create a site
        </Link>
      </div>

      {sites.length === 0 ? (
        <div className="rounded-xl border p-6">
          <p className="mb-4 text-sm opacity-80">You have no sites yet.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/onboarding/brief" className="px-3 py-2 text-sm border rounded-lg">
              Start a new site
            </Link>
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <input
                className="flex-1 rounded-lg border px-3 py-2"
                placeholder="Attach by Site ID (e.g., 1334132)"
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
              />
              <input
                className="flex-1 rounded-lg border px-3 py-2"
                placeholder="Optional title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                className="px-3 py-2 text-sm border rounded-lg"
                onClick={attach}
                disabled={busy}
              >
                {busy ? "Attaching…" : "Attach"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((s) => (
            <Link
            key={s.website_id}
            to="/dashboard/$siteId/analytics" // The route path uses $siteId
            params={{ siteId: String(s.website_id) }} // The param key should be siteId (without $)
            className="rounded-xl border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
              <div className="font-medium">{s.title || `Site ${s.website_id}`}</div>
              <div className="text-xs opacity-70">{s.site_url || "—"}</div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}