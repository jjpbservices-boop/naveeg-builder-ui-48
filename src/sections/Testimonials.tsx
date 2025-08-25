import { useI18n } from '@/hooks/useI18n';

export function Testimonials(){
  const { t } = useI18n();
  return (
    <section className="py-16 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold">{t("socialProof.title")}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <figure className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <blockquote>{t("socialProof.t1")}</blockquote>
            <figcaption className="mt-3 text-sm text-[var(--muted)]">— Placeholder</figcaption>
          </figure>
          <figure className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <blockquote>{t("socialProof.t2")}</blockquote>
            <figcaption className="mt-3 text-sm text-[var(--muted)]">— Placeholder</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
