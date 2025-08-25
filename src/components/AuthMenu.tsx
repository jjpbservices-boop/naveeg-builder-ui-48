import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export default function AuthMenu() {
  const [user, setUser] = useState<null | { email?: string }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <Link to="/auth" className="px-3 py-2 text-sm rounded-lg border hover:bg-neutral-50 dark:hover:bg-neutral-900">
 Log in
      </Link>
    );
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/workspace" className="px-3 py-2 text-sm rounded-lg border hover:bg-neutral-50 dark:hover:bg-neutral-900">
 Dashboard
      </Link>
      <button onClick={logout} className="px-3 py-2 text-sm rounded-lg border hover:bg-neutral-50 dark:hover:bg-neutral-900">
 Log out
      </button>
    </div>
  );
}