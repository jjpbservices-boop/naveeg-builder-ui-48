// src/routes/$siteId/_layout.tsx
import { createFileRoute, Outlet, Link, useParams } from "@tanstack/react-router";

function SiteLayout() {
  const { siteId } = useParams({ from: "/$siteId/_layout" });

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="border-r p-3">
        <nav className="flex flex-col gap-2">
          <Link to="/$siteId/overview" from="/$siteId/_layout" params={{ siteId }} preload="intent">Overview</Link>
          <Link to="/$siteId/analytics" from="/$siteId/_layout" params={{ siteId }}>Analytics</Link>
          <Link to="/$siteId/domains"   from="/$siteId/_layout" params={{ siteId }}>Domains</Link>
          <Link to="/$siteId/security"  from="/$siteId/_layout" params={{ siteId }}>Security</Link>
          <Link to="/$siteId/billing"   from="/$siteId/_layout" params={{ siteId }}>Billing</Link>
          <Link to="/$siteId/pages"     from="/$siteId/_layout" params={{ siteId }}>Pages</Link>
        </nav>
      </aside>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createFileRoute("/$siteId/_layout")({
  component: SiteLayout,
  notFoundComponent: () => <div className="p-6 text-sm">Section not found.</div>,
});