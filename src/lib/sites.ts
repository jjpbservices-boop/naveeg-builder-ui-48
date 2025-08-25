import { supabase } from "@/lib/supabase";

export async function upsertSite(row: {
  user_id: string;
  website_id: number;
  site_title?: string;
  subdomain?: string;
  site_url?: string;
  plan?: string | null;
}) {
  const { data, error } = await supabase
    .from("sites")
    .upsert(row, { onConflict: "user_id,website_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}