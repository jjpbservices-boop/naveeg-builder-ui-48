import { useState } from 'react';
import { useI18n } from '@/hooks/useI18n';

type Plan = "starter"|"business"|"enterprise";
const base = { starter:59, business:119 } as const;
const VAT = 0.20;

function price(num:number, yearly:boolean, vat:boolean){
  const m = yearly ? (num*12*0.8) : num; // 20% off yearly
  const v = vat ? m*(1+VAT) : m;
  return yearly ? `€${v.toFixed(2)}/yr` : `€${v.toFixed(2)}/mo`;
}

export function Pricing(){
  const { t } = useI18n();
  const [yearly,setYearly] = useState(false);
  const [vat,setVat] = useState(false);
  const plans:Plan[]=["starter","business","enterprise"];
  const features:Record<Plan,string[]> = {
    starter: t("pricing.starter.features") as unknown as string[],
    business: t("pricing.business.features") as unknown as string[],
    enterprise: t("pricing.enterprise.features") as unknown as string[],
  };
  const track = (plan:Plan) => {
    if(localStorage.getItem('cookieConsent') === 'accept'){
      (window as any).analytics?.track('pricing_cta_click',{ plan, yearly, vat });
    }
  };
  return (
    <section id="pricing" className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold">{t("pricing.title")}</h2>

        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" aria-label={t("pricing.periodToggleYearly")} checked={yearly} onChange={e=>setYearly(e.target.checked)} />
            <span>{t("pricing.periodToggleYearly")}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" aria-label={t("pricing.vatToggle")} checked={vat} onChange={e=>setVat(e.target.checked)} />
            <span>{t("pricing.vatToggle")}</span>
          </label>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Starter */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="text-2xl font-semibold">{t("pricing.starter.name")}</h3>
            <p className="text-[var(--muted)]">{t("pricing.starter.tagline")}</p>
            <p className="mt-4 text-3xl font-bold">
              {price(base.starter, yearly, vat)}
            </p>
            <ul className="mt-4 space-y-2">
              {features.starter.map((f,i)=>(<li key={i}>• {f}</li>))}
            </ul>
            <a href="/signup?plan=starter" aria-label={t("pricing.starter.cta")} onClick={()=>track('starter')} className="mt-6 inline-block rounded-xl bg-[var(--brand)] px-5 py-3 text-[var(--brand-contrast)]">
              {t("pricing.starter.cta")}
            </a>
          </div>

          {/* Business */}
          <div className="rounded-2xl border-2 border-[var(--brand)] bg-[var(--card)] p-6 shadow-lg">
            <h3 className="text-2xl font-semibold">{t("pricing.business.name")}</h3>
            <p className="text-[var(--muted)]">{t("pricing.business.tagline")}</p>
            <p className="mt-4 text-3xl font-bold">
              {price(base.business, yearly, vat)}
            </p>
            <ul className="mt-4 space-y-2">
              {features.business.map((f,i)=>(<li key={i}>• {f}</li>))}
            </ul>
            <a href="/signup?plan=business" aria-label={t("pricing.business.cta")} onClick={()=>track('business')} className="mt-6 inline-block rounded-xl bg-[var(--brand)] px-5 py-3 text-[var(--brand-contrast)]">
              {t("pricing.business.cta")}
            </a>
          </div>

          {/* Enterprise */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="text-2xl font-semibold">{t("pricing.enterprise.name")}</h3>
            <p className="text-[var(--muted)]">{t("pricing.enterprise.tagline")}</p>
            <p className="mt-4 text-3xl font-bold">{t("pricing.enterprise.price")}</p>
            <ul className="mt-4 space-y-2">
              {features.enterprise.map((f,i)=>(<li key={i}>• {f}</li>))}
            </ul>
            <a href="/contact?sales=1" aria-label={t("pricing.enterprise.cta")} onClick={()=>track('enterprise')} className="mt-6 inline-block rounded-xl border border-[var(--border)] px-5 py-3">
              {t("pricing.enterprise.cta")}
            </a>
          </div>
        </div>

        <p className="mt-4 text-sm text-[var(--muted)]">{t("pricing.disclaimer")}</p>
      </div>
    </section>
  );
}
