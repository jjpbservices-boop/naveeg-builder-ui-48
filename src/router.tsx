import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function NotFound() {
  return <div className="p-6">Page not found</div>;
}

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}