'use client';

import React, { useEffect, useRef } from 'react';
import { Node, Edge, ReactFlow, Background, Controls } from '@xyflow/react';
import CitizenTreeNode from './CitizenTreeNode';
import NodeDetailPanel from './NodeDetailPanel';
import { CitizenRecord } from '@/lib/pb-server';

interface TreeFullscreenModalProps {
  nodes: Node[];
  edges: Edge[];
  currentCitizenId: string;
  isOpen: boolean;
  onClose: () => void;
}

const nodeTypes = {
  citizenNode: CitizenTreeNode,
};

/**
 * US-405: Modal de Pantalla Completa nativo.
 * Utiliza <dialog> para gestión de top-layer y bloqueo de scroll.
 */
export default function TreeFullscreenModal({ 
  nodes, 
  edges, 
  currentCitizenId, 
  isOpen, 
  onClose 
}: TreeFullscreenModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedCitizen, setSelectedCitizen] = React.useState<CitizenRecord | null>(null);
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const onNodeClick = (_: any, node: Node) => {
    if (node.id !== currentCitizenId) {
      setSelectedCitizen(node.data as unknown as CitizenRecord);
      setIsPanelOpen(true);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="
        w-[100dvw] h-[100dvh] max-w-none max-h-none m-0 p-0 
        bg-background outline-none
        backdrop:bg-white/95 backdrop:backdrop-blur-sm
      "
    >
      <div className="relative w-full h-full flex flex-col">
        {/* Cabecera del Modal */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-white z-10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gold font-sans font-bold">Vista Expandida</span>
            <h2 className="text-lg font-serif text-primary leading-none">Árbol Genealógico</h2>
          </div>
          
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 text-secondary hover:bg-stone-200 transition-colors"
            aria-label="Cerrar pantalla completa"
          >
            ✕
          </button>
        </header>

        {/* Cuerpo del Modal: Nuevo Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            onPaneClick={() => setIsPanelOpen(false)}
            onMoveStart={() => setIsPanelOpen(false)}
            nodeTypes={nodeTypes}
            fitView
            // En pantalla completa permitimos más libertad de interacción
            panOnScroll={true}
            zoomOnScroll={true}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
          >
            <Background color="#e7e5e4" gap={20} />
            <Controls showInteractive={false} position="bottom-right" />
          </ReactFlow>

          {/* Panel de detalle interno para el modal */}
          <NodeDetailPanel 
            citizen={selectedCitizen} 
            isOpen={isPanelOpen} 
            onClose={() => setIsPanelOpen(false)} 
          />
        </div>

        {/* Footer / Instrucciones sutiles */}
        <footer className="px-6 py-2 bg-stone-50 border-t border-border text-[9px] text-secondary font-sans text-center">
          Use dos dedos para hacer zoom • Toque un nodo para ver detalles
        </footer>
      </div>
    </dialog>
  );
}
