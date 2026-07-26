'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const footerLinks = [
  { name: 'About', href: '/about' },
  { name: 'Help Center', href: '/help' },
  { name: 'Terms of Use', href: '/terms' },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Cookie Preferences', href: '/cookies' },
  { name: 'Contact Us', href: '/contact' },
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Youtube', icon: Youtube, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-black/50 border-t border-gray-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        {/* Social Links */}
        <div className="flex gap-4 mb-8">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                aria-label={social.name}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors focus:outline-none focus:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-500">
          <p>© {new Date().getFullYear()} MyStream. All rights reserved.</p>
          <p className="mt-2">
            Powered by{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
