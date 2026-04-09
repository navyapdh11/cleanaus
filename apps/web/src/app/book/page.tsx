'use client';

import { useState } from 'react';
import { AnimatedSection } from '@/components/ui/animated-section';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedBackground } from '@/components/ui/animated-background';
import {
  Calendar,
  Clock,
  MapPin,
  Home,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

const services = [
  { id: 'regular', name: 'Regular House Cleaning', price: 120, duration: '2.5h' },
  { id: 'deep', name: 'Deep Cleaning', price: 280, duration: '5h' },
  { id: 'end-of-lease', name: 'End of Lease Cleaning', price: 350, duration: '6h' },
  { id: 'office', name: 'Office Cleaning', price: 200, duration: '4h' },
  { id: 'carpet', name: 'Carpet Steam Cleaning', price: 80, duration: '1.5h' },
  { id: 'window', name: 'Window Cleaning', price: 60, duration: '1.5h' },
  { id: 'airbnb', name: 'Airbnb Turnover', price: 150, duration: '2.5h' },
  { id: 'eco', name: 'Eco-Friendly Cleaning', price: 160, duration: '3h' },
];

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
];

const australianStates = [
  { code: 'NSW', name: 'New South Wales' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'WA', name: 'Western Australia' },
  { code: 'SA', name: 'South Australia' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'ACT', name: 'Australian Capital Territory' },
  { code: 'NT', name: 'Northern Territory' },
];

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    suburb: '',
    state: '',
    postcode: '',
    bedrooms: '2',
    bathrooms: '1',
    specialInstructions: '',
  });

  const selectedService = services.find((s) => s.id === formData.service);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: submit to API
    console.log('Booking submitted:', formData);
    setStep(5); // Show success
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground variant="aurora" speed={0.4} />

      {/* Hero */}
      <section className="relative py-20 px-4">
        <div className="max-w-[800px] mx-auto">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Book Your Cleaning
            </h1>
            <p className="mt-4 text-lg text-white/60">
              Complete your booking in under 60 seconds
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="relative px-4 pb-8">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            {['Service', 'Date & Time', 'Your Details', 'Confirm'].map((label, i) => (
              <div key={label} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    i + 1 < step
                      ? 'bg-green-500 text-white'
                      : i + 1 === step
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                <span
                  className={`ml-2 text-sm hidden md:block ${
                    i + 1 <= step ? 'text-white/80' : 'text-white/40'
                  }`}
                >
                  {label}
                </span>
                {i < 3 && (
                  <div
                    className={`mx-4 h-0.5 w-12 md:w-20 transition-all ${
                      i + 1 < step ? 'bg-green-500' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="relative px-4 pb-20">
        <div className="max-w-[800px] mx-auto">
          <form onSubmit={handleSubmit}>
            <GlassCard intensity="strong" className="p-6 md:p-8">
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <AnimatedSection>
                  <h2 className="text-2xl font-bold mb-6">Select Your Service</h2>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, service: service.id })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.service === service.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{service.name}</h3>
                            <p className="text-sm text-white/50">{service.duration}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                              ${service.price}
                            </p>
                            <p className="text-xs text-white/50">incl. GST</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Bedrooms</label>
                      <select
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n} className="bg-gray-900">
                            {n} {n === 1 ? 'Bedroom' : 'Bedrooms'}
                          </option>
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
                          <option key={n} value={n} className="bg-gray-900">
                            {n} {n === 1 ? 'Bathroom' : 'Bathrooms'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <AnimatedSection>
                  <h2 className="text-2xl font-bold mb-6">Choose Date & Time</h2>

                  <div className="mb-6">
                    <label className="block text-sm text-white/60 mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-white/60 mb-2">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Preferred Time
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData({ ...formData, time })}
                          className={`py-3 rounded-xl text-sm font-medium transition-all ${
                            formData.time === time
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                              : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Step 3: Personal Details */}
              {step === 3 && (
                <AnimatedSection>
                  <h2 className="text-2xl font-bold mb-6">Your Details</h2>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
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
                      <label className="block text-sm text-white/60 mb-2">
                        Last Name
                      </label>
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

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
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
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                      placeholder="123 Example St"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Suburb</label>
                      <input
                        type="text"
                        value={formData.suburb}
                        onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                        placeholder="Sydney"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">State</label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                        required
                      >
                        <option value="" className="bg-gray-900">Select state</option>
                        {australianStates.map((s) => (
                          <option key={s.code} value={s.code} className="bg-gray-900">
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Postcode</label>
                      <input
                        type="text"
                        value={formData.postcode}
                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                        placeholder="2000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      <MessageSquare className="h-4 w-4 inline mr-2" />
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                      rows={3}
                      placeholder="Any specific requirements or access instructions..."
                    />
                  </div>
                </AnimatedSection>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <AnimatedSection>
                  <h2 className="text-2xl font-bold mb-6">Confirm Your Booking</h2>

                  <div className="space-y-4 mb-6">
                    <div className="rounded-xl bg-white/5 p-4">
                      <h3 className="text-sm text-white/60 mb-1">Service</h3>
                      <p className="font-semibold">{selectedService?.name}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-xl bg-white/5 p-4">
                        <h3 className="text-sm text-white/60 mb-1">Date & Time</h3>
                        <p className="font-semibold">{formData.date} at {formData.time}</p>
                      </div>
                      <div className="rounded-xl bg-white/5 p-4">
                        <h3 className="text-sm text-white/60 mb-1">Property</h3>
                        <p className="font-semibold">{formData.bedrooms} bed, {formData.bathrooms} bath</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4">
                      <h3 className="text-sm text-white/60 mb-1">Address</h3>
                      <p className="font-semibold">{formData.street}, {formData.suburb} {formData.state} {formData.postcode}</p>
                    </div>

                    <div className="rounded-xl bg-white/5 p-4">
                      <h3 className="text-sm text-white/60 mb-1">Contact</h3>
                      <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
                      <p className="text-sm text-white/50">{formData.email} | {formData.phone}</p>
                    </div>

                    <div className="rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm text-white/60 mb-1">Total (incl. GST)</h3>
                          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            ${selectedService?.price} AUD
                          </p>
                        </div>
                        <CheckCircle className="h-12 w-12 text-green-400" />
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Step 5: Success */}
              {step === 5 && (
                <AnimatedSection className="text-center py-12">
                  <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-4">Booking Confirmed! 🎉</h2>
                  <p className="text-white/60 mb-8">
                    Thank you, {formData.firstName}! We&apos;ve sent a confirmation email to {formData.email}.
                    Our AI is now matching you with the perfect cleaning team.
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5"
                  >
                    Back to Home
                  </a>
                </AnimatedSection>
              )}

              {/* Navigation Buttons */}
              {step < 5 && step > 0 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 1}
                    className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
                      step === 1
                        ? 'text-white/30 cursor-not-allowed'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>

                  {step === 4 ? (
                    <button
                      type="submit"
                      disabled={!formData.firstName || !formData.email || !formData.phone}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-3 font-semibold text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-green-500/40 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Confirm & Book
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        (step === 1 && !formData.service) ||
                        (step === 2 && (!formData.date || !formData.time)) ||
                        (step === 3 && (!formData.firstName || !formData.email || !formData.phone || !formData.street || !formData.suburb || !formData.state || !formData.postcode))
                      }
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </GlassCard>
          </form>
        </div>
      </section>
    </div>
  );
}
