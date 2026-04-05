'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene3D } from '@/components/ui/scene-3d';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { BentoGrid, BentoItem } from '@/components/ui/bento-grid';
import { Flashcard, FlashcardGrid } from '@/components/ui/flashcard';
import { AnimatedSection } from '@/components/ui/animated-section';
import { GlassCard } from '@/components/ui/glass-card';
import { TextReveal, CountUp } from '@/components/ui/micro-interactions';
import {
  Sparkles,
  Shield,
  Clock,
  Star,
  Home,
  Building2,
  Leaf,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkle,
  Award,
  Users,
  MapPin,
  Phone,
  Mail,
  Heart,
  Gem,
  TrendingUp,
  HeadphonesIcon,
  ChevronDown,
  ChevronUp,
  Quote,
  ArrowUpRight,
  Check,
} from 'lucide-react';

// ===== DATA =====
const services = [
  {
    icon: Home,
    title: 'Residential Cleaning',
    desc: 'Regular house cleaning, deep cleaning, and end-of-lease services',
    price: 'From $120',
    color: 'from-blue-500/20 to-cyan-500/20',
    span: 2 as const,
  },
  {
    icon: Building2,
    title: 'Commercial Cleaning',
    desc: 'Office spaces, retail, and commercial properties',
    price: 'From $200',
    color: 'from-purple-500/20 to-pink-500/20',
    span: 1 as const,
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    desc: 'Organic, non-toxic cleaning products',
    price: 'From $160',
    color: 'from-green-500/20 to-emerald-500/20',
    span: 1 as const,
  },
  {
    icon: Zap,
    title: 'Express Service',
    desc: 'Same-day booking available',
    price: 'From $180',
    color: 'from-amber-500/20 to-orange-500/20',
    span: 2 as const,
  },
];

const stats = [
  { label: 'Happy Customers', value: 12500, suffix: '+', prefix: '' },
  { label: 'Cleanings Completed', value: 45000, suffix: '+', prefix: '' },
  { label: 'Average Rating', value: 4.9, suffix: '/5', decimals: 1 },
  { label: 'Australian Regions', value: 8, suffix: '', prefix: '' },
];

const features = [
  { icon: Shield, title: 'Fully Insured', desc: 'Complete coverage for your peace of mind' },
  { icon: Award, title: 'Police Checked', desc: 'All staff undergo thorough background checks' },
  { icon: Clock, title: 'Same Day Service', desc: 'Book and get cleaned within hours' },
  { icon: Star, title: 'Satisfaction Guarantee', desc: '100% money-back guarantee' },
];

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Homeowner, Sydney',
    text: 'Absolutely incredible service! The team was professional, thorough, and left my home sparkling. The AI matching found the perfect cleaners for my needs.',
    rating: 5,
  },
  {
    name: 'James T.',
    role: 'Office Manager, Melbourne',
    text: 'We\'ve been using CleanAUS for our office for 6 months. Consistently excellent results and the online booking system makes it so easy.',
    rating: 5,
  },
  {
    name: 'Emma L.',
    role: 'Property Manager, Brisbane',
    text: 'The end-of-lease cleaning was flawless. Got our full bond back! The attention to detail was remarkable.',
    rating: 5,
  },
  {
    name: 'David K.',
    role: 'Restaurant Owner, Perth',
    text: 'Commercial cleaning that actually understands hospitality standards. Our hygiene ratings have never been better.',
    rating: 5,
  },
];

const faqItems = [
  {
    q: 'How do I book a cleaning service?',
    a: 'Simply click "Book Now", select your service type, preferred date and time, and complete the booking in under 60 seconds. Our AI will match you with the perfect cleaning team.',
  },
  {
    q: 'Are your cleaners insured and police checked?',
    a: 'Yes! Every CleanAUS team member is fully insured, police checked, and undergoes rigorous training. We also provide a satisfaction guarantee on every clean.',
  },
  {
    q: 'What\'s included in a standard clean?',
    a: 'Our standard clean includes all rooms, kitchen, bathrooms, vacuuming, mopping, dusting, and surface cleaning. Deep cleaning and add-ons are available for an additional fee.',
  },
  {
    q: 'Can I reschedule or cancel a booking?',
    a: 'Absolutely. You can reschedule or cancel up to 24 hours before your booking at no charge. Late cancellations may incur a small fee.',
  },
  {
    q: 'Do you bring your own equipment and products?',
    a: 'Yes, our team brings all professional-grade equipment and eco-friendly products. If you have specific product preferences, just let us know.',
  },
  {
    q: 'What areas do you service?',
    a: 'We service all Australian regions: NSW, VIC, QLD, WA, SA, TAS, ACT, and NT. Enter your postcode to check availability in your area.',
  },
];

