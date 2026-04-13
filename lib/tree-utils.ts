import dagre from 'dagre';
import { Node, Edge } from '@xyflow/react';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 120;

/**
 * US-402: Cálculo dinámico de layout usando Dagre.
 * Ordena los nodos de forma jerárquica top-down.
 */
export const computeTreeLayout = (nodes: Node[], edges: Edge[]) => {
  const g = new dagre.graphlib.Graph();
  
  // Configuración del grafo: Top-Bottom, espaciado entre nodos y niveles
  g.setGraph({ 
    rankdir: 'TB', 
    nodesep: 50, 
    ranksep: 100,
    marginx: 50,
    marginy: 50
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Añadir nodos al grafo
  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Añadir aristas al grafo
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Calcular el layout
  dagre.layout(g);

  // Aplicar las posiciones calculadas
  const positionedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
      // Aseguramos que los nodos sean visibles
      style: { opacity: 1 },
    };
  });

  return { nodes: positionedNodes, edges };
};
