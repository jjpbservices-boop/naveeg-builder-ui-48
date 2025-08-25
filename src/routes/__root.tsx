import { createRootRoute, Outlet } from "@tanstack/react-router";

function NotFound() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-sm opacity-70">The URL doesn’t match any page.</p>
    </div>
  );
}

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFound,
});