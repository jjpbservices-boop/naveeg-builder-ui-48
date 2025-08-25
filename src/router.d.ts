import type { router } from "./router";

declare module "@tanstack/react-router" {
  // biome-ignore lint/complexity/noStaticOnlyClass: This is a module augmentation
  interface Register {
    router: typeof router;
  }
}