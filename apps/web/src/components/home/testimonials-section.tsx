import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Sydney, NSW',
    rating: 5,
    text: 'Absolutely fantastic service! The team was professional, punctual, and did an amazing job. Will definitely book again.',
  },
  {
    name: 'James T.',
    location: 'Melbourne, VIC',
    rating: 5,
    text: 'Used CleanAUS for our office cleaning and we couldn\'t be happier. The AI scheduling is brilliant - always on time!',
  },
  {
    name: 'Emma L.',
    location: 'Brisbane, QLD',
    rating: 5,
    text: 'End of lease cleaning was perfect. Got my full bond back. The transparent pricing with GST included was a nice touch.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold">What Our Customers Say</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Trusted by thousands of customers across Australia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-card p-6 rounded-xl border">
              <div className="flex items-center mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
