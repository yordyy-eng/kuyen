import React from 'react';
import dynamic from 'next/dynamic';
import { getRelationshipsByCitizenId, CitizenRecord } from '@/lib/pb-server';
import { computeTreeLayout } from '@/lib/tree-utils';
import { Node, Edge } from '@xyflow/react';

// US-402: Carga diferida del Canvas para evitar problemas con SSR en React Flow
const FamilyTreeCanvas = dynamic(
  () => import('./FamilyTreeCanvas'),
  { ssr: false, loading: () => <div className="w-full h-[500px] flex items-center justify-center bg-stone-50 rounded-2xl animate-pulse">Cargando árbol genealógico...</div> }
);

interface FamilyTreeProps {
  citizen: CitizenRecord;
}

/**
 * US-401 & US-402: Componente principal del Árbol Genealógico.
 * Obtiene los datos en el servidor y prepara el layout antes de enviar al cliente.
 */
export default async function FamilyTree({ citizen }: FamilyTreeProps) {
  // 1. Obtener todas las relaciones del ciudadano actual
  const relationships = await getRelationshipsByCitizenId(citizen.id);

  if (relationships.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-stone-200 rounded-3xl">
        <p className="text-secondary font-sans italic">Aún no se han registrado vínculos para este perfil patrimonial.</p>
      </div>
    );
  }

  // 2. Transformar registros en Nodos y Aristas para React Flow
  const nodeMap = new Map<string, Node>();
  const edges: Edge[] = [];

  // Agregar el nodo central (el ciudadano que estamos viendo)
  nodeMap.set(citizen.id, {
    id: citizen.id,
    data: { 
      ...citizen,
      relationLabel: 'Registro Actual',
      isCurrent: true
    },
    position: { x: 0, y: 0 },
    type: 'citizenNode',
  });

  // Procesar relaciones para crear nodos secundarios y aristas
  relationships.forEach((rel) => {
    const fromId = rel.from_citizen;
    const toId = rel.to_citizen;
    const expandFrom = rel.expand?.from_citizen;
    const expandTo = rel.expand?.to_citizen;

    // Determinar quién es el "otro" en la relación respecto al ciudadano central
    const targetCitizen = fromId === citizen.id ? expandTo : expandFrom;
    
    if (targetCitizen) {
      if (!nodeMap.has(targetCitizen.id)) {
        nodeMap.set(targetCitizen.id, {
          id: targetCitizen.id,
          data: { 
            ...targetCitizen,
            relationLabel: rel.relationship_type,
            isCurrent: false
          },
          position: { x: 0, y: 0 },
          type: 'citizenNode',
        });
      }

      // Crear la arista (Edge)
      // Para un árbol genealógico, intentamos mantener una dirección lógica si es posible,
      // pero por ahora seguiremos la dirección registrada en la DB.
      edges.push({
        id: `e-${rel.id}`,
        source: fromId,
        target: toId,
        label: rel.relationship_type,
        style: { stroke: '#a8a29e', strokeWidth: 1 },
        animated: false,
      });
    }
  });

  const nodes = Array.from(nodeMap.values());

  // 3. Calcular Layout con Dagre
  const { nodes: positionedNodes, edges: positionedEdges } = computeTreeLayout(nodes, edges);

  return (
    <section className="mt-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-stone-200"></div>
        <h2 className="text-2xl font-serif text-primary">Vínculos & <span className="text-gold italic">Genealogía</span></h2>
        <div className="h-px flex-1 bg-stone-200"></div>
      </div>
      
      <div className="relative">
        <FamilyTreeCanvas 
          initialNodes={positionedNodes} 
          initialEdges={positionedEdges} 
          currentCitizenId={citizen.id} 
        />
        
        {/* Leyenda sutil */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-stone-200 text-[10px] text-secondary font-sans pointer-events-none">
          Layout Jerárquico Top-Down
        </div>
      </div>
    </section>
  );
}
