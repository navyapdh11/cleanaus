'use client';

import { useState } from 'react';
import { AnimatedSection } from '@/components/ui/animated-section';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedBackground } from '@/components/ui/animated-background';
import {
  Home,
  Building2,
  Leaf,
  Zap,
  Droplets,
  Wind,
  Sparkles,
  Hotel,
  Flame,
  CircleDot,
  Check,
  ArrowRight,
} from 'lucide-react';

const servicesData = [
  {
    id: 'regular-clean',
    icon: Home,
    title: 'Regular House Cleaning',
    category: 'residential',
    description: 'Standard recurring cleaning for homes and apartments',
    price: 120,
    duration: '2.5 hours',
    features: [
      'Dusting all surfaces',
      'Vacuuming and mopping',
      'Kitchen sanitizing',
      'Bathroom cleaning',
      'Trash removal',
    ],
    availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
    ecoFriendly: false,
  },
  {
    id: 'deep-clean',
    icon: Sparkles,
    title: 'Deep Cleaning',
    category: 'residential',
    description: 'Thorough top-to-bottom cleaning for homes that need extra attention',
    price: 280,
    duration: '5 hours',
    features: [
      'All regular cleaning tasks',
      'Inside cabinets and appliances',
      'Behind appliances',
      'Baseboard cleaning',
      'Light fixture dusting',
      'Window sills',
    ],
    availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT'],
    ecoFriendly: false,
  },
  {
    id: 'end-of-lease',
    icon: Home,
    title: 'End of Lease Cleaning',
    category: 'residential',
    description: 'Comprehensive bond cleaning to ensure full bond return',
    price: 350,
    duration: '6 hours',
    features: [
      'Full deep clean',
      'Oven cleaning included',
      'Window cleaning (interior)',
      'Carpet steam clean',
      'Wall spot cleaning',
      'Garage sweep',
      'Bond-back guarantee',
    ],
    availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
    ecoFriendly: false,
  },
  {
    id: 'office-clean',
    icon: Building2,
    title: 'Office Cleaning',
    category: 'commercial',
    description: 'Professional office and workspace cleaning services',
    price: 200,
    duration: '4 hours',
    features: [
      'Desk sanitizing',
      'Floor vacuuming/mopping',
      'Kitchen/breakroom cleaning',
      'Restroom sanitizing',
      'Trash removal',
      'Glass surface cleaning',
    ],
    availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT'],
    ecoFriendly: false,
  },
  {
    id: 'carpet-clean',
    icon: Droplets,
    title: 'Carpet Steam Cleaning',
    category: 'residential',
    description: 'Deep steam cleaning for carpets and rugs',
    price: 80,
    duration: '1.5 hours',
    features: [
      'Pre-vacuum',
      'Steam cleaning',
      'Stain treatment',
      'Deodorizing',
      'Eco-friendly products',
    ],
    availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT'],
    ecoFriendly: true,
  },
  {
    id: 'window-clean',
    icon: Wind,
    title: 'Window Cleaning',
    category: 'residential',
    description: 'Interior and exterior window cleaning',
    price: 60,
    duration: '1.5 hours',
    features: [
      'Interior glass cleaning',
      'Exterior glass cleaning',
      'Frame wiping',
      'Sill dusting',
      'Streak-free finish',
    ],
    availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT'],
    ecoFriendly: true,
  },
  {
    id: 'airbnb-turnover',
    icon: Hotel,
    title: 'Airbnb/Vacation Rental Turnover',
    category: 'specialized',
    description: 'Quick turnaround cleaning between guests',
    price: 150,
    duration: '2.5 hours',
    features: [
      'Linen change',
      'Bathroom sanitizing',
      'Kitchen reset',
      'Floor cleaning',
      'Restock essentials',
      'Damage check',
    ],
    availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT'],
    ecoFriendly: false,
  },
  {
    id: 'eco-clean',
    icon: Leaf,
    title: 'Eco-Friendly Cleaning',
    category: 'specialized',
    description: 'Environmentally friendly cleaning with organic products',
    price: 160,
    duration: '3 hours',
    features: [
      'Organic product cleaning',
      'Non-toxic sanitizing',
      'Natural deodorizing',
      'Eco-friendly floor care',
      'Safe for pets and children',
    ],
    availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT'],
    ecoFriendly: true,
  },
  {
    id: 'oven-clean',
    icon: Flame,
    title: 'Oven Cleaning (Add-On)',
    category: 'add_on',
    description: 'Deep cleaning for ovens and stovetops',
    price: 45,
    duration: '1 hour',
    features: [
      'Interior degreasing',
      'Rack cleaning',
      'Glass door cleaning',
      'Exterior polishing',
    ],
    availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
    ecoFriendly: false,
  },
  {
    id: 'pressure-wash',
    icon: CircleDot,
    title: 'Pressure Washing',
    category: 'residential',
    description: 'Outdoor pressure washing for driveways, patios, and walls',
    price: 180,
    duration: '2.5 hours',
    features: [
      'Driveway cleaning',
      'Patio cleaning',
      'Exterior wall spot cleaning',
      'Gutter exterior rinse',
    ],
    availableRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA'],
    ecoFriendly: false,
  },
];

const categories = [
  { id: 'all', label: 'All Services' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'specialized', label: 'Specialized' },
  { id: 'add_on', label: 'Add-Ons' },
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredServices = selectedCategory === 'all'
    ? servicesData
    : servicesData.filter((s) => s.category === selectedCategory);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground variant="aurora" speed={0.4} />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Our Services
            </h1>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
              Comprehensive cleaning solutions for every need. All prices include GST.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative px-4 pb-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative px-4 pb-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.05}>
                <GlassCard className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <service.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    {service.ecoFriendly && (
                      <span className="rounded-full bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1">
                        Eco-Friendly
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-white/60 mb-4">{service.description}</p>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      ${service.price}
                    </span>
                    <span className="text-sm text-white/50">AUD (incl. GST)</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-white/50 mb-4">
                    <span>⏱ {service.duration}</span>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-white/70">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {service.availableRegions.slice(0, 4).map((region) => (
                      <span key={region} className="text-xs bg-white/5 text-white/50 px-2 py-1 rounded">
                        {region}
                      </span>
                    ))}
                    {service.availableRegions.length > 4 && (
                      <span className="text-xs bg-white/5 text-white/50 px-2 py-1 rounded">
                        +{service.availableRegions.length - 4} more
                      </span>
                    )}
                  </div>

                  <button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
                    Book Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 border-t border-white/5">
        <div className="max-w-[800px] mx-auto text-center">
          <AnimatedSection>
            <GlassCard intensity="strong" className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Need a Custom Quote?
                </span>
              </h2>
              <p className="text-white/60 mb-6">
                Have specific requirements? We&apos;ll create a tailored cleaning plan for your property.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/quote"
                  className="rounded-xl bg-white/10 border border-white/20 px-8 py-4 font-semibold text-white transition-all hover:bg-white/15 hover:-translate-y-0.5"
                >
                  Get a Quote
                </a>
                <a
                  href="/book"
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                  Book Now
                </a>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
