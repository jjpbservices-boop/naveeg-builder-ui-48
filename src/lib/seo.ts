import { useEffect } from 'react';
import { useI18n } from '@/hooks/useI18n';

export function useHomeSEO(){
  const { t } = useI18n();
  useEffect(()=>{
    document.title = t('hero.title');
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if(!meta){
      meta = document.createElement('meta');
      meta.setAttribute('name','description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', t('hero.subtitle'));
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context":"https://schema.org",
      "@type":"Organization",
      "name":"Naveeg",
      "address":{"@type":"PostalAddress","addressCountry":"EU"},
      "sameAs":[
        "https://twitter.com/naveeg",
        "https://www.linkedin.com/company/naveeg"
      ]
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  },[t]);
}
