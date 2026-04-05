import Link from 'next/link';
import { Home, Building2, ClipboardList, Key, Droplets, Square } from 'lucide-react';

const services = [
  {
    icon: Home,
    title: 'Residential Cleaning',
    description: 'Regular house cleaning, deep cleans, and spring cleaning for your home.',
    href: '/services/residential',
    price: 'From $120',
  },
  {
    icon: Building2,
    title: 'Commercial Cleaning',
    description: 'Office cleaning, retail spaces, and commercial premises maintenance.',
    href: '/services/commercial',
    price: 'From $200',
  },
  {
    icon: ClipboardList,
    title: 'Strata Cleaning',
    description: 'Common area maintenance for strata properties and body corporates.',
    href: '/services/strata',
    price: 'Custom Quote',
  },
  {
    icon: Key,
    title: 'End of Lease Cleaning',
    description: 'Bond-back guaranteed vacate cleaning for tenants and landlords.',
    href: '/services/end-of-lease',
    price: 'From $250',
  },
  {
    icon: Droplets,
    title: 'Deep Cleaning',
    description: 'Intensive cleaning for kitchens, bathrooms, and high-traffic areas.',
    href: '/services/deep-clean',
    price: 'From $300',
  },
  {
    icon: Square,
    title: 'Window Cleaning',
    description: 'Interior and exterior window cleaning for homes and businesses.',
    href: '/services/window',
    price: 'From $150',
  },
];

export function ServicesSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold">Our Cleaning Services</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Comprehensive cleaning solutions for residential, commercial, and strata properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link 
              key={service.href}
              href={service.href}
              className="group block p-6 bg-card rounded-xl border hover:border-primary transition-all hover:shadow-lg"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">{service.price}</span>
                <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
