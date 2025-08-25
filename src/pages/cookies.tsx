import { useI18n } from '@/hooks/useI18n';

export default function CookiesPage(){
  const { t } = useI18n();
  return (
    <main className="p-8">
      <h1 className="text-3xl font-semibold">{t("legal.cookies")}</h1>
    </main>
  );
}
