// src/lib/tenweb.ts
import { supabase } from "@/integrations/supabase/client";

type InvokePayload = { path: string; method?: string; body?: unknown };
async function call<T>(payload: InvokePayload): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>("tenweb-proxy", { body: payload });
  if (error) throw error;
  return data as T;
}

export type AccountWebsite = { id: number; site_url: string; site_title: string; admin_url: string; created_at: string };
export type VisitorsPoint = { count: number; date: string };
export type VisitorsResp = { data?: VisitorsPoint[]; sum?: number };
export type DomainItem = { id: number; name: string; default: 0 | 1; site_url: string; created_at: string };
export type Certificate = { id: number; common_name: string; status: string; type: "custom" | "free"; valid_to?: string };
export type BackupItem = { backup_id: number; backup_time: string; type: string; backup_size: number };
export type BuilderPage = { ID: number; title: string; url: string; post_status: "publish"|"draft"; page_on_front?: boolean|null };

// READS
export const TenWeb = {
  getWebsites: () => call<{ data: AccountWebsite[] }>({ path: "/v1/account/websites" }),
  getVisitors: (id: number, period: "day"|"week"|"month"|"year" = "month") =>
    call<VisitorsResp>({ path: `/v1/hosting/websites/${id}/visitors?period=${period}`, method: "GET" }),
  getDomains: (id: number) =>
    call<{ data: DomainItem[] }>({ path: `/v1/hosting/websites/${id}/domain-name`, method: "GET" }),
  getCertificates: (id: number) =>
    call<{ data: Certificate[] }>({ path: `/v1/hosting/websites/${id}/certificate`, method: "GET" }),
  getBackups: (id: number) =>
    call<{ data: BackupItem[] }>({ path: `/v1/hosting/websites/${id}/backup/list`, method: "GET" }),
  getPages: (id: number) =>
    call<{ data: BuilderPage[] }>({ path: `/v1/builder/websites/${id}/pages`, method: "GET" }),

  // MUTATIONS
  addDomain: (id: number, domain: string) =>
    call<{ status: string; data: DomainItem }>({
      path: `/v1/hosting/websites/${id}/domain-name`,
      method: "POST",
      body: { domain_name: domain },
    }),
  setDefaultDomain: (id: number, domainId: number) =>
    call<{ status: string }>({ path: `/v1/hosting/websites/${id}/domain-name/${domainId}/default`, method: "POST" }),
  deleteDomain: (id: number, domainId: number) =>
    call<{ status: string }>({ path: `/v1/hosting/websites/${id}/domain-name/${domainId}`, method: "DELETE" }),
  issueFreeCert: (id: number, domainIds: number[]) =>
    call<{ status: string }>({ path: `/v1/hosting/websites/${id}/certificate/free`, method: "POST", body: { domain_name_ids: domainIds } }),
  removeCertificate: (id: number, certId: number) =>
    call<{ status: string }>({ path: `/v1/hosting/websites/${id}/certificate/${certId}`, method: "DELETE" }),
  purgeCache: (id: number) =>
    call<{ status: string }>({ path: `/v1/hosting/websites/${id}/cache`, method: "DELETE" }),
  passwordProtection: (id: number, action: "enable"|"disable") =>
    call<{ status: string }>({ path: `/v1/hosting/websites/${id}/password-protection`, method: "POST", body: { action } }),
  runBackup: (id: number) =>
    call<{ status: string }>({ path: `/v1/hosting/websites/${id}/backup/run`, method: "POST" }),
  restoreBackup: (id: number, backupId: number) =>
    call<{ status: string }>({ path: `/v1/hosting/websites/${id}/backup/${backupId}/restore`, method: "POST" }),
  publishPages: (id: number, action: "publish"|"draft", pageIds: number[]) =>
    call<{ status: string }>({ path: `/v1/builder/websites/${id}/pages/publish`, method: "POST", body: { action, page_ids: pageIds } }),
  setFrontPage: (id: number, pageId: number) =>
    call<{ status: string }>({ path: `/v1/builder/websites/${id}/pages/front/set`, method: "POST", body: { page_id: pageId } }),
};

// --- Analytics (placeholder using your Edge Function; adjust if your contract differs)

export async function getVisitors(
  websiteId: number,
  period: 'day' | 'week' | 'month' | 'year' = 'week'
): Promise<VisitorsPoint[]> {
  // If your edge function expects a different payload, change body accordingly.
  const { data, error } = await supabase.functions.invoke('tenweb-proxy', {
    body: {
      target: 'analytics.visitors',
      websiteId,
      period,
    },
  });
  if (error) throw error;
  return (data?.points ?? []) as VisitorsPoint[];
}
