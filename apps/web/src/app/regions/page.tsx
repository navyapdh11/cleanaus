'use client';

import { AnimatedSection } from '@/components/ui/animated-section';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { MapPin, Users, Star, ArrowRight } from 'lucide-react';

const regions = [
  {
    code: 'NSW',
    name: 'New South Wales',
    capital: 'Sydney',
    areas: ['Sydney CBD', 'Newcastle', 'Wollongong', 'Central Coast', 'Blue Mountains', 'Parramatta'],
    staff: 150,
    rating: 4.9,
    services: 12000,
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    code: 'VIC',
    name: 'Victoria',
    capital: 'Melbourne',
    areas: ['Melbourne CBD', 'Geelong', 'Ballarat', 'Bendigo', 'Dandenong', 'Frankston'],
    staff: 120,
    rating: 4.8,
    services: 9500,
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    code: 'QLD',
    name: 'Queensland',
    capital: 'Brisbane',
    areas: ['Brisbane CBD', 'Gold Coast', 'Sunshine Coast', 'Ipswich', 'Cairns', 'Townsville'],
    staff: 100,
    rating: 4.9,
    services: 8000,
    color: 'from-amber-500/20 to-orange-500/20',
  },
  {
    code: 'WA',
    name: 'Western Australia',
    capital: 'Perth',
    areas: ['Perth CBD', 'Fremantle', 'Mandurah', 'Joondalup', 'Rockingham', 'Bunbury'],
    staff: 60,
    rating: 4.7,
    services: 4500,
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    code: 'SA',
    name: 'South Australia',
    capital: 'Adelaide',
    areas: ['Adelaide CBD', 'Mount Gambier', 'Whyalla', 'Murray Bridge', 'Port Lincoln'],
    staff: 40,
    rating: 4.8,
    services: 3200,
    color: 'from-red-500/20 to-rose-500/20',
  },
  {
    code: 'TAS',
    name: 'Tasmania',
    capital: 'Hobart',
    areas: ['Hobart', 'Launceston', 'Devonport', 'Burnie', 'Ulverstone'],
    staff: 20,
    rating: 4.9,
    services: 1500,
    color: 'from-indigo-500/20 to-violet-500/20',
  },
  {
    code: 'ACT',
    name: 'Australian Capital Territory',
    capital: 'Canberra',
    areas: ['Canberra CBD', 'Belconnen', 'Woden Valley', 'Tuggeranong', 'Gungahlin'],
    staff: 30,
    rating: 4.8,
    services: 2400,
    color: 'from-teal-500/20 to-cyan-500/20',
  },
  {
    code: 'NT',
    name: 'Northern Territory',
    capital: 'Darwin',
    areas: ['Darwin', 'Alice Springs', 'Palmerston', 'Katherine', 'Nhulunbuy'],
    staff: 15,
    rating: 4.7,
    services: 900,
    color: 'from-orange-500/20 to-red-500/20',
  },
];

export default function RegionsPage() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground variant="aurora" speed={0.4} />

      {/* Hero */}
      <section className="relative py-20 px-4">
        <div className="max-w-[1280px] mx-auto">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Service Areas
            </h1>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
              Proudly servicing all Australian states and territories
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md">
              <MapPin className="h-5 w-5 text-green-400" />
              <span className="text-sm text-white/70">8 Regions • 535+ Staff • 42,000+ Cleanings</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Regions Grid */}
      <section className="relative px-4 pb-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regions.map((region, i) => (
              <AnimatedSection key={region.code} delay={i * 0.05}>
                <GlassCard className="h-full flex flex-col">
                  <div className={`absolute inset-0 bg-gradient-to-br ${region.color} opacity-50`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                        <MapPin className="h-6 w-6 text-white/80" />
                      </div>
                      <span className="text-2xl font-black bg-gradient-to-r from-white/80 to-white/40 bg-clip-text text-transparent">
                        {region.code}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-1">{region.name}</h3>
                    <p className="text-sm text-white/50 mb-4">Capital: {region.capital}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50 flex items-center gap-1">
                          <Users className="h-3 w-3" /> Staff
                        </span>
                        <span className="font-medium">{region.staff}+</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50 flex items-center gap-1">
                          <Star className="h-3 w-3" /> Rating
                        </span>
                        <span className="font-medium">{region.rating}/5</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">Services</span>
                        <span className="font-medium">{region.services.toLocaleString()}+</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-white/50 mb-2">Service Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {region.areas.slice(0, 4).map((area) => (
                          <span key={area} className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded">
                            {area}
                          </span>
                        ))}
                        {region.areas.length > 4 && (
                          <span className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded">
                            +{region.areas.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <a
                      href={`/book?region=${region.code}`}
                      className="w-full rounded-lg bg-white/10 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15 flex items-center justify-center gap-1"
                    >
                      Book in {region.code}
                      <ArrowRight className="h-3 w-3" />
                    </a>
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
                  Not Sure If We Cover Your Area?
                </span>
              </h2>
              <p className="text-white/60 mb-6">
                Enter your postcode and we&apos;ll check availability in your location instantly.
              </p>
              <a
                href="/book"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Check Availability
                <ArrowRight className="h-4 w-4" />
              </a>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
