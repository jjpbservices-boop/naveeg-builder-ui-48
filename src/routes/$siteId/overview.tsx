// src/routes/$siteId/overview.tsx
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { tenweb, useVisitors, useDomains } from "@/lib/queries"; // align with your SDK

export const Route = createFileRoute("/$siteId/overview")({
  loader: async ({ params }) => {
    const site = await tenweb.getSite(params.siteId); // define in SDK
    if (!site) throw redirect({ to: "/" });
    return { site };
  },
  component: Overview,
});

function Overview() {
  const { siteId } = Route.useParams();
  const { data: visitors } = useVisitors(siteId);
  const { data: domains } = useDomains(siteId);

  return (
    <div>
      <h1>Site {siteId}</h1>
      <div>Visitors: {visitors?.sum ?? 0}</div>
      <div>Domains: {domains?.length ?? 0}</div>
    </div>
  );
}