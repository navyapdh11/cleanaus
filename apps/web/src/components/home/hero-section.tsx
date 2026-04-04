import Link from 'next/link';
import { Calendar, Shield, Award, Clock } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm mb-6">
              🇦🇺 Servicing All of Australia
            </div>
            <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight">
              Professional Cleaning
              <span className="block text-accent-300">Services Australia-Wide</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-xl">
              Enterprise-grade residential, commercial, and strata cleaning across all Australian regions. 
              Fully insured, police-checked, and satisfaction guaranteed.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book" className="btn bg-accent-500 text-white hover:bg-accent-600 px-8 py-3 text-base">
                <Calendar className="mr-2 h-5 w-5" />
                Book Online Now
              </Link>
              <Link href="/quote" className="btn bg-white/10 text-white hover:bg-white/20 border border-white/20 px-8 py-3 text-base backdrop-blur-sm">
                Get Instant Quote
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-accent-300 mr-2" />
                <span className="text-sm">Fully Insured</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-accent-300 mr-2" />
                <span className="text-sm">Police Checked Staff</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-accent-300 mr-2" />
                <span className="text-sm">Same Day Service</span>
              </div>
              <div className="flex items-center">
                <span className="text-accent-300 mr-2">★</span>
                <span className="text-sm">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent-400/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <h3 className="font-display text-xl font-semibold mb-6">Get an Instant Quote</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Type</label>
                    <select className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/50">
                      <option value="">Select service...</option>
                      <option value="residential">Residential Cleaning</option>
                      <option value="commercial">Commercial Cleaning</option>
                      <option value="strata">Strata Cleaning</option>
                      <option value="end-of-lease">End of Lease Cleaning</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Postcode</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 2000" 
                      className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/50"
                      maxLength={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Bedrooms</label>
                      <input type="number" min={0} defaultValue={2} className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bathrooms</label>
                      <input type="number" min={0} defaultValue={1} className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white" />
                    </div>
                  </div>
                  <button type="submit" className="w-full btn bg-accent-500 text-white hover:bg-accent-600 py-3">
                    Calculate Price
                  </button>
                </form>
                <p className="mt-4 text-xs text-center text-white/60">
                  All prices include GST (10%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
