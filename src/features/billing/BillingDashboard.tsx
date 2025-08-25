// ============================
// FILE: src/features/billing/BillingDashboard.tsx
// Read-only placeholder: show site list so user knows which plan will apply.
// Replace with your Stripe/DB data as needed.
// ============================
import { useWebsites } from "@/lib/queries";

export default function BillingDashboard() {
  const { data, isLoading, error } = useWebsites();
  if (isLoading) return <div>Loading billing…</div>;
  if (error) return <div>Failed to load sites.</div>;
  const sites = data?.data ?? [];
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Billing</h1>
      <div className="rounded-xl border divide-y">
        {sites.map(s => (
          <div key={s.id} className="p-3">
            <div className="font-medium">{s.site_title}</div>
            <div className="text-xs opacity-70">{s.site_url}</div>
          </div>
        ))}
        {sites.length === 0 && <div className="p-4 text-sm opacity-70">No sites.</div>}
      </div>
    </section>
  );
}