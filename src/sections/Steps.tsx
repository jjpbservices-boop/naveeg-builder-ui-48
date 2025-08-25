import { useI18n } from '@/hooks/useI18n';

export function Steps(){
  const { t } = useI18n();
  const items = [t("steps.s1"), t("steps.s2"), t("steps.s3"), t("steps.s4")];
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold">{t("steps.title")}</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((label, i)=>(
            <li key={i} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-[var(--brand-contrast)] font-bold">{i+1}</span>
              <p className="mt-3">{label}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
