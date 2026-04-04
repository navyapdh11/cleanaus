import { Calendar, CreditCard, Sparkles, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Calendar,
    title: 'Book Online',
    description: 'Choose your service, select a date and time, and enter your details.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Pay securely with Stripe. All prices include GST.',
  },
  {
    icon: Sparkles,
    title: 'We Clean',
    description: 'Our professional team arrives fully equipped and ready to clean.',
  },
  {
    icon: CheckCircle,
    title: 'Satisfaction Guaranteed',
    description: 'Not happy? We\'ll re-clean within 24 hours at no extra cost.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold">How It Works</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Book your professional cleaner in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center relative">
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <step.icon className="h-8 w-8 text-white" />
              </div>
              <div className="absolute top-8 left-1/2 w-full h-0.5 bg-primary/20 hidden lg:block" style={{ transform: 'translateX(50%)' }} />
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
