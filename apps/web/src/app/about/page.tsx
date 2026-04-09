'use client';

import { AnimatedSection } from '@/components/ui/animated-section';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedBackground } from '@/components/ui/animated-background';
import {
  Award,
  Shield,
  Users,
  Target,
  Heart,
  Leaf,
  Star,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'Every cleaner is police-checked, fully insured, and rigorously trained. We believe in complete transparency with our customers.',
  },
  {
    icon: Star,
    title: 'Excellence in Service',
    description: 'We don\'t just clean spaces – we create experiences. Our 4.9/5 average rating reflects our commitment to exceptional quality.',
  },
  {
    icon: Leaf,
    title: 'Environmental Responsibility',
    description: 'Our eco-friendly cleaning options use organic, non-toxic products that are safe for your family, pets, and the environment.',
  },
  {
    icon: Heart,
    title: 'Customer-First Approach',
    description: 'Your satisfaction is our priority. With our money-back guarantee and dedicated support team, you\'re always in good hands.',
  },
  {
    icon: Users,
    title: 'Empowering Our Team',
    description: 'We pay fair wages, provide ongoing training, and create career pathways. Happy cleaners deliver better results.',
  },
  {
    icon: Target,
    title: 'Innovation & Technology',
    description: 'Our AI-powered matching system ensures you get the perfect cleaning team for your specific needs and preferences.',
  },
];

const milestones = [
  { year: '2020', title: 'Founded in Sydney', description: 'Started with a team of 5 cleaners and a vision to revolutionize the cleaning industry.' },
  { year: '2021', title: 'Expanded to Melbourne', description: 'Opened our second office and grew to 50+ team members across NSW and VIC.' },
  { year: '2022', title: 'AI-Powered Matching', description: 'Launched our proprietary AI system for optimal cleaner-customer matching.' },
  { year: '2023', title: 'National Coverage', description: 'Expanded to all 8 Australian states and territories with 300+ staff.' },
  { year: '2024', title: '25,000+ Cleanings', description: 'Reached a major milestone and maintained our 4.9/5 average rating.' },
  { year: '2025', title: 'Eco-Friendly Initiative', description: 'Launched our green cleaning range with 100% organic products.' },
  { year: '2026', title: 'Industry Leader', description: 'Recognized as Australia\'s #1 rated cleaning service with 42,000+ completed jobs.' },
];

const stats = [
  { label: 'Team Members', value: '535+', icon: Users },
  { label: 'Cleanings Completed', value: '42,000+', icon: CheckCircle },
  { label: 'Average Rating', value: '4.9/5', icon: Star },
  { label: 'Customer Retention', value: '94%', icon: TrendingUp },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground variant="aurora" speed={0.4} />

      {/* Hero */}
      <section className="relative py-20 px-4">
        <div className="max-w-[800px] mx-auto">
          <AnimatedSection className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md mb-6">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-white/70">Australia&apos;s Trusted Cleaning Service Since 2020</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              About CleanAUS
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              We&apos;re on a mission to transform how Australians experience cleaning services.
              Combining cutting-edge technology with genuine care, we deliver spotless results
              you can count on.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="relative px-4 pb-16">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <GlassCard className="text-center">
                  <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-sm text-white/50 mt-1">{stat.label}</p>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="relative py-16 px-4">
        <div className="max-w-[800px] mx-auto">
          <AnimatedSection>
            <GlassCard intensity="strong" className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  CleanAUS was born from a simple observation: the cleaning industry was stuck in the past.
                  Customers struggled to find reliable cleaners, and cleaners lacked the tools and recognition
                  they deserved.
                </p>
                <p>
                  In 2020, our founders set out to change this. They built a platform that combines
                  AI-powered matching with rigorous quality standards, creating a win-win for everyone
                  involved.
                </p>
                <p>
                  Today, we&apos;re proud to serve over 12,500 customers across Australia with a team
                  of 535+ dedicated professionals. But what really sets us apart isn&apos;t just our
                  technology – it&apos;s our people and our unwavering commitment to excellence.
                </p>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-16 px-4">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Our Values</span>
            </h2>
            <p className="mt-4 text-lg text-white/50 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.05}>
                <GlassCard className="h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4">
                    <value.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{value.description}</p>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-16 px-4 border-t border-white/5">
        <div className="max-w-[800px] mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Our Journey</span>
            </h2>
          </AnimatedSection>

          <div className="space-y-6">
            {milestones.map((milestone, i) => (
              <AnimatedSection key={milestone.year} delay={i * 0.05}>
                <GlassCard>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                        {milestone.year.slice(2)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm text-white/50">{milestone.year}</span>
                        <h3 className="font-semibold">{milestone.title}</h3>
                      </div>
                      <p className="text-sm text-white/60">{milestone.description}</p>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 border-t border-white/5">
        <div className="max-w-[800px] mx-auto text-center">
          <AnimatedSection>
            <GlassCard intensity="strong" className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Ready to Experience the Difference?
                </span>
              </h2>
              <p className="text-white/60 mb-6">
                Join thousands of happy Australians who trust CleanAUS for their cleaning needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/book"
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                  Book Your First Clean
                </a>
                <a
                  href="/contact"
                  className="rounded-xl bg-white/5 border border-white/20 px-8 py-4 font-semibold text-white transition-all hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Contact Us
                </a>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
