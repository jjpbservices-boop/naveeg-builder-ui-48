import { createFileRoute } from "@tanstack/react-router";
import PagesPanel from "@/features/builder/PagesPanel";

export const Route = createFileRoute("/_site/$siteId/pages")({
  component: PagesPanel,
});