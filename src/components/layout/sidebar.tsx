'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Film,
  Tv,
  Baby,
  Sparkles,
  Radio,
  List,
  Search,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTVMode } from '@/hooks/use-tv-mode';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Movies', href: '/movies', icon: Film },
  { name: 'TV Shows', href: '/tv', icon: Tv },
  { name: 'Kids', href: '/kids', icon: Baby },
  { name: 'Anime', href: '/anime', icon: Sparkles },
  { name: 'Live TV', href: '/live', icon: Radio },
  { name: 'Playlist', href: '/favorites', icon: List },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1); // -1 = search, 0-6 = nav items
  const pathname = usePathname();
  const router = useRouter();
  const { isTVMode } = useTVMode(); // Extract isTVMode from the returned object
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const searchRef = useRef<HTMLButtonElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  // TV Mode: Only expand if actually on a TV device (not just mode enabled)
  // Default is collapsed, only mouse hover or TV device auto-expands
  useEffect(() => {
    // Check if this is REALLY a TV device, not just TV mode override
    const userAgent = navigator.userAgent.toLowerCase();
    const isActualTVDevice = /tv|webos|tizen|roku|smarttv|googletv|appletv/.test(userAgent);
    
    if (isActualTVDevice && isTVMode) {
      setIsExpanded(true);
    }
    
    // Handle window resize - immediate response
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Update CSS custom property for sidebar width
      document.documentElement.style.setProperty(
        '--sidebar-width',
        isExpanded 
          ? (width < 768 ? '200px' : '240px')
          : '80px'
      );
      
      // Auto-collapse on mobile/tablet when resizing (unless actual TV device)
      if (width < 1024 && !isActualTVDevice && !isTVMode) {
        setIsExpanded(false);
      }
      
      // Force layout recalculation
      requestAnimationFrame(() => {
        document.body.style.width = '100%';
      });
    };
    
    // Initial setup
    handleResize();
    
    // Listen to resize events
    window.addEventListener('resize', handleResize);
    
    // Also handle orientation change for mobile devices
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isTVMode, isExpanded]);

  // TV Mode: Keyboard navigation for D-pad
  useEffect(() => {
    if (!isTVMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isSidebarFocused = activeElement?.closest('aside') !== null;
      const isMainContentFocused = activeElement?.closest('main') !== null;

      // Arrow Left: Return to sidebar from main content
      if (e.key === 'ArrowLeft' && isMainContentFocused) {
        e.preventDefault();
        setFocusedIndex(0); // Focus first item (Home)
        return;
      }

      // Only handle other keys if sidebar has focus
      if (!isSidebarFocused && focusedIndex < -1) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const newIndex = prev <= -1 ? navigation.length - 1 : prev - 1;
            return newIndex;
          });
          break;

        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => {
            const newIndex = prev >= navigation.length - 1 ? -1 : prev + 1;
            return newIndex;
          });
          break;

        case 'Enter':
          e.preventDefault();
          if (focusedIndex === -1) {
            // Search button
            setShowSearch(true);
          } else if (focusedIndex >= 0 && focusedIndex < navigation.length) {
            // Navigate to page
            const navItem = navigation[focusedIndex];
            router.push(navItem.href);
          }
          break;

        case 'ArrowRight':
          // Move focus out of sidebar to main content
          e.preventDefault();
          
          // Find first focusable element in main content
          const mainContent = document.querySelector('main');
          
          // Try to find focusable elements with more specificity
          const selectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            '[tabindex="0"]',
            '[tabindex]:not([tabindex="-1"])',
          ];
          
          let firstFocusable: HTMLElement | null = null;
          
          for (const selector of selectors) {
            const element = mainContent?.querySelector(selector) as HTMLElement;
            if (element) {
              firstFocusable = element;
              break;
            }
          }
          
          if (firstFocusable) {
            // Reset sidebar focus
            setFocusedIndex(-100); // Use special value to indicate "not in sidebar"
            firstFocusable.focus();
            
            // Log for debugging
            console.log('Focused element:', firstFocusable);
          } else {
            console.log('No focusable element found in main content');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTVMode, focusedIndex, router]);

  // Auto-focus the focused item
  useEffect(() => {
    if (!isTVMode) return;
    
    // -100 = focus is in main content, don't auto-focus sidebar
    if (focusedIndex === -100) return;

    if (focusedIndex === -1 && searchRef.current) {
      searchRef.current.focus();
    } else if (focusedIndex >= 0 && navRefs.current[focusedIndex]) {
      navRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isTVMode]);

  return (
    <>
      {/* Overlay when expanded on mobile/tablet */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Collapsed by default, expands on hover */}
      <motion.aside
        initial={false}
        animate={{
          width: isExpanded ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 200 : 240) : 80,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={cn(
          'fixed left-0 top-0 h-screen',
          'bg-gradient-to-r from-black/90 via-black/80 to-black/60 backdrop-blur-xl',
          'border-r border-white/10 z-50',
          'flex flex-col',
          'transition-shadow duration-300',
          isExpanded && 'shadow-2xl shadow-black/50'
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center px-4 border-b border-white/10">
          <Link
            href="/"
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-2"
          >
            <motion.div
              initial={false}
              animate={{
                scale: isExpanded ? 1 : 1.2,
              }}
              className="flex items-center"
            >
              {isExpanded ? (
                /* Expanded: Only show LogoText */
                <img 
                  src="/LogoText.png" 
                  alt="App Name" 
                  className="h-8 w-auto object-contain"
                />
              ) : (
                /* Collapsed: Only show Logo icon */
                <img 
                  src="/Logo.png" 
                  alt="App Logo" 
                  className="h-10 w-auto object-contain"
                />
              )}
            </motion.div>
          </Link>
        </div>

        {/* Search */}
        <div className="px-4 py-4 border-b border-white/10">
          {showSearch && isExpanded ? (
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="w-full bg-gray-900 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            </form>
          ) : (
            <button
              ref={searchRef}
              onClick={() => setShowSearch(true)}
              className={cn(
                'flex items-center space-x-3 w-full',
                'text-gray-400 hover:text-white transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary rounded-lg',
                isExpanded ? 'px-3 py-2' : 'justify-center py-2',
                isTVMode && focusedIndex === -1 && 'ring-2 ring-primary bg-gray-900'
              )}
            >
              <Search className="w-5 h-5 flex-shrink-0" />
              {isExpanded && (
                <span className="text-sm font-medium">Search</span>
              )}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1 px-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isFocused = isTVMode && focusedIndex === index;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  ref={(el) => {
                    navRefs.current[index] = el;
                  }}
                  className={cn(
                    'flex items-center space-x-3 rounded-lg transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary',
                    isExpanded ? 'px-4 py-3' : 'justify-center py-3',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900',
                    isFocused && 'ring-2 ring-primary bg-gray-900'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Expand/Collapse Toggle (Desktop only) */}
        <div className="hidden lg:block p-4 border-t border-white/10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'flex items-center space-x-3 w-full rounded-lg transition-colors',
              'text-gray-400 hover:text-white hover:bg-gray-900',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              isExpanded ? 'px-4 py-2' : 'justify-center py-2'
            )}
          >
            {isExpanded ? (
              <>
                <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            ) : (
              <ChevronRight className="w-5 h-5 flex-shrink-0" />
            )}
          </button>
        </div>
      </motion.aside>

      {/* Spacer to prevent content from going under sidebar - always 80px for collapsed sidebar */}
      <div className="w-20" />
    </>
  );
}
