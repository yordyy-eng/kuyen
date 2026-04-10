import React from 'react';
import CitizenCard from '@/components/CitizenCard';

const MockCitizens = [
  {
    name: "Cornelio Saavedra Rodríguez",
    role: "Coronel y Fundador de Angol",
    era: "Fundación de la Frontera",
    year: "1862",
    bio: "Militar y político chileno, responsable de la refundación definitiva de Angol. Su visión estratégica permitió establecer la ciudad como un punto neurálgico en la consolidación del territorio sur de Chile."
  },
  {
    name: "Mercedes Fuentes de la Fuente",
    role: "Profesora y Servidora Pública",
    era: "Legado Educacional",
    year: "1935",
    bio: "Dedicó su vida a la enseñanza en las escuelas rurales de la provincia de Malleco. Su compromiso con la alfabetización y la formación de valores transformó la vida de generaciones de anglinos."
  },
  {
    name: "General Basilio Urrutia",
    role: "Héroe de la Pacificación",
    era: "Siglo XIX",
    year: "1881",
    bio: "Comandante de las fuerzas de la frontera, clave en la pacificación y organización administrativa de la región. Su mausoleo es uno de los hitos arquitectónicos del cementerio."
  }
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Section Header */}
      <section className="mb-16 text-center lg:text-left">
        <div className="inline-block py-1 px-3 bg-surface border-l-2 border-gold mb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-medium text-secondary">
            Directorio Patrimonial
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
          Anglinos que hicieron <span className="text-gold italic">historia</span>
        </h2>
        <p className="mt-4 text-secondary max-w-2xl font-sans leading-relaxed">
          Explora la memoria de los hombres y mujeres que dieron forma a nuestra identidad ciudadana. 
          Cada piedra y cada nombre cuenta una parte del alma de Angol.
        </p>
      </section>

      {/* Grid Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {MockCitizens.map((citizen, index) => (
          <CitizenCard 
            key={index}
            name={citizen.name}
            role={citizen.role}
            era={citizen.era}
            bio={citizen.bio}
            year={citizen.year}
          />
        ))}
      </div>
    </div>
  );
}
