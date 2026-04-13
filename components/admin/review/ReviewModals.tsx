'use client';

import React, { useRef, useState } from 'react';

interface Props {
  onApprove: (formData: FormData) => void;
  onReject: (formData: FormData) => void;
  isApproveLoading: boolean;
  isRejectLoading: boolean;
}

/**
 * US-505: ReviewModals — Modales de acción para aprobación y rechazo.
 * Usa el elemento <dialog> nativo de HTML5 para máxima accesibilidad y limpieza.
 */
export default function ReviewModals({ onApprove, onReject, isApproveLoading, isRejectLoading }: Props) {
  const approveModalRef = useRef<HTMLDialogElement>(null);
  const rejectModalRef = useRef<HTMLDialogElement>(null);
  const [rejectNote, setRejectNote] = useState('');

  const openApprove = () => approveModalRef.current?.showModal();
  const closeApprove = () => approveModalRef.current?.close();

  const openReject = () => rejectModalRef.current?.showModal();
  const closeReject = () => rejectModalRef.current?.close();

  return (
    <>
      <div className="flex items-center gap-4 py-8 border-t border-border mt-8">
        <button
          onClick={openReject}
          disabled={isApproveLoading || isRejectLoading}
          className="px-8 py-3 rounded-xl border-2 border-red-200 text-red-600 font-sans font-bold hover:bg-red-50 transition-all disabled:opacity-50"
        >
          Rechazar Propuesta
        </button>
        <button
          onClick={openApprove}
          disabled={isApproveLoading || isRejectLoading}
          className="flex-1 px-8 py-3 rounded-xl bg-gold text-primary font-sans font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          Aprobar y Publicar Cambios
        </button>
      </div>

      {/* Modal de Aprobación */}
      <dialog 
        ref={approveModalRef}
        className="rounded-3xl p-0 backdrop:bg-primary/40 backdrop:backdrop-blur-sm shadow-2xl border border-border w-full max-w-md"
      >
        <div className="p-8">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto">
            ⚖️
          </div>
          <h2 className="font-serif text-2xl text-center text-primary mb-2">Confirmar Aprobación</h2>
          <p className="text-sm text-secondary text-center mb-8 leading-relaxed">
            ¿Confirmas que deseas integrar esta contribución al repositorio público de KUYEN? Esta acción es irreversible y los cambios serán visibles de inmediato.
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={closeApprove}
              className="flex-1 px-4 py-2 text-sm font-sans font-bold text-secondary hover:bg-stone-100 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                // El formulario real estará en la página principal, este botón solo triggerea el submit
                const form = document.getElementById('review-form') as HTMLFormElement;
                if (form) {
                  const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
                  form.dispatchEvent(submitEvent);
                }
              }}
              className="flex-1 px-4 py-2 text-sm font-sans font-bold bg-gold text-primary rounded-xl hover:shadow-md transition-all"
            >
              Confirmar Publicación
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal de Rechazo */}
      <dialog 
        ref={rejectModalRef}
        className="rounded-3xl p-0 backdrop:bg-primary/40 backdrop:backdrop-blur-sm shadow-2xl border border-border w-full max-w-md"
      >
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onReject(fd);
            closeReject();
          }}
          className="p-8"
        >
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto">
            🚫
          </div>
          <h2 className="font-serif text-2xl text-center text-primary mb-2">Rechazar Propuesta</h2>
          <p className="text-sm text-secondary text-center mb-6">
            Es obligatorio indicar el motivo del rechazo para informar al contribuyente.
          </p>

          <textarea 
            name="reviewer_note"
            required
            minLength={10}
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="Ej: La información no coincide con registros oficiales o las fotos son de baja calidad..."
            className="w-full p-4 border border-border rounded-xl text-sm font-sans mb-6 min-h-[120px] focus:ring-red-200 focus:border-red-400"
          />

          <div className="flex gap-3">
            <button 
              type="button"
              onClick={closeReject}
              className="flex-1 px-4 py-2 text-sm font-sans font-bold text-secondary hover:bg-stone-100 rounded-xl transition-all"
            >
              Volver
            </button>
            <button 
              type="submit"
              disabled={rejectNote.length < 10 || isRejectLoading}
              className="flex-1 px-4 py-2 text-sm font-sans font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all"
            >
              Confirmar Rechazo
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
