import { useI18n } from '@/hooks/useI18n';

export function FinalCTA(){
  const { t } = useI18n();
  return (
    <section className="py-16 bg-[var(--bg)] text-center">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold">{t("ctaFinal.title")}</h2>
        <p className="mt-4 text-lg text-[var(--muted)]">{t("ctaFinal.subtitle")}</p>
        <a href="/signup" aria-label={t("ctaFinal.cta")} className="mt-8 inline-block rounded-xl bg-[var(--brand)] px-6 py-3 text-[var(--brand-contrast)]">{t("ctaFinal.cta")}</a>
      </div>
    </section>
  );
}
