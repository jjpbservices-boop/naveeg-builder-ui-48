// src/routes/$siteId/overview.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$siteId/overview")({
  component: () => {
    const { siteId } = Route.useParams();
    return <div>Overview OK for site {siteId}</div>;
  },
});
