import Link from 'next/link';
import { Sparkles, Phone, Menu, X } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold">CleanAUS</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
            Services
          </Link>
          <Link href="/regions" className="text-sm font-medium hover:text-primary transition-colors">
            Service Areas
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="/seo-dashboard" className="text-sm font-medium hover:text-primary transition-colors text-accent-600">
            SEO Dashboard
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <a href="tel:1300-CLEAN" className="hidden lg:flex items-center text-sm font-medium">
            <Phone className="mr-2 h-4 w-4" />
            1300 CLEAN
          </a>
          <Link href="/book" className="btn-primary">
            Book Now
          </Link>
          <button className="md:hidden p-2">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
