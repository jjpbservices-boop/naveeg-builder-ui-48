import { Hero } from '@/sections/Hero';
import { Steps } from '@/sections/Steps';
import { Features } from '@/sections/Features';
import { Pricing } from '@/sections/Pricing';
import { Testimonials } from '@/sections/Testimonials';
import { FAQ } from '@/sections/FAQ';
import { FinalCTA } from '@/sections/FinalCTA';
import { LegalFooter } from '@/components/LegalFooter';
import { Cookies } from '@/components/Cookies';
import { useHomeSEO } from '@/lib/seo';

function LegacyHome(){
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Naveeg</h1>
      <p className="mt-2 text-sm opacity-70">Digital marketing tools that ship.</p>
    </main>
  );
}

export default function Home(){
  if(!import.meta.env.MARKETING_V2) return <LegacyHome/>;
  useHomeSEO();
  return (
    <>
      <Hero/>
      <Steps/>
      <Features/>
      <Pricing/>
      <Testimonials/>
      <FAQ/>
      <FinalCTA/>
      <LegalFooter/>
      <Cookies/>
    </>
  );
}
