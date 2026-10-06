"use server";

import { getSession } from "@/lib/auth";
import { formatMonthYear } from "@/lib/format";
import { getReporteFinanciero } from "@/services/reporte";
import type { ReporteFinanciero } from "@/types";

export type RangoReporte = 3 | 6 | 12;

function normalizarRango(valor: number): RangoReporte {
  return valor === 3 || valor === 12 ? valor : 6;
}

/**
 * Carga el reporte financiero del usuario para el rango indicado.
 * Se usa desde el server component (datos iniciales) y como refetch en el cliente.
 * Todos los valores ya vienen serializados (number/string), sin Decimal ni Date.
 */
export async function getReportesData(rango = 6): Promise<ReporteFinanciero> {
  const rangoValido = normalizarRango(rango);
  const session = await getSession();
  if (!session) {
    const ahora = new Date();
    return {
      rango: rangoValido,
      evolucion: [],
      promedioDiario: {
        etiquetaMesActual: formatMonthYear(ahora.getUTCFullYear(), ahora.getUTCMonth() + 1),
        diasTranscurridos: ahora.getUTCDate(),
        promedioActual: 0,
        promedioPrevio: 0,
        diferencia: 0,
        diferenciaPorcentaje: null,
      },
      variacionCategorias: [],
    };
  }

  return getReporteFinanciero(session.userId, rangoValido);
}
