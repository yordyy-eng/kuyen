import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border py-8 mt-auto bg-surface">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="font-serif text-lg text-primary">Sistema KUYEN</p>
        <p className="text-sm text-secondary font-sans tracking-wide mt-1">
          Municipalidad de Angol
        </p>
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-[10px] uppercase tracking-widest text-secondary/60">
            Desarrollado sobre OCI • 2024
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
