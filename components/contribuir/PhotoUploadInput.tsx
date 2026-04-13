'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function PhotoUploadInput() {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Limpiar object URLs para evitar fugas de memoria
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    
    // Limitar a máximo 3 fotos
    if (previews.length + newFiles.length > 3) {
      alert('Puedes adjuntar un máximo de 3 fotografías.');
      syncInputFiles(previews.map(p => p.file)); // Reset input to current valid state
      return;
    }

    const newPreviews = newFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));

    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);
    syncInputFiles(updatedPreviews.map(p => p.file));
  };

  const removePhoto = (indexToRemove: number) => {
    const updatedPreviews = previews.filter((_, i) => i !== indexToRemove);
    setPreviews(updatedPreviews);
    syncInputFiles(updatedPreviews.map(p => p.file));
  };

  // Sincroniza la lista de archivos manipulada (DataTransfer) con el input nativo
  // Esto es crucial para que Server Actions reciba los archivos correctos
  const syncInputFiles = (files: File[]) => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    files.forEach(file => dt.items.add(file));
    inputRef.current.files = dt.files;
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-sans font-medium text-primary">
        Fotografías históricas <span className="text-secondary font-normal">(Opcional, máx. 3)</span>
      </label>
      
      {/* Botón visual para añadir */}
      {previews.length < 3 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex justify-center items-center px-4 py-6 border-2 border-dashed border-stone-300 rounded-xl bg-stone-50 hover:bg-stone-100 hover:border-gold transition-colors"
        >
          <span className="text-sm font-sans text-secondary">
            Haz clic aquí para seleccionar imágenes
          </span>
        </button>
      )}

      {/* Input nativo oculto */}
      <input
        ref={inputRef}
        type="file"
        name="photos"
        multiple
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Previsualizaciones */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={preview.url} className="relative aspect-square rounded-lg border border-border overflow-hidden bg-surface group">
              <img 
                src={preview.url} 
                alt={`Preview ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="bg-white text-red-600 rounded-full p-2 hover:scale-110 transition-transform shadow-md"
                  aria-label="Eliminar foto"
                >
                  <span className="text-sm font-bold w-4 h-4 flex items-center justify-center leading-none">✕</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
