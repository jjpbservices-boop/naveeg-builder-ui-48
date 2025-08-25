import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Role = "admin" | "editor" | "viewer";
const fallback: Role = "viewer";

export function useRole() {
  const [role, setRole] = useState<Role>(fallback);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const metaRole =
        (user?.app_metadata as any)?.role || (user?.user_metadata as any)?.role;
      if (metaRole) { setRole(metaRole as Role); setLoading(false); return; }
      if (user?.id) {
        const { data } = await (supabase as any)
          .from("profiles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data?.role) setRole(data.role as Role);
      }
      setLoading(false);
    })();
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
  return (policy[action] as readonly ("admin" | "editor")[]).includes(role as any);
}