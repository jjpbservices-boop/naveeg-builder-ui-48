import { ReactNode } from "react";

export default function StatCard({
  label,
  value,
  hint,
  action,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border p-4 flex items-start justify-between bg-background">
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
        {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
      </div>
      {action}
    </div>
  );
}