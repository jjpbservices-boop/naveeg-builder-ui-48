tsx
export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-neutral-200/60 dark:bg-neutral-800 ${className}`} />;
}