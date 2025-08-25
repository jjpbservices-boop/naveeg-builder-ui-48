// src/routes/_site.$siteId/analytics.tsx
import React, { Suspense } from "react";

// Code-split the heavy dashboard bundle
const AnalyticsDashboard = React.lazy(() => import("@/features/analytics/AnalyticsDashboard"));

export default function AnalyticsRoute() {
  return (
    <div className="p-6">
      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="h-8 w-48 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-72 w-full rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-48 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-48 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          </div>
        }
      >
        <AnalyticsDashboard />
      </Suspense>
    </div>
  );
}