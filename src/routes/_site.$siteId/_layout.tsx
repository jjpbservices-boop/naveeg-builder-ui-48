// src/routes/_site.$siteId/_layout.tsx
import { createFileRoute, Outlet, Link, useParams } from "@tanstack/react-router";

function SiteLayout() {
  const { siteId } = useParams({ from: "/_site/$siteId/_layout" });

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="border-r p-3">
        <nav className="flex flex-col gap-2">
          <Link to="/_site/$siteId/overview" from="/_site/$siteId/_layout" params={{ siteId }} preload="intent">Overview</Link>
          <Link to="/_site/$siteId/analytics" from="/_site/$siteId/_layout" params={{ siteId }}>Analytics</Link>
          <Link to="/_site/$siteId/domains"   from="/_site/$siteId/_layout" params={{ siteId }}>Domains</Link>
          <Link to="/_site/$siteId/security"  from="/_site/$siteId/_layout" params={{ siteId }}>Security</Link>
          <Link to="/_site/$siteId/billing"   from="/_site/$siteId/_layout" params={{ siteId }}>Billing</Link>
          <Link to="/_site/$siteId/pages"     from="/_site/$siteId/_layout" params={{ siteId }}>Pages</Link>
        </nav>
      </aside>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createFileRoute("/_site/$siteId/_layout")({
  component: SiteLayout,
  notFoundComponent: () => <div className="p-6 text-sm">Section not found.</div>,
});