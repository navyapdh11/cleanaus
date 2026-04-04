import Link from 'next/link';
import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  services: [
    { label: 'Residential Cleaning', href: '/services/residential' },
    { label: 'Commercial Cleaning', href: '/services/commercial' },
    { label: 'Strata Cleaning', href: '/services/strata' },
    { label: 'End of Lease Cleaning', href: '/services/end-of-lease' },
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
};

export function Footer() {
  return (
    <footer className="border-t bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold">CleanAUS</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Enterprise-grade cleaning services across all Australian regions. 
              Professional, reliable, and fully insured.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <a href="tel:130025326" className="flex items-center text-muted-foreground hover:text-foreground">
                <Phone className="mr-2 h-4 w-4" />
                1300 CLEAN (1300 253 26)
              </a>
              <a href="mailto:info@cleanaus.com.au" className="flex items-center text-muted-foreground hover:text-foreground">
                <Mail className="mr-2 h-4 w-4" />
                info@cleanaus.com.au
              </a>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                Servicing all of Australia
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Regions</h3>
            <ul className="space-y-2">
              {footerLinks.regions.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold mb-4 mt-6">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CleanAUS Pty Ltd. All rights reserved. ABN: 12 345 678 901
            <br />
            All prices include GST. Servicing NSW, VIC, QLD, WA, SA, TAS, ACT & NT.
          </p>
        </div>
      </div>
    </footer>
  );
}
