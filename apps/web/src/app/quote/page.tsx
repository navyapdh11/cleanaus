'use client';

import { useState } from 'react';
import { AnimatedSection } from '@/components/ui/animated-section';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedBackground } from '@/components/ui/animated-background';
import {
  Calculator,
  Home,
  Building2,
  Sparkles,
  Mail,
  Phone,
  User,
  MessageSquare,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const serviceTypes = [
  { id: 'residential', label: 'Residential Cleaning', icon: Home, basePrice: 120 },
  { id: 'commercial', label: 'Commercial Cleaning', icon: Building2, basePrice: 200 },
  { id: 'deep', label: 'Deep Cleaning', icon: Sparkles, basePrice: 280 },
  { id: 'end-of-lease', label: 'End of Lease Cleaning', icon: Home, basePrice: 350 },
  { id: 'carpet', label: 'Carpet Cleaning', icon: Home, basePrice: 80 },
  { id: 'window', label: 'Window Cleaning', icon: Home, basePrice: 60 },
];

const addons = [
  { id: 'oven', label: 'Oven Cleaning', price: 45 },
  { id: 'fridge', label: 'Fridge Cleaning', price: 50 },
  { id: 'laundry', label: 'Laundry Fold & Organize', price: 35 },
  { id: 'eco', label: 'Eco-Friendly Products', price: 20 },
  { id: 'windows', label: 'Interior Windows', price: 60 },
  { id: 'carpet', label: 'Carpet Steam Clean', price: 80 },
];

export default function QuotePage() {
  const [step, setStep] = useState(1);
  const [quoteResult, setQuoteResult] = useState<null | { total: number; breakdown: string[] }>(null);
  const [formData, setFormData] = useState({
    serviceType: '',
    propertyType: 'house',
    bedrooms: '2',
    bathrooms: '1',
    floors: '1',
    addons: [] as string[],
    frequency: 'once',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const calculateQuote = () => {
    const service = serviceTypes.find((s) => s.id === formData.serviceType);
    if (!service) return;

    let basePrice = service.basePrice;

    // Adjust based on property size
    const bedroomMultiplier = parseInt(formData.bedrooms) > 3 ? 1.2 : 1;
    const bathroomMultiplier = parseInt(formData.bathrooms) > 2 ? 1.15 : 1;
    const floorMultiplier = parseInt(formData.floors) > 1 ? 1.1 : 1;

    basePrice *= bedroomMultiplier * bathroomMultiplier * floorMultiplier;

    // Add addons
    const addonTotal = formData.addons.reduce((total, addonId) => {
      const addon = addons.find((a) => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);

    // Frequency discount
    let discount = 0;
    if (formData.frequency === 'weekly') discount = 0.20;
    else if (formData.frequency === 'fortnightly') discount = 0.15;
    else if (formData.frequency === 'monthly') discount = 0.10;

    const subtotal = basePrice + addonTotal;
    const discountAmount = subtotal * discount;
    const totalBeforeGst = subtotal - discountAmount;
    const gst = totalBeforeGst * 0.10;
    const total = totalBeforeGst + gst;

    const breakdown = [
      `Base service: $${basePrice.toFixed(2)}`,
      `Add-ons: $${addonTotal.toFixed(2)}`,
      discount > 0 ? `Discount (${discount * 100}%): -$${discountAmount.toFixed(2)}` : '',
      `GST (10%): $${gst.toFixed(2)}`,
    ].filter(Boolean);

    setQuoteResult({ total: Math.round(total * 100) / 100, breakdown });
    setStep(2);
  };

  const toggleAddon = (id: string) => {
    setFormData({
      ...formData,
      addons: formData.addons.includes(id)
        ? formData.addons.filter((a) => a !== id)
        : [...formData.addons, id],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quote request submitted:', formData);
    setStep(3);
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground variant="aurora" speed={0.4} />

      {/* Hero */}
      <section className="relative py-20 px-4">
        <div className="max-w-[800px] mx-auto">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Instant Quote
            </h1>
            <p className="mt-4 text-lg text-white/60">
              Get a personalized quote in under 30 seconds
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative px-4 pb-20">
        <div className="max-w-[800px] mx-auto">
          <GlassCard intensity="strong" className="p-6 md:p-8">
            {/* Step 1: Quote Calculator */}
            {step === 1 && (
              <AnimatedSection>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-blue-400" />
                  Configure Your Cleaning
                </h2>

                <div className="mb-6">
                  <label className="block text-sm text-white/60 mb-2">Service Type</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {serviceTypes.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, serviceType: service.id })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.serviceType === service.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <service.icon className="h-5 w-5 text-blue-400 mb-2" />
                        <h3 className="font-semibold text-sm">{service.label}</h3>
                        <p className="text-xs text-white/50">From ${service.basePrice}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Bedrooms</label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n} className="bg-gray-900">{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Bathrooms</label>
                    <select
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n} className="bg-gray-900">{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Floors</label>
                    <select
                      value={formData.floors}
                      onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    >
                      {[1, 2, 3].map((n) => (
                        <option key={n} value={n} className="bg-gray-900">{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-white/60 mb-2">Add-On Services</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {addons.map((addon) => (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          formData.addons.includes(addon.id)
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{addon.label}</span>
                          <span className="text-sm text-white/60">+${addon.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-white/60 mb-2">Frequency</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: 'once', label: 'One-Time', discount: '' },
                      { id: 'weekly', label: 'Weekly', discount: '20% off' },
                      { id: 'fortnightly', label: 'Fortnightly', discount: '15% off' },
                      { id: 'monthly', label: 'Monthly', discount: '10% off' },
                    ].map((freq) => (
                      <button
                        key={freq.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, frequency: freq.id })}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          formData.frequency === freq.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <p className="text-sm font-medium">{freq.label}</p>
                        {freq.discount && (
                          <p className="text-xs text-green-400">{freq.discount}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={calculateQuote}
                  disabled={!formData.serviceType}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Calculate Quote
                  <ArrowRight className="h-4 w-4" />
                </button>
              </AnimatedSection>
            )}

            {/* Step 2: Quote Result */}
            {step === 2 && quoteResult && (
              <AnimatedSection>
                <h2 className="text-2xl font-bold mb-6">Your Quote</h2>

                <div className="rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 p-6 mb-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-white/60 mb-1">Estimated Total (incl. GST)</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      ${quoteResult.total} AUD
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    {quoteResult.breakdown.map((item, i) => (
                      <div key={i} className="flex justify-between text-white/70">
                        <span>{item.split(':')[0]}</span>
                        <span className="font-medium">${item.split(':$')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <h3 className="font-semibold mb-4">Request This Quote</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        <User className="h-4 w-4 inline mr-2" />
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                        placeholder="Smith"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                        placeholder="+61 4XX XXX XXX"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-white/60 mb-2">
                      <MessageSquare className="h-4 w-4 inline mr-2" />
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                      rows={3}
                      placeholder="Any specific requirements..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-xl bg-white/5 border border-white/10 py-3 font-medium text-white hover:bg-white/10 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
                    >
                      Submit Quote Request
                    </button>
                  </div>
                </form>
              </AnimatedSection>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <AnimatedSection className="text-center py-12">
                <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Quote Request Received! 📧</h2>
                <p className="text-white/60 mb-8">
                  Thank you, {formData.firstName}! Our team will review your requirements and send a detailed quote to {formData.email} within 2 hours.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                  Back to Home
                </a>
              </AnimatedSection>
            )}
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
