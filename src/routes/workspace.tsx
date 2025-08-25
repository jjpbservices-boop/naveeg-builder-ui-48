import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

function Workspace() {
  const nav = useNavigate();
  const [manualId, setManualId] = useState("");

  const sitesQ = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("website_id,title,updated_at")
        .order("updated_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Workspace</h1>

      <div className="flex gap-2">
        <input
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
          placeholder="Site ID"
          className="border rounded px-3 py-2"
        />
        <button
          className="border rounded px-3 py-2"
          onClick={() => manualId && nav({ to: `/${manualId}/overview` })}
        >
          Open
        </button>
      </div>

      {sitesQ.isLoading ? (
        <div className="h-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      ) : (
        <ul className="divide-y">
          {sitesQ.data?.map((s: any) => (
            <li key={s.website_id} className="py-2 flex justify-between">
              <div>
                <div className="font-medium">{s.title || `Site ${s.website_id}`}</div>
                <div className="text-xs opacity-60">ID {s.website_id}</div>
              </div>
              <Link to={`/${s.website_id}/overview`} className="underline">
                Open
              </Link>
            </li>
          ))}
          {sitesQ.data?.length === 0 && (
            <li className="py-2 text-sm opacity-70">No sites yet.</li>
          )}
        </ul>
      )}
    </div>
  );
}

export const Route = createFileRoute("/workspace")({
  component: Workspace,
});