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
 * US-402 & US-403 & US-406: Canvas interactivo con nodos premium y panel de detalle.
 */
export default function FamilyTreeCanvas({ initialNodes, initialEdges, currentCitizenId }: FamilyTreeCanvasProps) {
  const [selectedCitizen, setSelectedCitizen] = useState<CitizenRecord | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // No necesitamos mapear más nodos ya que FamilyTree envía las props correctas
  // y estamos usando el custom nodeType 'citizenNode'.
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
    <div className="w-full h-[500px] border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/30 relative">
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

      {/* Panel de detalle (Bottom Sheet) */}
      <NodeDetailPanel 
        citizen={selectedCitizen} 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />
    </div>
  );
}
