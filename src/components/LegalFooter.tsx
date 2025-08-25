import { useI18n } from '@/hooks/useI18n';

export function LegalFooter(){
  const { t } = useI18n();
  return (
    <footer className="py-6 text-sm text-center text-[var(--muted)]">
      <div className="flex justify-center gap-4">
        <a href="/privacy" aria-label={t("legal.privacy")} className="hover:underline">{t("legal.privacy")}</a>
        <a href="/terms" aria-label={t("legal.terms")} className="hover:underline">{t("legal.terms")}</a>
        <a href="/cookies" aria-label={t("legal.cookies")} className="hover:underline">{t("legal.cookies")}</a>
      </div>
    </footer>
  );
}
