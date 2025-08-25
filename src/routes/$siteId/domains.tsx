import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$siteId/domains")({
  component: () => {
    const { siteId } = Route.useParams();
    return (
      <div>
        Domains OK for site {siteId}
      </div>
    );
  },
});