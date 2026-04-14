'use client';

import React, { useState, useRef } from 'react';
import { createCitizen } from '@/app/actions/citizens';
import { useFormState, useFormStatus } from 'react-dom';
import SEOFields from './SEOFields';

export default function CreateCitizenForm() {
  const [state, action] = useFormState(createCitizen, null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={action} className="space-y-8 pb-20">
      {/* 1. Header de Creación */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-3xl bg-stone-100 border-2 border-dashed border-border overflow-hidden flex items-center justify-center transition-all group-hover:border-gold">
              {preview ? (
                <img src={preview} alt="Retrato" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl opacity-20">👤</span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <span className="text-white text-[10px] uppercase font-bold tracking-widest">Subir Foto</span>
              </div>
            </div>
            <input 
              type="file" 
              name="portrait" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden" 
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-2 block font-sans">
              Nombre Completo del Ciudadano
            </label>
            <input 
              type="text" 
              name="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-white border-2 border-border/60 rounded-2xl px-6 py-3 text-xl font-serif text-primary focus:border-gold focus:ring-0 transition-all"
              placeholder="Ej: Cornelio Saavedra"
            />
          </div>
        </div>

        {/* 2. Toggles de Control Crítico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ToggleCard 
            id="published" 
            label="Visibilidad Pública" 
            description="El perfil será visible en el directorio." 
            defaultChecked={false}
            color="bg-green-500"
          />
          <ToggleCard 
            id="is_patrimonial" 
            label="Estatus Patrimonial" 
            description="Clasificado como bien de interés nacional." 
            defaultChecked={true}
            color="bg-amber-500"
          />
          <ToggleCard 
            id="exemption_active" 
            label="Exención Activa" 
            description="Beneficiario de protección tributaria." 
            defaultChecked={false}
            color="bg-blue-500"
          />
        </div>
      </div>

      {/* 3. Información Biográfica y Técnica */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-2 block font-sans">
              Categoría Patrimonial
            </label>
            <select 
              name="patrimonial_category" 
              defaultValue="Social"
              className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm font-sans focus:border-gold transition-all"
            >
              <option value="Militar">Militar</option>
              <option value="Educación">Educación</option>
              <option value="Social">Social</option>
              <option value="Política">Política</option>
              <option value="Religión">Religión</option>
              <option value="Artes">Artes</option>
              <option value="Fundación">Fundación</option>
              <option value="Comercio">Comercio</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-2 block font-sans">Año Nacimiento</label>
              <input type="number" name="birth_year" className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-2 block font-sans">Año Fallecimiento</label>
              <input type="number" name="death_year" className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest font-bold text-secondary/60 mb-2 block font-sans">
             Biografía Corta (Resumen para fichas)
          </label>
          <textarea 
            name="short_bio" 
            maxLength={280}
            className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm font-sans min-h-[140px] resize-none focus:border-gold transition-all"
            placeholder="Escribe un breve resumen de máximo 280 caracteres..."
          />
        </div>
      </div>

      {/* Control SEO */}
      <SEOFields 
        initialFullName={fullName}
      />

      {/* 4. Botones de Acción */}
      <div className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-md border-t border-border p-4 flex justify-end gap-4 z-20">
        <SubmitButton />
      </div>

      {state?.error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-sans border border-red-100 italic">
          ⚠️ {state.error}
        </div>
      )}
    </form>
  );
}

function ToggleCard({ id, label, description, defaultChecked, color }: any) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className={`
      relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3
      ${checked ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-white hover:border-stone-300'}
    `}>
      <input 
        type="checkbox" 
        name={id} 
        className="hidden" 
        checked={checked} 
        onChange={(e) => setChecked(e.target.checked)}
      />
      <div className={`
        w-10 h-6 rounded-full p-1 relative transition-all shrink-0
        ${checked ? color : 'bg-stone-300'}
      `}>
        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
      <div>
        <p className="text-xs font-sans font-bold text-primary leading-tight">{label}</p>
        <p className="text-[9px] text-secondary/60 mt-0.5 leading-tight">{description}</p>
      </div>
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`
        px-12 py-3 bg-gold text-primary font-sans font-bold rounded-xl transition-all shadow-lg
        ${pending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
      `}
    >
      {pending ? 'Creando...' : 'Crear Ciudadano'}
    </button>
  );
}
