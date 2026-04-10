import React from 'react';

interface CitizenProps {
  name: string;
  role: string;
  era: string;
  bio: string;
  year?: string;
}

const CitizenCard = ({ name, role, era, bio, year }: CitizenProps) => {
  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div className="p-6 flex flex-col h-full">
        {/* Era/Year */}
        <div className="text-xs uppercase tracking-widest text-secondary font-sans mb-3 flex justify-between items-center">
          <span>{era}</span>
          {year && <span className="text-secondary/60">{year}</span>}
        </div>

        {/* Name */}
        <h3 className="font-serif text-2xl text-primary leading-tight mb-1 group-hover:text-gold transition-colors">
          {name}
        </h3>

        {/* Role/Title */}
        <p className="font-serif italic text-gold text-lg mb-4">
          {role}
        </p>

        {/* Bio */}
        <p className="text-sm text-secondary font-sans leading-relaxed line-clamp-3 mb-6">
          {bio}
        </p>

        {/* Action Link */}
        <div className="mt-auto pt-4 border-t border-border/40">
          <button className="text-gold font-sans text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Ver memorial <span className="text-lg">↗</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitizenCard;
