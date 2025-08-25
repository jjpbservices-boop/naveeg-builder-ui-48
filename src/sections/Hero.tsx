import { useI18n } from '@/hooks/useI18n';

export function Hero(){
  const { t } = useI18n();
  const track = () => {
    // Define a type that includes the analytics object
    type CustomWindow = Window & typeof globalThis & { analytics?: { track: (event: string) => void } };
    if(localStorage.getItem('cookieConsent') === 'accept'){
      // Cast window to the custom type
      (window as CustomWindow).analytics?.track('hero_cta_click');
    }
  };
  return (
    <section className="bg-[var(--bg)] text-[var(--fg)]">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-6 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">{t("hero.title")}</h1>
          <p className="mt-4 text-lg text-[var(--muted)]">{t("hero.subtitle")}</p>
          <div className="mt-8 flex gap-3">
            <a href="/signup" aria-label={t("hero.ctaPrimary")} onClick={track} className="btn btn-lg rounded-xl px-6 py-3 bg-[var(--brand)] text-[var(--brand-contrast)]">{t("hero.ctaPrimary")}</a>
            <a href="#pricing" aria-label={t("hero.ctaSecondary")} className="btn btn-lg rounded-xl px-6 py-3 border border-[var(--border)]">{t("hero.ctaSecondary")}</a>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--card)]">
          {/* Replace with product mockup image */}
          <div className="aspect-video rounded-lg bg-neutral-100 dark:bg-neutral-800" />
        </div>
      </div>
    </section>
  );
}
