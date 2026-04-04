import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">
          Ready for a Cleaner Space?
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          Book your professional cleaning service today. Available across all Australian regions 
          with same-day service in metro areas.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/book" 
            className="btn bg-accent-500 text-white hover:bg-accent-600 px-8 py-3 text-base"
          >
            Book Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link 
            href="/quote" 
            className="btn bg-white/10 text-white hover:bg-white/20 border border-white/20 px-8 py-3 text-base"
          >
            Get a Quote
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/60">
          All prices include GST • Fully insured • Police checked staff
        </p>
      </div>
    </section>
  );
}
