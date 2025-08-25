import { useEffect, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export default function AuthMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => mounted && setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user?.email ?? null));
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  if (!email) {
    return (
      <Link to="/auth" className="px-3 py-2 text-sm border rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900">
        Log in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/workspace"
        className="px-3 py-2 text-sm border rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900"
      >
        Dashboard
      </Link>
      <button
        className="px-3 py-2 text-sm border rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900"
        onClick={async () => {
          await supabase.auth.signOut();
          router.navigate({ to: "/" });
        }}
      >
        Log out
      </button>
    </div>
  );
}