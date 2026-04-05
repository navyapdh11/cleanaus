'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, Menu, X, ImagePlus } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0f1a]/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <motion.div
              className="absolute inset-0 h-6 w-6 text-blue-400"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-6 w-6" />
            </motion.div>
          </div>
          <span className="font-display text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CleanAUS
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {['Services', 'Gallery', 'Pricing', 'About', 'Contact'].map((item) => (
            <Link
              key={item}
              href={item === 'Gallery' ? '/gallery' : item === 'Services' ? '/services' : item === 'Pricing' ? '/pricing' : item === 'About' ? '/about' : '/contact'}
              className="relative rounded-lg px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white hover:bg-white/5 group"
            >
              {item}
              <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-blue-400 to-purple-400 transition-all group-hover:w-3/4" />
            </Link>
          ))}
          <Link
            href="/seo-dashboard"
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-accent-400 transition-colors hover:text-accent-300 hover:bg-white/5 group"
          >
            SEO
            <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-accent-400 transition-all group-hover:w-3/4" />
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <a href="tel:1300-CLEAN" className="hidden lg:flex items-center text-sm font-medium text-white/70 hover:text-white transition-colors">
            <Phone className="mr-2 h-4 w-4" />
            1300 CLEAN
          </a>
          <Link
            href="/book"
            className="hidden sm:inline-flex relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95"
          >
            <span className="relative z-10">Book Now</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 hover:translate-x-full" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10 bg-[#0a0f1a]/95 backdrop-blur-xl"
          >
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {['Services', 'Gallery', 'Pricing', 'About', 'Contact', 'SEO Dashboard'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Gallery' ? '/gallery' : item === 'SEO Dashboard' ? '/seo-dashboard' : item === 'Services' ? '/services' : item === 'Pricing' ? '/pricing' : item === 'About' ? '/about' : '/contact'}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:text-white hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
