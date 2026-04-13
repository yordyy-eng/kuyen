import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getQrByCode, markPlateAsPrinted } from '@/lib/pb-server';

/**
 * US-205 / T-506.7: Generador de Placas QR Nativo (SSR)
 * Genera un SVG compuesto con diseño Heritage para impresión física.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // 1. Validar registro en PocketBase
  const qrRecord = await getQrByCode(code);
  if (!qrRecord || !qrRecord.expand?.citizen) {
    return new NextResponse('Código QR no encontrado o no vinculado.', { status: 404 });
  }

  const citizen = qrRecord.expand.citizen;
  const targetUrl = `https://kuyen.cl/q/${code}`;

  try {
    // 2. Generar QR QR nativo (SVG String)
    const qrSvgString = await QRCode.toString(targetUrl, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#1C1917',  // stone-900 (Primary)
        light: '#FFFFFF'
      }
    });

    // 3. Componer el SVG de la Placa (Diseño Heritage)
    const plateWidth = 400;
    const plateHeight = 600;

    const finalSvg = `
      <svg width="${plateWidth}" height="${plateHeight}" viewBox="0 0 ${plateWidth} ${plateHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${plateWidth}" height="${plateHeight}" fill="white"/>
        <rect x="10" y="10" width="${plateWidth - 20}" height="${plateHeight - 20}" stroke="#1C1917" stroke-width="2"/>
        <rect x="15" y="15" width="${plateWidth - 30}" height="${plateHeight - 30}" stroke="#D4AF37" stroke-width="1"/>
        
        {/* Escudo de Angol Oficial */}
        <g id="escudo-angol" transform="translate(${plateWidth / 2 - 45}, 35)">
          <image 
            href="https://upload.wikimedia.org/wikipedia/commons/3/30/Escudo_de_Angol.svg" 
            width="90" 
            height="90"
          />
        </g>

        <text x="${plateWidth / 2}" y="160" font-family="serif" font-size="28" text-anchor="middle" font-weight="bold" fill="#1C1917">KUYEN</text>
        <text x="${plateWidth / 2}" y="190" font-family="serif" font-size="14" text-anchor="middle" letter-spacing="0.2em" fill="#D4AF37">HERITAGE PLATFORM</text>

        <line x1="100" y1="220" x2="${plateWidth - 100}" y2="220" stroke="#E7E5E4" />

        <text x="${plateWidth / 2}" y="270" font-family="serif" font-size="22" text-anchor="middle" fill="#1C1917">${citizen.full_name}</text>
        <text x="${plateWidth / 2}" y="300" font-family="sans-serif" font-size="12" text-anchor="middle" fill="#78716C">
          ${citizen.birth_year || '????'} — ${citizen.death_year || '????'}
        </text>

        <g transform="translate(${plateWidth / 2 - 90}, 330)">
          ${qrSvgString.replace('<?xml version="1.0" standalone="yes"?>', '').replace('width="100%" height="100%"', 'width="180" height="180"')}
        </g>

        <text x="${plateWidth / 2}" y="540" font-family="sans-serif" font-size="10" text-anchor="middle" font-weight="bold" fill="#1C1917">kuyen.cl/q/${code}</text>
        <text x="${plateWidth / 2}" y="560" font-family="sans-serif" font-size="8" text-anchor="middle" fill="#A8A29E italic">Escanea para conocer la historia completa</text>
      </svg>
    `.trim();

    // 4. Auditoría: Marcar como impreso
    await markPlateAsPrinted(qrRecord.id);

    // 5. Retornar respuesta con headers de descarga
    return new NextResponse(finalSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Disposition': `attachment; filename="placa-qr-${code}.svg"`,
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('[QR API] Error generating plate:', error);
    return new NextResponse('Error interno al generar la placa.', { status: 500 });
  }
}
