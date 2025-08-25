import { useI18n } from '@/hooks/useI18n';

const keys = ["f1","f2","f3","f4","f5","f6","f7","f8"];
export function Features(){
  const { t } = useI18n();
  return (
    <section className="py-16 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold">{t("features.title")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map(k=>(
            <div key={k} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p>{t(`features.${k}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