const pricingPlans = [
  {
    name: 'Standard Clean',
    price: '120',
    desc: 'Perfect for regular maintenance',
    features: ['All rooms cleaned', 'Kitchen & bathrooms', 'Vacuuming & mopping', 'Surface dusting', 'Trash removal'],
    popular: false,
  },
  {
    name: 'Deep Clean',
    price: '200',
    desc: 'Thorough top-to-bottom clean',
    features: ['Everything in Standard', 'Inside cabinets & appliances', 'Window sills & tracks', 'Baseboards & light fixtures', 'Wall spot cleaning'],
    popular: true,
  },
  {
    name: 'End of Lease',
    price: '280',
    desc: 'Bond-back guaranteed',
    features: ['Everything in Deep Clean', 'Inside all cupboards', 'Oven & rangehood deep clean', 'Window cleaning (interior)', 'Carpet steam cleaning'],
    popular: false,
  },
];

const partners = [
  'Real Estate Institute', 'Australian Hotels Assoc', 'Strata Communities',
  'Eco Products Cert', 'Clean Industry Assoc', 'Business Chamber',
];

export default function HomePage() {
  return (
    <div className="relative bg-bg text-white overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="aurora" speed={0.6} />

      {/* 3D Scene overlay */}
      <div className="fixed inset-0 -z-5 pointer-events-none opacity-15">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Scene3D />
        </Canvas>
      </div>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="right">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                  <Sparkle className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-white/70">Australia&apos;s #1 Rated Cleaning Service 2026</span>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1]">
                  <TextReveal
                    text="Premium Cleaning"
                    className="block bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent"
                  />
                  <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Reimagined
                  </span>
                </h1>

                <p className="text-lg text-white/60 max-w-lg leading-relaxed">
                  Experience the future of cleaning with AI-powered matching, real-time tracking,
                  and eco-friendly products across all Australian regions.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold text-white shadow-2xl shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95">
                    <span className="relative z-10 flex items-center gap-2">
                      Book Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 hover:translate-x-full" />
                  </button>
                  <button className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:-translate-y-0.5 active:scale-95">
                    Get a Quote
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-4">
                  {[
                    { icon: Shield, text: 'Fully Insured' },
                    { icon: Award, text: 'Police Checked' },
                    { icon: Clock, text: 'Same Day' },
                    { icon: Star, text: '4.9/5 Rating' },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/50">
                      <badge.icon className="h-4 w-4" />
                      <span className="text-sm">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="left" delay={0.3}>
              <GlassCard intensity="strong" className="aspect-square max-w-lg mx-auto">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <Scene3D />
                </Canvas>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="relative py-8 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {['Trusted by 12,500+ customers', '4.9/5 average rating', 'All 8 Australian regions', '100% satisfaction guarantee'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/50">
                <Check className="h-4 w-4 text-green-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="relative py-20 px-4">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection>
            <BentoGrid columns={4}>
              {stats.map((stat) => (
                <BentoItem key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    <CountUp end={stat.value} decimals={stat.decimals || 0} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <p className="mt-2 text-sm text-white/50">{stat.label}</p>
                </BentoItem>
              ))}
            </BentoGrid>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="relative py-20 px-4">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Our Services</span>
            </h2>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Comprehensive cleaning solutions tailored to your needs
            </p>
          </AnimatedSection>

          <BentoGrid columns={3}>
            {services.map((service) => (
              <BentoItem key={service.title} colSpan={service.span} delay={0.15}>
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-50`} />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                      <service.icon className="h-6 w-6 text-white/80" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{service.title}</h3>
                      <p className="text-sm text-white/50">{service.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {service.price}
                    </span>
                    <button className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
                      Learn More →
                    </button>
                  </div>
                </div>
              </BentoItem>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-20 px-4">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">How It Works</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Book Online', desc: 'Choose your service in 60 seconds' },
              { step: '02', title: 'Get Matched', desc: 'AI assigns your perfect cleaning team' },
              { step: '03', title: 'We Clean', desc: 'Professional service, guaranteed quality' },
              { step: '04', title: 'Relax', desc: 'Enjoy your spotless space' },
            ].map((item) => (
              <AnimatedSection key={item.step} delay={parseInt(item.step) * 0.15}>
                <GlassCard className="relative text-center">
                  <div className="text-6xl font-black bg-gradient-to-br from-blue-400/20 to-purple-400/20 bg-clip-text text-transparent">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-white/50">{item.desc}</p>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="relative py-20 px-4">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Why Choose CleanAUS</span>
            </h2>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Click each card to discover what makes us different
            </p>
          </AnimatedSection>

          <FlashcardGrid
            cards={features.map((feature) => ({
              id: feature.title,
              front: (
                <div className="flex flex-col items-center justify-center text-center h-full gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <feature.icon className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-sm text-white/50">{feature.desc}</p>
                </div>
              ),
              back: (
                <div className="flex flex-col justify-center h-full gap-4">
                  <CheckCircle2 className="h-10 w-10 text-green-400" />
                  <h3 className="text-xl font-semibold">Verified & Trusted</h3>
                  <p className="text-white/60">
                    {feature.title} is more than just a promise. Every CleanAUS team member
                    is verified, trained, and committed to delivering exceptional results.
                  </p>
                  <div className="mt-2 rounded-lg bg-white/5 p-3">
                    <p className="text-xs text-white/40">✓ Background checked ✓ Insured ✓ Rated 4.9+ stars</p>
                  </div>
                </div>
              ),
            }))}
            autoFlip
            columns={4}
          />
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-20 px-4">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">What Our Customers Say</span>
            </h2>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Real reviews from real Australians
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <GlassCard className="h-full flex flex-col">
                  <Quote className="h-8 w-8 text-blue-400/30 mb-4" />
                  <p className="text-sm text-white/70 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-white/50">{t.role}</p>
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="relative py-20 px-4">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Transparent Pricing</span>
            </h2>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              All prices include GST. No hidden fees, ever.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <AnimatedSection key={plan.name} delay={i * 0.1}>
                <GlassCard className={`h-full flex flex-col ${plan.popular ? 'ring-2 ring-blue-500/50' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1">Most Popular</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-sm text-white/50 mt-1">{plan.desc}</p>
                  <div className="mt-6 mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">${plan.price}</span>
                    <span className="text-white/50 ml-2">AUD</span>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`mt-6 w-full rounded-xl py-3 font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
                    Book Now
                  </button>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="relative py-20 px-4">
        <div className="max-w-[800px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Frequently Asked Questions</span>
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PARTNERS ===== */}
      <section className="relative py-16 px-4 border-y border-white/5">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-center text-sm text-white/40 mb-8 uppercase tracking-wider">Trusted by industry leaders</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {partners.map((p) => (
              <span key={p} className="text-sm md:text-base text-white/30 font-medium">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="relative py-20 px-4">
        <div className="max-w-[600px] mx-auto text-center">
          <AnimatedSection>
            <GlassCard intensity="strong" className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay in the Loop</h3>
              <p className="text-white/60 mb-6">Get cleaning tips, exclusive offers, and 10% off your first booking.</p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25"
                />
                <button className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/25">
                  Subscribe
                </button>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-32 px-4">
        <div className="max-w-[800px] mx-auto text-center">
          <AnimatedSection direction="scale">
            <GlassCard intensity="strong" className="p-12 md:p-16">
              <h2 className="text-4xl md:text-6xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Ready for a Cleaner Space?
                </span>
              </h2>
              <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto">
                Join 12,500+ happy customers across Australia. Book your first cleaning today
                and get 15% off with code CLEAN15.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-10 py-4 text-lg font-semibold text-white shadow-2xl shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95">
                  <span className="relative z-10 flex items-center gap-2">
                    Book Your Cleaning
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 hover:translate-x-full" />
                </button>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

/* ===== FAQ ITEM ===== */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <GlassCard className="!p-0 !hover:transform-none" hover={false}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="font-medium pr-4">{question}</span>
        {open ? <ChevronUp className="h-5 w-5 text-white/50 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-white/50 flex-shrink-0" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-6 pb-6 text-sm text-white/60 leading-relaxed">{answer}</p>
      </div>
    </GlassCard>
  );
}
