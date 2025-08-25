// src/lib/tenweb.ts
export type Period = "day" | "week" | "month" | "year";
export type AccountWebsite = { id: number; site_url: string; site_title: string; admin_url: string; created_at: string };
export type VisitorsPoint = { count: number; date: string };
export type VisitorsResp = { data?: VisitorsPoint[]; sum?: number };
export type DomainsResp = { data: Array<{ default: 0 | 1; name: string; site_url: string }> };
export type SettingsResp = { status: "ok"; data: { staging_enabled: boolean; php_version: string } };

// READS
export const TenWeb = {
 visitors(website_id: number, period: Period = "month") {
    return tw<VisitorsResp>(`/v1/hosting/websites/${website_id}/visitors?period=${period}`);
 },
 domains(website_id: number) {
 return tw<DomainsResp>(`/v1/hosting/websites/${website_id}/domain-name`);
 },
 settings(website_id: number) {
 return tw<SettingsResp>(`/v1/hosting/websites/${website_id}/settings`);
 },
};

async function tw<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/tenweb${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    credentials: "include",
  });
  if (!res.ok) throw new Error(`10Web ${res.status}`);
  return res.json() as Promise<T>;
}
