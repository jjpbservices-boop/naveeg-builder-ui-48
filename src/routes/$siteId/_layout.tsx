// src/routes/$siteId/_layout.tsx
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";

function SiteLayout() {
  const { siteId } = Route.useParams();

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="border-r p-3">
        <nav className="flex flex-col gap-2">
          <Link to="/$siteId/overview" params={{ siteId }}>Overview</Link>
          <Link to="/$siteId/analytics" params={{ siteId }}>Analytics</Link>          <Link to="/$siteId/domains" params={{ siteId }}>Domains</Link>
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
});