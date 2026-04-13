"use server";

import PocketBase from "pocketbase";
import { createAuthenticatedPB } from "@/lib/pb-server";

/**
 * US-511: Exportador de datos para el INE
 * Genera un CSV con las métricas de escaneo del último mes.
 */
export async function exportIneData() {
  const pb = await createAuthenticatedPB();
  
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  try {
    const logs = await pb.collection("scan_logs").getFullList({
      filter: `timestamp >= "${oneMonthAgo.toISOString()}"`,
      expand: "qr_code",
      sort: "-timestamp",
    });

    const headers = ["Fecha", "Memorial (Slug)", "Dispositivo", "OS", "Navegador", "Idioma"];
    const rows = logs.map(log => [
      log.timestamp,
      log.expand?.qr_code?.redirect_slug || "Desconocido",
      log.device || "N/A",
      log.os || "N/A",
      log.browser || "N/A",
      log.language || "N/A"
    ]);

    // Componer contenido CSV
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    return { success: true, csv: csvContent };
  } catch (error) {
    console.error("[US-511] Export Error:", error);
    return { success: false, error: "Error al generar el reporte estadístico." };
  }
}
