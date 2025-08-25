// src/routes/$siteId/index.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$siteId/")({
  beforeLoad: async ({ params }) => {
    throw redirect({ to: "/$siteId/overview", params: { siteId: params.siteId } });
  },
});