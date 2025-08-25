// src/routes/_site.$siteId/overview.tsx
import { useParams, Link, createFileRoute } from "@tanstack/react-router";
import { useVisitorsSummary } from "../../hooks/useVisitors";
import { useQuery } from "@tanstack/react-query";
import { TenWeb } from "../../lib/tenweb";
import { useTranslation } from 'react-i18next';

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 rounded-2xl border">
      <div className="text-xs opacity-60">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function OverviewRoute() {
  const { siteId } = useParams({ from: "/_site/$siteId/overview" });
  const id = Number(siteId);
  const { t } = useTranslation("dashboard");

  const { data: visits } = useVisitorsSummary(id);
  const { data: domains } = useQuery({
    queryKey: ["domains", id],
    queryFn: () => TenWeb.domains(id),
    select: (domains) => {
      const def = domains.find(d => d.default === 1);
      return { defaultDomain: def?.name, hasCustom: domains.some(d => !d.name.endsWith(".10web.club")) };
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["settings", id],
    queryFn: () => TenWeb.settings(id)
  });

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi label={t("visitors_today")} value={visits?.day ?? 0} />
        <Kpi label={t("visitors_7d")} value={visits?.week ?? 0} />
        <Kpi label={t("visitors_30d")} value={visits?.month ?? 0} />
        <Kpi label={t("default_domain")} value={domains?.defaultDomain ?? "—"} />
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl border">
          <div className="font-medium mb-2">{t("domains")}</div>
          <p className="text-sm mb-3">{domains?.hasCustom ? t("custom_domain_connected") : t("using_subdomain")}</p>
          <Link to={`/_site/${siteId}/domains`} className="text-sm underline">{t("manage_domains", { ns: "common" })}</Link>
        </div>

        <div className="p-4 rounded-2xl border">
          <div className="font-medium mb-2">{t("security")}</div>
          <p className="text-sm mb-3">Staging: {settings?.staging_enabled ? t("enabled", { ns: "common" }) : t("disabled", { ns: "common" })}</p>
          <Link to={`/_site/${siteId}/security`} className="text-sm underline">{t("backups_restore", { ns: "common" })}</Link>
        </div>

        <div className="p-4 rounded-2xl border">
          <div className="font-medium mb-2">{t("billing")}</div>
          <p className="text-sm mb-3">{t("plan_info_here")}</p>
          <Link to={`/_site/${siteId}/billing`} className="text-sm underline">{t("open_billing", { ns: "common" })}</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile to="/_site/$siteId/analytics" siteId={siteId} label={t("view_analytics")}  />
        <Tile to="/_site/$siteId/pages" siteId={siteId} label={t("manage_pages")}  />
        <Tile to="/_site/$siteId/domains" siteId={siteId} label={t("connect_domain")}  />
        <Tile to="/_site/$siteId/security" siteId={siteId} label={t("run_backup")}  />
      </div>
    </div>
  );
}

function Tile({ to, siteId, label }: { to: string; siteId: string; label: string }) {
  return (
    <Link to={to} params={{ siteId }} className="p-4 rounded-2xl border hover:bg-neutral-50 dark:hover:bg-neutral-900">
      <div className="text-sm">{label}</div>
    </Link>
  );
}

export const Route = createFileRoute("/_site/$siteId/overview")({
  component: OverviewRoute,
});
