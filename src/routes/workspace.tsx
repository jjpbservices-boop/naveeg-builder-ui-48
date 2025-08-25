// src/routes/workspace.tsx
import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/workspace")({
  component: Workspace,
});

type WebsiteRow = {
  website_id?: number | null;
  id?: number | null;
  title?: string | null;
  site_url?: string | null;
  updated_at?: string | null;
};

type Website = {
  website_id: number;
  title?: string | null;
  site_url?: string | null;
  updated_at?: string | null;
};

async function fetchSites(): Promise<Website[]> {
  const { data, error } = await supabase
    .from("sites")
    .select("website_id,id,title,site_url,updated_at")
    .order("updated_at", { ascending: false })
    .limit(20);

  if (error) throw error;

  const rows: WebsiteRow[] = data ?? [];
  return rows
    .map((r) => {
      const wid = r.website_id ?? r.id;
      if (wid == null) return null;
      return {
        website_id: wid,
        title: r.title ?? null,
        site_url: r.site_url ?? null,
        updated_at: r.updated_at ?? null,
      } as Website;
    })
    .filter(Boolean) as Website[];
}

function Workspace() {
  const nav = useNavigate();
  const [manualId, setManualId] = useState<string>("");

  const sitesQ = useQuery<Website[]>({
    queryKey: ["sites"],
    queryFn: fetchSites,
    retry: 1,
    staleTime: 30_000,
    gcTime: 300_000,
  });

  const openManual = () => {
    const id = manualId.trim();
    if (!id) return;
    nav({ to: "/$siteId/overview", params: { siteId: id } });
  };

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Workspace</h1>
      </header>

      <section className="flex gap-2 items-end">
        <div className="flex flex-col">
          <label htmlFor="manualId" className="text-sm opacity-70">
            Open by Site ID
          </label>
          <input
            id="manualId"
            type="text"
            value={manualId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setManualId(e.target.value)
            }
            placeholder="e.g. 123456"
            className="border rounded px-3 py-2 w-56"
          />
        </div>
        <button
          className="border rounded px-3 py-2"
          onClick={openManual}
          disabled={!manualId.trim()}
        >
          Open
        </button>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Your sites</h2>

        {sitesQ.isLoading ? (
          <div className="h-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        ) : sitesQ.isError ? (
          <div className="text-sm text-red-600">Failed to load sites.</div>
        ) : (
          <ul className="divide-y">
            {(sitesQ.data ?? []).map((s: Website) => (
              <li
                key={s.website_id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {s.title || `Site ${s.website_id}`}
                  </div>
                  <div className="text-xs opacity-60">
                    ID {s.website_id}
                    {s.site_url ? ` • ${s.site_url}` : ""}
                  </div>
                </div>
                <Link
                  to="/$siteId/overview"
                  params={{ siteId: String(s.website_id) }}
                  className="underline"
                >
                  Open
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}