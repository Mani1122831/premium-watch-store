import { useEffect } from 'react';
import Hero from '../components/home/Hero';
import MensSection from '../components/home/MensSection';
import WomensSection from '../components/home/WomensSection';
import SmartSection from '../components/home/SmartSection';
import Collections from '../components/home/Collections';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';
import TrustSection from '../components/home/TrustSection';
import Newsletter from '../components/home/Newsletter';

export default function Home() {
  useEffect(() => {
    document.title = 'TITANOVA | TIME, REFINED — Luxury Swiss-Inspired Watches';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Hero />
      <MensSection />
      <WomensSection />
      <SmartSection />
      <Collections />
      <NewArrivals />
      <BestSellers />
      <TrustSection />
      <Newsletter />
    </div>
  );
}
