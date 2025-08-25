import { useI18n } from '@/hooks/useI18n';

export function FAQ(){
  const { t } = useI18n();
  const items = [1,2,3,4,5];
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold">{t("faq.title")}</h2>
        <div className="mt-8 space-y-4">
          {items.map(i=>(
            <details key={i} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <summary aria-label={t(`faq.q${i}`)} className="cursor-pointer font-medium">{t(`faq.q${i}`)}</summary>
              <p className="mt-2">{t(`faq.a${i}`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
