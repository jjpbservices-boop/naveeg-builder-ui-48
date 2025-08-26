import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// optional: import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./router";
import "./index.css";
import "./styles/tokens.css";
import "./i18n/config";

const queryClient = new QueryClient();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((rs) =>
    rs.forEach((r) => r.unregister())
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);