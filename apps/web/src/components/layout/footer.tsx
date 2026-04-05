import Link from 'next/link';
import { Sparkles, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'Residential Cleaning', href: '/services/residential' },
    { label: 'Commercial Cleaning', href: '/services/commercial' },
    { label: 'Strata Cleaning', href: '/services/strata' },
    { label: 'End of Lease', href: '/services/end-of-lease' },
    { label: 'Deep Cleaning', href: '/services/deep-clean' },
    { label: 'Carpet Cleaning', href: '/services/carpet' },
  ],
  regions: [
    { label: 'New South Wales', href: '/regions/nsw' },
    { label: 'Victoria', href: '/regions/vic' },
    { label: 'Queensland', href: '/regions/qld' },
    { label: 'Western Australia', href: '/regions/wa' },
    { label: 'South Australia', href: '/regions/sa' },
    { label: 'Tasmania', href: '/regions/tas' },
    { label: 'ACT', href: '/regions/act' },
    { label: 'Northern Territory', href: '/regions/nt' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'GST Information', href: '/gst' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Cancellation Policy', href: '/cancellation-policy' },
    { label: 'Service Areas', href: '/service-areas' },
    { label: 'Support', href: '/support' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/cleanaus', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/cleanaus', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/cleanaus', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/cleanaus', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="bg-bg-alt border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-blue-400" />
              <span className="font-display text-xl font-bold">CleanAUS</span>
            </Link>
            <p className="mt-4 text-sm text-white/50 max-w-xs leading-relaxed">
              Enterprise-grade cleaning services across all Australian regions.
              Professional, reliable, and fully insured.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <a href="tel:1300253262" className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
                <Phone className="h-4 w-4" />
                1300 CLEAN (1300 253 262)
              </a>
              <a href="mailto:info@cleanaus.com.au" className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
                <Mail className="h-4 w-4" />
                info@cleanaus.com.au
              </a>
              <div className="flex items-center gap-2 text-white/50">
                <MapPin className="h-4 w-4" />
                Servicing all of Australia
              </div>
            </div>
            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 transition-all hover:bg-white/10 hover:text-white hover:border-white/20 hover:-translate-y-0.5"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/70 mb-4">Services</h3>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/70 mb-4">Regions</h3>
            <ul className="space-y-2.5">
              {footerLinks.regions.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/70 mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/70 mb-4 mt-8">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/70 mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40 text-center md:text-left">
              &copy; {new Date().getFullYear()} CleanAUS Pty Ltd. All rights reserved. ABN: 12 345 678 901
            </p>
            <p className="text-sm text-white/40">
              All prices include GST. Servicing NSW, VIC, QLD, WA, SA, TAS, ACT & NT.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
