import { useEffect, useState } from 'react';

export function Cookies(){
  const [show,setShow] = useState(!localStorage.getItem('cookieConsent'));

  const decide = (value:'accept'|'reject') => {
    const record = {
      value,
      timestamp: new Date().toISOString(),
      country: Intl.DateTimeFormat().resolvedOptions().locale.split('-')[1] || 'EU'
    };
    localStorage.setItem('cookieConsent', value);
    localStorage.setItem('cookieConsentMeta', JSON.stringify(record));
    try{ fetch('/api/consent',{method:'POST',body:JSON.stringify(record)}); }catch{}
    (window as any).analytics?.track('cookie_choice',{ value });
    setShow(false);
  };

  useEffect(()=>{
    if(!localStorage.getItem('cookieConsent')){
      localStorage.setItem('cookieConsent','reject');
    }
    if(localStorage.getItem('cookieConsent') !== 'accept'){
      (window as any).analytics = undefined;
    }
  },[]);

  if(!show) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--border)] p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-[var(--fg)]">We use cookies to improve your experience.</p>
      <div className="flex gap-2">
        <button aria-label="Accept cookies" className="rounded bg-[var(--brand)] text-[var(--brand-contrast)] px-4 py-2" onClick={()=>decide('accept')}>Accept</button>
        <button aria-label="Reject cookies" className="rounded border border-[var(--border)] px-4 py-2" onClick={()=>decide('reject')}>Reject</button>
      </div>
    </div>
  );
}
