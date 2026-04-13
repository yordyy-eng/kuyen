'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const FamilyTreeCanvas = dynamic(
  () => import('./FamilyTreeCanvas'),
  { ssr: false, loading: () => <div className="w-full h-[500px] flex items-center justify-center bg-stone-50 rounded-2xl animate-pulse">Cargando árbol genealógico...</div> }
);

interface FamilyTreeClientWrapperProps {
  initialNodes: any[];
  initialEdges: any[];
  currentCitizenId: string;
}

export default function FamilyTreeClientWrapper({ initialNodes, initialEdges, currentCitizenId }: FamilyTreeClientWrapperProps) {
  return (
    <FamilyTreeCanvas 
      initialNodes={initialNodes} 
      initialEdges={initialEdges} 
      currentCitizenId={currentCitizenId} 
    />
  );
}
