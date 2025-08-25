// src/features/builder/PagesPanel.tsx
import { useParams } from "@tanstack/react-router";
import { usePages } from "@/lib/queries";
import { usePublishPages, useSetFrontPage } from "@/lib/mutations";
import { useMemo, useState } from "react";
import { useToast } from "@/lib/toast";
import { mapError } from "@/lib/errorMap";
import { useRole, can } from "@/lib/roles";
import { useTranslation } from "react-i18next";
import Skeleton from "@/components/Skeleton";

export default function PagesPanel() {
  const { siteId } = useParams({ from: "/dashboard/$siteId/pages" });
  const id = Number(siteId);
  const { role, loading: roleLoading } = useRole();
  const pagesQ = usePages(id);
  const publish = usePublishPages(id);
  const setFront = useSetFrontPage(id);
  const { push } = useToast();
  const { t } = useTranslation(["dashboard"]);

  const [selected, setSelected] = useState<number[]>([]);
  if (roleLoading || pagesQ.isLoading) return <Skeleton className="h-48" />;
  if (pagesQ.error) return <div>Failed to load pages.</div>;

  const pages = pagesQ.data?.data ?? [];
  const canBulk = selected.length > 0;
  const canPublish = can("pages.publish", role);
  const canSetFront = can("pages.setFront", role);

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Pages</h1>

      <div className="flex gap-2">
        <button
          className="rounded border px-3 py-2"
          onClick={() =>
            publish.mutate(
              { action: "publish", pageIds: selected },
              {
                onSuccess: () => {
                  push({ title: t("dashboard:toasts.pages.published"), kind: "success" });
                  pagesQ.refetch();
                },
                onError: (e) => push({ title: mapError(e), kind: "error" }),
              },
            )
          }
          disabled={!canBulk || publish.isPending || !canPublish}
        >
          {publish.isPending ? "Publishing…" : "Publish selected"}
        </button>
        <button
          className="rounded border px-3 py-2"
          onClick={() =>
            publish.mutate(
              { action: "draft", pageIds: selected },
              {
                onSuccess: () => {
                  push({ title: t("dashboard:toasts.pages.drafted"), kind: "success" });
                  pagesQ.refetch();
                },
                onError: (e) => push({ title: mapError(e), kind: "error" }),
              },
            )
          }
          disabled={!canBulk || publish.isPending || !canPublish}
        >
          {publish.isPending ? "Saving…" : "Move selected to draft"}
        </button>
      </div>

      <div className="rounded-xl border divide-y">
        {pages.map((p) => {
          const checked = selected.includes(p.ID);
          return (
            <div key={p.ID} className="p-3 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    setSelected((prev) => (e.target.checked ? [...prev, p.ID] : prev.filter((x) => x !== p.ID)))
                  }
                />
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs opacity-70">{p.url}</div>
                </div>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800">
                  {p.page_on_front ? "front" : p.post_status}
                </span>
                {!p.page_on_front && (
                  <button
                    className="text-xs px-2 py-1 rounded border"
                    onClick={() =>
                      setFront.mutate(p.ID, {
                        onSuccess: () => {
                          push({ title: t("dashboard:toasts.pages.front"), kind: "success" });
                          pagesQ.refetch();
                        },
                        onError: (e) => push({ title: mapError(e), kind: "error" }),
                      })
                    }
                    disabled={setFront.isPending || !canSetFront}
                  >
                    {setFront.isPending ? "Setting…" : "Set front"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {pages.length === 0 && <div className="p-4 text-sm opacity-70">No pages.</div>}
      </div>
    </section>
  );
}