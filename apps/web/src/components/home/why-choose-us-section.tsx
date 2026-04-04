import { Shield, Award, Clock, Star, Banknote, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Fully Insured',
    description: '$20 million public liability insurance for your peace of mind.',
  },
  {
    icon: Award,
    title: 'Police Checked Staff',
    description: 'All cleaners have current National Police Checks.',
  },
  {
    icon: Clock,
    title: 'Same Day Service',
    description: 'Emergency cleaning available across all metro areas.',
  },
  {
    icon: Star,
    title: 'Satisfaction Guaranteed',
    description: '24-hour satisfaction guarantee or we\'ll re-clean for free.',
  },
  {
    icon: Banknote,
    title: 'Transparent Pricing',
    description: 'All prices include GST. No hidden fees, ever.',
  },
  {
    icon: CheckCircle,
    title: 'Quality Assured',
    description: 'AI-powered quality monitoring and feedback system.',
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold">Why Choose CleanAUS?</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Australia's most trusted cleaning service platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
