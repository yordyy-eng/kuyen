import { NextRequest, NextResponse } from "next/server";
import { userAgent } from "next/server";
import PocketBase from "pocketbase";

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8091";

/**
 * US-511: Capturador de Métricas Pasivo y Redirección QR
 * Utiliza execution asíncrona (Fire and Forget) para optimizar latencia.
 */
export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const pb = new PocketBase(POCKETBASE_URL);
  const { device, browser, os } = userAgent(req);
  const headers = req.headers;
  
  // 1. Extraer datos pasivos para el reporte estadístico
  const ip = headers.get("x-forwarded-for")?.split(',')[0] || "unknown";
  const lang = headers.get("accept-language")?.split(',')[0] || "unknown";

  // 2. Ejecución asíncrona (Fire and Forget)
  // No usamos 'await' en el flujo principal para no retrasar la redirección al memorial
  const logMetrics = async () => {
    try {
      // Buscar el memorial vinculado al código QR
      const qrRecord = await pb.collection("qr_codes").getFirstListItem(`code='${code}'`);
      
      if (!qrRecord) return;

      await pb.collection("scan_logs").create({
        qr_code: qrRecord.id,
        timestamp: new Date().toISOString(),
        ip_hash: btoa(ip).slice(0, 12), // Anonimización básica
        device: device.model || "Desktop",
        os: os.name || "Unknown",
        browser: browser.name || "Unknown",
        language: lang,
        is_bot: browser.name?.toLowerCase().includes("bot") || false
      });
    } catch (e) {
      console.error("[US-511] Metric Capture Error:", e);
    }
  };

  // Disparar sin esperar
  logMetrics(); 

  // 3. Obtener el slug para la redirección (podríamos cachear esto si fuera necesario)
  try {
    const qrRecord = await pb.collection("qr_codes").getFirstListItem(`code='${code}'`);
    if (qrRecord) {
      return NextResponse.redirect(new URL(`/memorial/${qrRecord.redirect_slug}`, req.url));
    }
  } catch (err) {
    // Silently proceed to not-found
  }

  // Fallback
  return NextResponse.redirect(new URL("/not-found", req.url));
}
