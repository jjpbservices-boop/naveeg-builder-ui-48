ts
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Role = "admin" | "editor" | "viewer";
const fallback: Role = "viewer";

export function useRole() {
  const [role, setRole] = useState<Role>(fallback);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user as any;
      const r = (u?.app_metadata?.role || u?.user_metadata?.role) as Role | undefined;
      setRole(r ?? fallback);
      setLoading(false);
    });
  }, []);
  return { role, loading };
}

const policy = {
  "domain.add": ["admin", "editor"],
  "domain.delete": ["admin"],
  "domain.setDefault": ["admin", "editor"],
  "ssl.issueFree": ["admin", "editor"],
  "ssl.remove": ["admin"],
  "cache.purge": ["admin", "editor"],
  "security.password": ["admin"],
  "backup.run": ["admin", "editor"],
  "backup.restore": ["admin"],
  "pages.publish": ["admin", "editor"],
  "pages.setFront": ["admin", "editor"],
} as const;

export function can(action: keyof typeof policy, role: Role) {
  return policy[action].includes(role);
}