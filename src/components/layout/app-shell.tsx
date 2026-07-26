'use client';

import { motion } from 'framer-motion';
import { Sidebar } from './sidebar';
import { Footer } from './footer';
import { pageVariants } from '@/styles/animations';

interface AppShellProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function AppShell({ children, showFooter = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1"
        >
          {children}
        </motion.main>
        
        {showFooter && <Footer />}
      </div>
    </div>
  );
}
