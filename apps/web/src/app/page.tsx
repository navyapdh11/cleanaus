import { HeroSection } from '@/components/home/hero-section';
import { ServiceAreasSection } from '@/components/home/service-areas-section';
import { ServicesSection } from '@/components/home/services-section';
import { WhyChooseUsSection } from '@/components/home/why-choose-us-section';
import { HowItWorksSection } from '@/components/home/how-it-works-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { CTASection } from '@/components/home/cta-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServiceAreasSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
