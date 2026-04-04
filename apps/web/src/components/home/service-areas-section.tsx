import { MapPin } from 'lucide-react';
import Link from 'next/link';

const regions = [
  { code: 'NSW', name: 'New South Wales', cities: 'Sydney, Newcastle, Wollongong' },
  { code: 'VIC', name: 'Victoria', cities: 'Melbourne, Geelong, Ballarat' },
  { code: 'QLD', name: 'Queensland', cities: 'Brisbane, Gold Coast, Sunshine Coast' },
  { code: 'WA', name: 'Western Australia', cities: 'Perth, Fremantle, Mandurah' },
  { code: 'SA', name: 'South Australia', cities: 'Adelaide, Mount Gambier' },
  { code: 'TAS', name: 'Tasmania', cities: 'Hobart, Launceston, Devonport' },
  { code: 'ACT', name: 'Australian Capital Territory', cities: 'Canberra' },
  { code: 'NT', name: 'Northern Territory', cities: 'Darwin, Alice Springs' },
];

export function ServiceAreasSection() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold">Service Areas Across Australia</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            We provide professional cleaning services in all Australian states and territories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regions.map((region) => (
            <Link 
              key={region.code}
              href={`/regions/${region.code.toLowerCase()}`}
              className="block p-6 bg-card rounded-xl border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl font-bold text-primary">{region.code}</span>
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{region.name}</h3>
              <p className="text-sm text-muted-foreground">{region.cities}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
