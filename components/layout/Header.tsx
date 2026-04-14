import React from 'react';
import { SITE_CONFIG } from '@/constants/site-config';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-2xl font-serif tracking-tight cursor-pointer">
          {SITE_CONFIG.name.slice(0, 2)}<span className="text-gold font-semibold text-3xl">{SITE_CONFIG.name.slice(2)}</span>
        </div>
        
        {/* Mobile Menu Button - 44px minimum touch target */}
        <button 
          className="p-3 -mr-3 flex items-center justify-center rounded-md text-primary"
          aria-label="Menú principal"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-8 h-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
          </svg>
        </button>
      </nav>
    </header>
  );
};

export default Header;
