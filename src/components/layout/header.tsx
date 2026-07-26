'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { navbarVariants } from '@/styles/animations';
import { cn } from '@/lib/cn';
import { useSettingsStore } from '@/store/settings-store';
import { SearchBar } from './search-bar';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Movies', href: '/movies' },
  { name: 'TV Shows', href: '/tv' },
  { name: 'My List', href: '/favorites' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();
  const isTVMode = useSettingsStore((state) => state.isTVMode);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        variants={navbarVariants}
        initial="visible"
        animate={isScrolled ? 'scrolled' : 'visible'}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled && 'bg-background/95 backdrop-blur-md shadow-lg'
        )}
      >
        <nav className="px-4 md:px-8 lg:px-12 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
          >
            <span className="text-2xl md:text-3xl font-bold">
              <span className="text-white">My</span>
              <span className="text-primary">Stream</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-white',
                  'focus:outline-none focus:text-white',
                  pathname === item.href
                    ? 'text-white'
                    : 'text-gray-400'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {!isTVMode && (
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                aria-label="Search"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}

            {/* Notifications */}
            {!isTVMode && (
              <button
                className="p-2 text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}

            {/* Profile */}
            <Link
              href="/profile"
              className="p-2 text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
              aria-label="Profile"
            >
              <User className="w-5 h-5 md:w-6 md:h-6" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Menu"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="border-t border-gray-800"
            >
              <div className="px-4 md:px-8 lg:px-12 py-4">
                <SearchBar onClose={() => setShowSearch(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-64 bg-black/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col p-6 pt-24 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={cn(
                    'text-lg font-medium transition-colors',
                    pathname === item.href
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMenu(false)}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
