// src/components/SiteDashboardLayout.tsx
import { Link, Outlet, useParams } from "@tanstack/react-router";
import { useEnsureSite } from "@/routes/_site.$siteId/_layout";
import { useTranslation } from "react-i18next";

const tabs = [
  { to: "/$siteId/overview", labelKey: "overview" },
  { to: "/$siteId/analytics", labelKey: "analytics" },
  { to: "/$siteId/domains", labelKey: "domains" },
  { to: "/$siteId/security", labelKey: "security" },
  { to: "/$siteId/billing", labelKey: "billing" },
  { to: "/$siteId/pages", labelKey: "pages" },
];

export default function SiteDashboardLayout() {
  const { data, isLoading } = useEnsureSite();
  const { siteId } = useParams({ from: "/$siteId" });
  const { t } = useTranslation("dashboard");

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r bg-neutral-50 dark:bg-neutral-900">
        <div className="p-4 text-sm font-semibold">Site #{siteId}</div>
        <nav className="flex flex-col gap-1 p-2">
          {tabs.map(t => (
            <Link
              key={t.to}
              to={t.to}
              params={{ siteId }}
              className="px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
              activeProps={{ className: "bg-neutral-100 dark:bg-neutral-800" }}
            >
              {t(t.labelKey)}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-4">
        <header className="sticky top-0 z-10 bg-white/70 dark:bg-black/30 backdrop-blur border-b mb-4">
          <div className="px-2 py-3 text-base font-semibold">
            {isLoading ? "Loading…" : data?.site_title || `Site ${siteId}`}
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}