'use client';

import { useState } from 'react';
import { AnimatedSection } from '@/components/ui/animated-section';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground variant="aurora" speed={0.4} />

      {/* Hero */}
      <section className="relative py-20 px-4">
        <div className="max-w-[800px] mx-auto">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="mt-4 text-lg text-white/60">
              We&apos;re here to help with any questions about our services
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative px-4 pb-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <AnimatedSection direction="right">
              <GlassCard intensity="strong" className="h-full">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                      <Phone className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-white/60">1300 CLEAN (1300 253 26)</p>
                      <p className="text-sm text-white/40">Mon-Fri: 8am-6pm AEST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                      <Mail className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-white/60">hello@cleanaus.com.au</p>
                      <p className="text-sm text-white/40">We respond within 2 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
                      <MapPin className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Headquarters</h3>
                      <p className="text-white/60">Sydney, NSW, Australia</p>
                      <p className="text-sm text-white/40">Servicing all Australian regions</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                      <Clock className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-white/60">Monday - Friday: 8am - 6pm</p>
                      <p className="text-white/60">Saturday: 9am - 4pm</p>
                      <p className="text-sm text-white/40">Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 p-6 border border-white/10">
                  <h3 className="font-semibold mb-2">Emergency Cleaning Services</h3>
                  <p className="text-sm text-white/60 mb-4">
                    Need urgent cleaning outside business hours? Call our emergency line.
                  </p>
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    1300 CLEAN (24/7)
                  </p>
                </div>
              </GlassCard>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection direction="left">
              <GlassCard intensity="strong" className="h-full">
                {submitted ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Message Sent! ✉️</h2>
                    <p className="text-white/60 mb-6">
                      Thank you for contacting us. We&apos;ll get back to you within 2 hours during business hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                      }}
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <MessageSquare className="h-6 w-6 text-blue-400" />
                      Send Us a Message
                    </h2>

                    <div className="mb-4">
                      <label className="block text-sm text-white/60 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-2">Phone (Optional)</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                          placeholder="+61 4XX XXX XXX"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm text-white/60 mb-2">Subject</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                        placeholder="How can we help?"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm text-white/60 mb-2">Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50"
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                    >
                      Send Message
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
