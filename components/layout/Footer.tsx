import React from 'react';
import { SITE_CONFIG } from '@/constants/site-config';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border py-8 mt-auto bg-surface">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="font-serif text-lg text-primary">{SITE_CONFIG.footer.brand}</p>
        <p className="text-sm text-secondary font-sans tracking-wide mt-1">
          {SITE_CONFIG.footer.organization}
        </p>
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-[10px] uppercase tracking-widest text-secondary/60">
            {SITE_CONFIG.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
