// Works with your proxy: /api/tenweb -> 10Web API
// If you want direct calls, set VITE_TENWEB_BASE_URL + VITE_TENWEB_API_KEY and flip BASE below.

const BASE = "/api/tenweb"; // or: import.meta.env.VITE_TENWEB_BASE_URL ?? "/api/tenweb";
const AUTH_HEADERS =
  import.meta.env.VITE_TENWEB_API_KEY
    ? { "x-api-key": import.meta.env.VITE_TENWEB_API_KEY }
    : {}; // proxy usually injects auth

type Period = "day" | "week" | "month" | "year";

// Minimal shapes to unblock usage now.
// Swap these with OpenAPI types later (one edit).
export type VisitorsPoint = { date: string; count: number };
export type VisitorsResp = {
  status?: "ok" | "error";
  data?: VisitorsPoint[];
  start_date?: string;
  end_date?: string;
  sum?: number;
};

export type DomainsResp = { data: DomainItem[] }; // replace previous

export type SettingsResp = {
  status: "ok" | "error";
  data: { staging_enabled: boolean; php_version: string };
};

export type BackupListResp = {
  status: "ok" | "error";
  data: Array<{ id: number; created_at: string; type: string }>;
};

export type GenericOk = { status: "ok" | "error"; message?: string };
export type DomainItem = {
  id: number; name: string; site_url: string; default: 0|1; admin_url?: string; scheme?: "http"|"https";
};

export type PageData = {
  id: number;
  title: string;
  status: string;
  updated_at: string;
}


async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...AUTH_HEADERS,
      ...(init?.headers || {}),
    },
    credentials: "include",
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`10Web ${res.status} ${msg}`);
  }
  return res.json() as Promise<T>;
}

export class TenWebClient {
  /** Visitors time series */
  getVisitors(websiteId: number, period: Period = "month") {
    return request<VisitorsResp>(`/v1/hosting/websites/${websiteId}/visitors?period=${period}`);
  }

  /** Visitors time series (alias) */
  visitors(websiteId: number, period: Period = "month") {
    return request<VisitorsResp>(`/v1/hosting/websites/${websiteId}/visitors?period=${period}`);
  }

  /** Domains list (default + custom) */
  getDomains(websiteId: number) {
    return request<DomainsResp>(`/v1/hosting/websites/${websiteId}/domain-name`);
  }

  /** Site settings/staging info */
  getSettings(websiteId: number) {
    return request<SettingsResp>(`/v1/hosting/websites/${websiteId}/settings`);
  }

  /** SSL issue/renew */
  issueSSL(websiteId: number) {
    return request<GenericOk>(`/v1/hosting/websites/${websiteId}/certificates/issue`, { method: "POST" });
  }
  renewSSL(websiteId: number) {
    return request<GenericOk>(`/v1/hosting/websites/${websiteId}/certificates/renew`, { method: "POST" });
  }

  /** Cache purge */
  purgeCache(websiteId: number, recache: 0|1 = 0) {
    return request<{ status: "ok" | "error" }>(`/v1/hosting/websites/${websiteId}/cache`, { method: "DELETE", body: JSON.stringify({ recache }) });
  }

  /** Backups */
  listBackups(websiteId: number) {
    return request<BackupListResp>(`/v1/hosting/websites/${websiteId}/backups`);
  }
  runBackup(websiteId: number) {
    return request<GenericOk>(`/v1/hosting/websites/${websiteId}/backups/run`, { method: "POST" });
  }
  restoreBackup(websiteId: number, backupId: number) {
    return request<GenericOk>(`/v1/hosting/websites/${websiteId}/backups/${backupId}/restore`, { method: "POST" });
  }

  /** Builder pages (read-only for now) */
  listPages(websiteId: number) {
    return request<{ data: PageData[] }>(
      `/v1/builder/websites/${websiteId}/pages`
    );
  }

  setDefaultDomain(websiteId: number, domainNameId: number) {
    return request<{ status: "ok" | "error"; message?: string }>(`/v1/hosting/websites/${websiteId}/domain-name/${domainNameId}/default`, { method: "POST" });
  }

  generateFreeCertificate(websiteId: number, domainNameIds: number[], redirect_http: 0|1 = 1) {
    return request<{ status: "ok" | "error" }>(`/v1/hosting/websites/${websiteId}/certificate/free`, { method: "POST", body: JSON.stringify({ domain_name_ids: domainNameIds, redirect_http }) });
  }
}

export const tenweb = new TenWebClient();

// Optional: legacy exports for existing imports
export const getVisitors = (id: number, period: Period = "month") => tenweb.getVisitors(id, period);
export type { Period };