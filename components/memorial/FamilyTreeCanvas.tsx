'use client';

import React, { useMemo, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Node, 
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CitizenTreeNode from '@/components/tree/CitizenTreeNode';
import NodeDetailPanel from '@/components/tree/NodeDetailPanel';
import TreeFullscreenModal from '@/components/tree/TreeFullscreenModal';
import { CitizenRecord } from '@/lib/pb-server';

interface FamilyTreeCanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  currentCitizenId: string;
}

const nodeTypes = {
  citizenNode: CitizenTreeNode,
};

/**
 * US-402 & US-403 & US-405 & US-406: Canvas interactivo con nodos premium, panel de detalle y pantalla completa.
 */
export default function FamilyTreeCanvas({ initialNodes, initialEdges, currentCitizenId }: FamilyTreeCanvasProps) {
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenRecord | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Los nodos ya vienen posicionados desde FamilyTree (vía computeTreeLayout)
  const nodes = initialNodes;

  const onNodeClick = (_: any, node: Node) => {
    if (node.id !== currentCitizenId) {
      setSelectedCitizen(node.data as CitizenRecord);
      setIsPanelOpen(true);
    }
  };

  const onPaneClick = () => {
    setIsPanelOpen(false);
  };

  return (
    <div className="w-full h-[500px] border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/30 relative group">
      <ReactFlow
        nodes={nodes}
        edges={initialEdges}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onMoveStart={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        panOnScroll={false}
        zoomOnScroll={false}
        preventScrolling={true}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background color="#e7e5e4" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>

      {/* Botón de Pantalla Completa (US-405) */}
      <button
        onClick={() => setIsFullscreenOpen(true)}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur border border-border rounded-lg shadow-sm hover:bg-white hover:border-gold transition-all group/btn"
      >
        <span className="text-lg leading-none">⛶</span>
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-secondary group-hover/btn:text-primary">
          Ampliar
        </span>
      </button>

      {/* Panel de detalle (Bottom Sheet) */}
      <NodeDetailPanel 
        citizen={selectedCitizen} 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />

      {/* Modal de Pantalla Completa (US-405) */}
      <TreeFullscreenModal
        nodes={nodes}
        edges={initialEdges}
        currentCitizenId={currentCitizenId}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
      />
    </div>
  );
}
