import { useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import Skeleton from '@/components/Skeleton';

import { getVisitors, VisitorsPoint } from '@/lib/tenweb';

export default function AnalyticsDashboard() {
  const { siteId } = useParams({ from: '/dashboard/$siteId/analytics' });

  const { data, isLoading, error } = useQuery<VisitorsPoint[]>({
    queryKey: ['analytics', siteId],
    queryFn: () => getVisitors(Number(siteId), 'week'),
    enabled: !!siteId,
    staleTime: 30_000,
  });

  if (isLoading) return <Skeleton className="h-40" />;
  if (error) return <div className="p-4 text-sm text-red-600">Failed to load analytics.</div>;

  const empty = !data || data.length === 0;

  return (
    <section className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Analytics</h1>

      {empty ? (
        <div className="rounded-xl border p-6">
          <p className="text-sm opacity-80">No traffic yet. Come back later.</p>
        </div>
      ) : (
        <div className="rounded-xl border p-6">
          <p className="text-sm opacity-80">Traffic chart coming here.</p>
        </div>
      )}
    </section>
  );
}