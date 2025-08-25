// src/routes/__root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";
export const Route = createRootRoute({
  component: () => <Outlet />,
  errorComponent: ({ error }) => (
    <div className="p-4 text-red-600 text-sm">Error: {String(error)}</div>
  ),
});