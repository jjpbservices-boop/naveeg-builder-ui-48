// ============================
// FILE: src/main.tsx
// Wrap app with React Query provider once. Keep your existing Router provider.
// ============================
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import { ToastProvider } from "@/lib/toast";
import i18n from "@/i18n/config"; // Import the i18n instance
import { AppProvider } from "@/context/AppContext";
import { I18nextProvider } from "react-i18next"; // Import I18nextProvider

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <AppProvider>
          <I18nextProvider i18n={i18n}>
            <RouterProvider router={router} />
          </I18nextProvider>
        </AppProvider>
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);