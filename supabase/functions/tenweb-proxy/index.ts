// supabase/functions/tenweb-proxy/index.ts
// @ts-nocheck
import "https://deno.land/x/xhr@0.4.0/mod.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

type Role = "admin" | "editor" | "viewer";

const TENWEB_API_BASE = Deno.env.get("TENWEB_API_BASE") ?? "https://api.10web.io";
const TENWEB_API_KEY  = Deno.env.get("TENWEB_API_KEY")  ?? "";
const SB_URL  = Deno.env.get("SUPABASE_URL")!;
const SB_ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SB_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); // for audit insert

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors() });

  try {
    const userClient = createClient(SB_URL, SB_ANON, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    // parse payload
    const url = new URL(req.url);
    let path   = url.searchParams.get("path") ?? "";
    let method = (url.searchParams.get("method") ?? "GET").toUpperCase();
    let body: unknown = undefined;
    if (!path) {
      const j = await safeJson(req);
      path = j?.path ?? "";
      method = (j?.method ?? "GET").toUpperCase();
      body = j?.body;
    }
    if (!path || !path.startsWith("/v1/")) return json({ error: "Invalid path" }, 400);

    // get role
    const role = await getRole(userClient, user.id, (user.app_metadata as any)?.role as Role | undefined);

    // authorize
    const need = requiredRole(path, method);
    if (need && !isAllowed(role, need)) {
      return json({ error: "Forbidden" }, 403);
    }

    // forward
    const upstream = await fetch(`${TENWEB_API_BASE}${path}`, {
      method,
      headers: { "x-api-key": TENWEB_API_KEY, "content-type": "application/json" },
      body: hasBody(method) ? JSON.stringify(body ?? (await safeJson(req))) : undefined,
    });

    const ct = upstream.headers.get("content-type") ?? "application/json";
    const payload = ct.includes("application/json") ? await upstream.json() : await upstream.text();

    // audit (best effort)
    try {
      if (SB_SERVICE) {
        const admin = createClient(SB_URL, SB_SERVICE);
        await admin.from("action_logs").insert({
          user_id: user.id,
          method,
          path,
          status: upstream.status,
          role,
        });
      }
    } catch { /* ignore */ }

    return new Response(ct.includes("application/json") ? JSON.stringify(payload) : String(payload), {
      status: upstream.status,
      headers: { "content-type": ct, ...cors() },
    });
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 500);
  }
});

function cors() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "access-control-allow-headers": "authorization, content-type, x-client",
  };
}
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...cors() } });
}
async function safeJson(req: Request) { try { return await req.json(); } catch { return undefined; } }
function hasBody(m: string) { return ["POST","PUT","PATCH","DELETE"].includes(m); }

async function getRole(client: ReturnType<typeof createClient>, userId: string, metaRole?: Role) {
  if (metaRole) return metaRole;
  const { data } = await client.from("profiles").select("role").eq("user_id", userId).maybeSingle();
  return (data?.role as Role) ?? "viewer";
}

type Need = "admin" | "editor";
function isAllowed(role: Role, need: Need) {
  if (need === "editor") return role === "admin" || role === "editor";
  return role === "admin";
}

// Map TenWeb endpoints to required roles
function requiredRole(path: string, method: string): Need | null {
  // domains
  if (path.match(/\/domain-name\/\d+\/default$/) && method === "POST") return "editor";
  if (path.match(/\/domain-name$/) && method === "POST") return "editor";
  if (path.match(/\/domain-name\/\d+$/) && method === "DELETE") return "admin";
  // ssl
  if (path.endsWith("/certificate/free") && method === "POST") return "editor";
  if (path.match(/\/certificate\/\d+$/) && method === "DELETE") return "admin";
  // cache/password
  if (path.endsWith("/cache") && method === "DELETE") return "editor";
  if (path.endsWith("/password-protection") && method === "POST") return "admin";
  // backups
  if (path.endsWith("/backup/run") && method === "POST") return "editor";
  if (path.match(/\/backup\/\d+\/restore$/) && method === "POST") return "admin";
  // pages
  if (path.endsWith("/pages/publish") && method === "POST") return "editor";
  if (path.endsWith("/pages/front/set") && method === "POST") return "editor";
  // reads are allowed
  return null;
}