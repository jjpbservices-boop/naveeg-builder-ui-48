import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/$siteId/analytics")({
  component: () => {
  const { siteId } = Route.useParams();
    return <div>Analytics OK for site {siteId}</div>;
  },
});