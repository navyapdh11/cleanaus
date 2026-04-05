'use client';

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
} from 'lucide-react';

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

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0f1a] text-white overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="gradient" speed={0.8} />

      {/* 3D Scene overlay */}
      <div className="fixed inset-0 -z-5 pointer-events-none opacity-30">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Scene3D />
        </Canvas>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <AnimatedSection direction="right">
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                  <Sparkle className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-white/70">
                    Australia&apos;s #1 Rated Cleaning Service 2026
                  </span>
                </div>

                {/* Heading */}
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <TextReveal
                    text="Premium Cleaning"
                    className="block bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent"
                  />
                  <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Reimagined
                  </span>
                </h1>

                <p className="text-lg text-white/60 max-w-lg">
                  Experience the future of cleaning with AI-powered matching, real-time tracking,
                  and eco-friendly products across all Australian regions.
                </p>

                {/* CTA Buttons */}
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

                {/* Trust badges */}
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

            {/* Right: 3D visual area */}
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

      {/* Stats Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection>
            <BentoGrid columns={4}>
              {stats.map((stat, i) => (
                <BentoItem key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    <CountUp
                      end={stat.value}
                      decimals={stat.decimals || 0}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="mt-2 text-sm text-white/50">{stat.label}</p>
                </BentoItem>
              ))}
            </BentoGrid>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Our Services
              </span>
            </h2>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Comprehensive cleaning solutions tailored to your needs
            </p>
          </AnimatedSection>

          <BentoGrid columns={3}>
            {services.map((service, i) => (
              <BentoItem
                key={i}
                colSpan={service.span}
                delay={i * 0.15}
              >
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

      {/* Features Flashcards */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Why Choose CleanAUS
              </span>
            </h2>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              Click each card to discover what makes us different
            </p>
          </AnimatedSection>

          <FlashcardGrid
            cards={features.map((feature, i) => ({
              id: `feature-${i}`,
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
                    <p className="text-xs text-white/40">
                      ✓ Background checked ✓ Insured ✓ Rated 4.9+ stars
                    </p>
                  </div>
                </div>
              ),
            }))}
            autoFlip
            columns={4}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Book Online', desc: 'Choose your service in 60 seconds' },
              { step: '02', title: 'Get Matched', desc: 'AI assigns your perfect cleaning team' },
              { step: '03', title: 'We Clean', desc: 'Professional service, guaranteed quality' },
              { step: '04', title: 'Relax', desc: 'Enjoy your spotless space' },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
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

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-4xl text-center">
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
