'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Services', href: '/#services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled
          ? 'bg-bg/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto flex h-16 md:h-[72px] items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Sparkles className="h-7 w-7 text-blue-400 transition-transform group-hover:scale-110" />
            <motion.div
              className="absolute inset-0 h-7 w-7 text-blue-400"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-7 w-7" />
            </motion.div>
          </div>
          <span className="font-display text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CleanAUS
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white hover:bg-white/5 group"
            >
              {link.label}
              <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all group-hover:w-3/4" />
            </Link>
          ))}
          <Link
            href="/seo-dashboard"
            className="relative rounded-lg px-4 py-2 text-sm font-medium text-purple-400 transition-colors hover:text-purple-300 hover:bg-white/5 group"
          >
            SEO
            <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-purple-400 transition-all group-hover:w-3/4" />
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:1300253262"
            className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            <Phone className="h-4 w-4" />
            1300 CLEAN
          </a>
          <Link
            href="/book"
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95"
          >
            <span className="relative z-10">Book Now</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 hover:translate-x-full" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10 bg-bg/95 backdrop-blur-xl"
          >
            <nav className="px-4 py-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block rounded-xl px-4 py-3.5 text-base font-medium text-white/70 transition-colors hover:text-white hover:bg-white/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/seo-dashboard"
                  className="block rounded-xl px-4 py-3.5 text-base font-medium text-purple-400 transition-colors hover:text-purple-300 hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SEO Dashboard
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="pt-4 space-y-3"
              >
                <a
                  href="tel:1300253262"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-base font-medium text-white/80 transition-colors hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Phone className="h-5 w-5" />
                  1300 CLEAN
                </a>
                <Link
                  href="/book"
                  className="flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3.5 text-base font-semibold text-white shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Now
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
