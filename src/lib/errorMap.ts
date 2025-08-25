ts
export function mapError(err: unknown): string {
  const msg = getMsg(err);
  if (/401|unauthorized/i.test(msg)) return "Unauthorized.";
  if (/403|forbidden/i.test(msg)) return "Forbidden.";
  if (/404/i.test(msg)) return "Not found.";
  if (/409/i.test(msg)) return "Conflict.";
  if (/429|rate/i.test(msg)) return "Rate limited. Try again.";
  if (/certificate/i.test(msg)) return "SSL operation failed.";
  if (/domain/i.test(msg)) return "Domain operation failed.";
  return "Operation failed.";
}
function getMsg(e: unknown) {
  if (!e) return "";
  // Supabase Functions errors often carry .message
  if (typeof e === "string") return e;
  const any = e as any;
  return any?.message ?? JSON.stringify(any);
}