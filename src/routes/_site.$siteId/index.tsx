import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_site/$siteId/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: `/_site/${params.siteId}/overview` });
  },
});